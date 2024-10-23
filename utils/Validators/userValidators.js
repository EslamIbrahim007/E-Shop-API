/* eslint-disable no-undef */
import { check, body } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import slugify from 'slugify';
import UserModel from "../../models/userModel.js";
import bcrypt from "bcryptjs"


export const getUserValidator = [
  check('id').isMongoId().withMessage("Invalid User id"),
  validatorMiddleware
];


export const createUserValidator = [
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
    .isEmpty().withMessage("your password is required")
    .isLength({ min: 8 }).withMessage("password must be at least 8 characters.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true
    }),
  check("passwordConfirm").notEmpty().withMessage("Your password confirmation is required"),
  check("profileImg").optional(),
  check("role").optional(),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage('Invalid phone numbers(acccept only Egy/ SA Numbers)'),


  validatorMiddleware
];

export const updateUserValidator = [
  check('id').isMongoId().withMessage("Invalid User id"),
  body("name").optional().custom((val, { req }) => {
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
  check("profileImg").optional(),
  check("role").optional(),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage('Invalid phone numbers(acccept only Egy/ SA Numbers)'),

  validatorMiddleware
];
export const changeUserPasswordValidator = [
  check('id').isMongoId().withMessage("Invalid User id"),
  body("currentPassword")
    .notEmpty().withMessage("Your current password is required"),
  body("passwordConfirm").notEmpty().withMessage("Your password Confirmtion is required"),
  body("password")
    .notEmpty().withMessage("Your current password is required")
    .custom(async (password, { req }) => {
      // 1) Verify  the current password
      const user = await UserModel.findOne({ _id: req.params.id })
      if (!user) {
        throw new Error('There is no user with this ID');
      };
      const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      };

      //2) Verify  the confirm password
      if (password !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export const deleteUserValidator = [
  check('id').isMongoId().withMessage("Invalid User id"),
  validatorMiddleware
];

export const updateMyDateValidator = [
  body("name").optional().custom((val, { req }) => {
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
  check("profileImg").optional(),
  check("phone").optional().isMobilePhone(["ar-EG", "ar-SA"]).withMessage('Invalid phone numbers(acccept only Egy/ SA Numbers)'),

  validatorMiddleware
];