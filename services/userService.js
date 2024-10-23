/* eslint-disable no-unused-vars */
//a high-performance image processing library. You can use it to resize, crop, and manipulate images.
import sharp from "sharp";
//a utility to handle exceptions inside async Express routes and middleware.
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';
import bcrypt from "bcryptjs"
import createToken from "../utils/createToken.js";

import { deleteOne, createOne, getOne, getAll } from "./handlerFactory.js"

import UserModel from "../models/userModel.js";

import { uploadSingleImage } from '../middleware/uploadImageMiddleware.js';


// upload single image
export const uploadUserImage = uploadSingleImage('profileImg');
// resize image before saving to db
export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `User-${Date.now()}.jpeg`
  if (req.file) {
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    //save image into our DB
    req.body.profileImg = fileName;
  }
  next();
});

//@desc GET ALl User
//@route Get /api/Users/:id
//@access private
export const getUsers = getAll(UserModel);


//@desc GET specific User by id
//@route Get /api/Users/:id
//@access private
export const getUser = getOne(UserModel)

//@desc create  User
//@route POST /api/Users/
//@access private
export const createUser = createOne(UserModel)

//@desc UPDATE specific User by id
//@route PUT /api/Users/:id
//@access private
export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    role: req.body.role,
  }, { new: true });
  if (!document) {
    return next(new ApiError(`There is no document with this ID ${req.params.id}`, 404))
  };
  res.status(200).json({ msg: "document updated successfully ", User: document });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(req.params.id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, { new: true });

  if (!document) {
    return next(new ApiError(`There is no document with this ID ${req.params.id}`, 404))
  };
  res.status(200).json({ msg: "document updated successfully ", Brand: document });
});

//@desc DELETE specific User by id
//@route delete /api/Users/:id
//@access private
export const deleteUser = deleteOne(UserModel);

//@desc GEt logged User data
//@route GEt /api/Users/getMyInfo
//@access private
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc update logged User password
//@route PUT /api/Users/changeMyPassword
//@access private

export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //1) update user password paylod(req.user._id)
  const user = await UserModel.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, { new: true });

  //2) Generate token
  const token = createToken(user._id);
  res.status(200).json({ msg: "you  updated your Password successfully", user, token });
});

//@desc update logged User date (Without the password)
//@route PUT /api/Users/updateMyInfo
//@access private

export const updateLoggedUserDate = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body
  const updateUser = await UserModel.findByIdAndUpdate(req.user._id, {
    name: name,
    email: email,
    phone: phone,
  }, { new: true });
  res.status(200).json({ msg: "you  updated your info successfully", user: updateUser });
});


//@desc deactivate logged User
//@route PUT /api/Users/updateMyInfo
//@access private

export const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  
  res.status(204).json({
    status: "Success",
    msg:"User Deactivate successfully"
  })
})