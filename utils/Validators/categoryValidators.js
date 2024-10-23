/* eslint-disable no-undef */
import { check, body } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import slugify from 'slugify';

export const getCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid category id"),
  validatorMiddleware
];


export const createCategoryValidator = [
  check('name').notEmpty().withMessage("category name is required")
    .isLength({ min: 3 }).withMessage("Too short for category name")
    .isLength({ max: 32 }).withMessage("Too long for category name")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

export const updateCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid category id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

export const deleteCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid category id"),
  validatorMiddleware
];