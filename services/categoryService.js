import sharp from "sharp";
import asyncHandler from "express-async-handler";

import { deleteOne, updateOne, createOne, getOne, getAll } from "./handlerFactory.js"

import { uploadSingleImage } from '../middleware/uploadImageMiddleware.js';

import CategoryModel from "../models/categoryModel.js";
// upload single image
export const uploadCategoryImage = uploadSingleImage('image');

// resize image before saving to db
export const resizeImage = asyncHandler(async (req, res, next) =>  {
  const fileName = `Category-${Date.now()}.jpeg`

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);
    
    //save image into our DB
    req.body.image = fileName;
  }
  next();
});

//@desc GET category 
//@route Get /api/Categories/
//@access Public
export const getCategories = getAll(CategoryModel);


//@desc GET specific subcategory by id
//@route Get /api/subcCategories/:id
//@access Public
export const getCategory = getOne(CategoryModel);

//@desc create  category 
//@route POST /api/Categories/
//@access private
export const createCategory = createOne(CategoryModel);

//@desc UPDATE specific category by id
//@route PUT /api/Categories/:id
//@access private
export const updateCategory = updateOne(CategoryModel);

//@desc DELETE specific category by id
//@route delete /api/Categories/:id
//@access private
export const deleteCategory = deleteOne(CategoryModel);