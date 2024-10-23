/* eslint-disable no-undef */
import { check,body } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import slugify from 'slugify';

export const getSubCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid SubCategory id"),
  validatorMiddleware
];


export const createSubSubCategoryValidator = [
  check('name').notEmpty().withMessage("SubCategory name is required")
    .isLength({ min: 2 }).withMessage("Too short for SubCategory name")
    .isLength({ max: 32 }).withMessage("Too long for SubCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category').notEmpty().withMessage("Must seleted a main Category").isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleware
];

export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid SubCategory id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage("Invalid SubCategory id"),
  validatorMiddleware
];