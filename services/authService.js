/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//a utility to handle exceptions inside async Express routes and middleware.
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from '../utils/apiError.js';
import sendEmail from '../utils/sendEmails.js';
import crypto from 'crypto';
import createToken from "../utils/createToken.js";


import UserModel from "../models/userModel.js";


//@desc Sign Up
//@route POST /api/auth/signup
//@access Public
export const signUp = asyncHandler(async (req, res, next) => {
  // Destructure name, email, and password from req.body
  // const { name, email, password } = req.body;

  // 1-create a new user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });


  //2-Generate token
  const token = createToken(user._id)

  //3-Send response with token
  res.status(201).json({ data: user, token })
});

//@desc log in
//@route GET /api/auth/login
//@access Public
export const logIn = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body(validation);
  //2) check if user exist and if the password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  const comparePassword = await bcrypt.compare(req.body.password, user.password);
  if (!user || !comparePassword) {
    return next(new ApiError("Incorrect email or password", 404));
  }
  //3) Generate token
  const token = createToken(user._id)
  //4) SEND Response
  res.status(200).json({ data: user, token })
});

//@desc check if user is loged in or not
export const protect = asyncHandler(async (req, res, next) => {
  //1)check if token exist and store it in let 
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  };
  if (!token) {
    return next(new ApiError("You are not logged in plz log in first ", 401));
  };
  //2) check if token is valid or expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //3)check if the user existed
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("The user that belong to this token / id does not exist any more ", 401));
  };
  if (currentUser.active === false) {
    return next(new ApiError("Your account is not active. Please contact support team active it again ", 403));
  }
  //4) check if the user change his password
  if (currentUser.passwordChangedAt) {
    const passwordChangedToTimesStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    //password changed after token created (Error)
    if (passwordChangedToTimesStamp > decoded.iat) {
      return next(new ApiError("User recently changed password. Please log in again ", 401));
    };
  };
  //if everything is fine
  req.user = currentUser;
  next();
});
//@desc authorization (User permissions)
export const allowTo = (...roles) => asyncHandler(async (req, res, next) => {
  //1) access the role
  //2) access registered user from (req.user.role)

  const userRole = req.user.role;
  // Check if the user's role is allowed

  if (!roles.includes(userRole)) {
    return next(new ApiError("You are not allowed to perform this action ", 403));
  };
  next();
});

// @desc forget the password and reset it 
// @route POST /api/auth/forgetPassword/
// @access Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  //1) check if the user email is
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new ApiError("this Email is not exists please enter a valid/exist email", 400));
  };

  //2) if user exist, Generate a hash reset code 6 digies and save it in the database
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  // Generate a random integer between min and max
  const resetCode = Math.floor(Math.random() * (max - min + 1)).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //Save hashed resetCode into the DateBase
  user.passwordResetCode = hashResetCode;
  // Add expiration time for password reset code // Expires in 10 minutes
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  //3) send a email with the reset code
  const message = `Hi ${user.name}

    We receiveda request to rest your password in your E-Shop App.

    Please use the following code to reset your password: ${resetCode}

    Thanks for helping us keep ypur account secure
    The E-shop team
  `
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code (it's valid for 10 mins)",
      message
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;
    await user.save();
    return next(new ApiError("There was a problem during sending the Email", 500));
  }
  res.status(200).json({
    status: "Success",
    message: "Reset Code sent to your email address. Please check it and reset your password."
  });
});

// @desc verify the resetCode
// @route POST /api/auth/forgetPassword/
// @access Public

export const verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  //1)Get user based on hash resetcode
  const resetCode = req.body.resetCode;
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await UserModel.findOne({ passwordResetCode: hashResetCode, passwordResetExpires: { $gt: Date.now() } });
  if (!user) {
    return next(new ApiError("Invalid reset code or expired reset code", 400));
  };
  //2) ResetCode valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status:"Success"
  })
});


// @desc ResetPassword
// @route PUT /api/auth/ResetPassword/
// @access Public
export const resetPassWord = asyncHandler(async (req, res, next) => {
  //1) get user based on email
  const user = await UserModel.findOne({ email: req.body.email })
  if (!user) {
    return next(new ApiError("this email is not exists please enter a valid/exist email", 400));
  };
  //2) Check if the code verify
  if (!user.passwordResetVerified) {
    return next(new ApiError("Please verify the reset code first", 400));
  };
  //3) Reset password
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;
  await user.save();
  //4) if everything is okay then create a new token 
  const token = createToken(user._id);
  res.status(200).json({
    status: "Success",
    msg: "Reset Password done successfully.",
    token: token
  })
});

