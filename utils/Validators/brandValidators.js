/* eslint-disable no-undef */
import { check, body } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import slugify from 'slugify';

export const getBrandValidator = [
  check('id').isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware
];


export const createBrandValidator = [
  check('name').notEmpty().withMessage("Brand name is required")
    .isLength({ min: 3 }).withMessage("Too short for Brand name")
    .isLength({ max: 32 }).withMessage("Too long for Brand name")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

export const updateBrandValidator = [
  check('id').isMongoId().withMessage("Invalid Brand id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
];

export const deleteBrandValidator = [
  check('id').isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware
];