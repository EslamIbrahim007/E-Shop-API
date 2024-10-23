/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { check, body } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import CategoryModel from "../../models/categoryModel.js";
import SubCategoryModel from "../../models/subCategoryModel.js";
// eslint-disable-next-line import/order
import slugify from 'slugify';

export const createProductValidator = [
  check('title')
    .isLength({ min: 5 })
    .withMessage("the title must be at least 5 characters")
    .notEmpty()
    .withMessage("the product title must be entered")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check('description')
    .notEmpty()
    .withMessage("the description is required")
    .isLength({ max: 2000 })
    .withMessage("the description must be less than 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("sold product must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 32 })
    .withMessage("product price must be less than 32 digits"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product price AfterDiscount must be number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Product price AfterDiscount must be lower than actual product price")
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors field must be an array of strings"),
  check("imageCover")
    .notEmpty()
    .withMessage("Image cover is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("Image field must be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to specified category")
    .isMongoId()
    .withMessage("Invalid category ID")
    .custom((categoryID) =>
      CategoryModel.findById(categoryID).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`There is no category with this ID ${categoryID}`));
        }
      })),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("subCategories ID is invalid")
    .custom((subcategoriesIds) =>
      SubCategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`There is no subcategories with those ID `));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then((subcategories) => {
        const subCategoriesIdsInDb = [];
        subcategories.forEach((subcategory) => { subCategoriesIdsInDb.push(subcategory._id.toString()) });

        if (!val.every((v) => subCategoriesIdsInDb.includes(v))) {
          return Promise.reject(new Error("All subcategories must be from the same category"));
        }
      })
    )
  ,
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("subCategory ID is invalid"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("ratingAverage must be at least 1")
    .isLength({ max: 5 })
    .withMessage("ratingAverage must be at most 5"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),
  validatorMiddleware
];

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID"),
  validatorMiddleware
];


export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID"),
  body("title").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware
]
export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID"),
  validatorMiddleware
]

