/* eslint-disable no-undef */
import { check } from 'express-validator';
import slugify from 'slugify';
import UserModel from "../../models/userModel.js";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";



export const signUpValidator = [
  check('name').notEmpty().withMessage("User name is required")
    .isLength({ min: 3 }).withMessage("Too short for User name")
    .isLength({ max: 32 }).withMessage("Too long for User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty().withMessage("your email is required")
    .isEmail().withMessage("you entered an invalid email")
    .custom((val) => UserModel.findOne({ email: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error('This email is already existed'))
      }
    })),
  check("password")
    .notEmpty().withMessage("your password is required")
    .isLength({ min: 8 }).withMessage("password must be at least 8 characters.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true
    }),
  check("passwordConfirm").notEmpty().withMessage("Your password confirmation is required"),

  validatorMiddleware
];

export const logInValidator = [
  check("email")
    .notEmpty().withMessage("your email is required")
    .isEmail().withMessage("you entered an invalid email"),
  check("password")
    .notEmpty().withMessage("your password is required")
    .isLength({ min: 8 }).withMessage("password must be at least 8 characters."),
  validatorMiddleware
];



