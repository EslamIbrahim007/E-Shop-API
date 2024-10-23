//a high-performance image processing library. You can use it to resize, crop, and manipulate images.
import sharp from "sharp";
//a utility to handle exceptions inside async Express routes and middleware.
import asyncHandler from "express-async-handler";

import { deleteOne, updateOne, createOne, getOne,getAll} from "./handlerFactory.js"

import BrandModel from "../models/BrandModel.js";

import { uploadSingleImage } from '../middleware/uploadImageMiddleware.js';


// upload single image
export const uploadBrandImage = uploadSingleImage('image');
// resize image before saving to db
export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `Brand-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
  //save image into our DB
  req.body.image = fileName;
  next();
});

//@desc GET ALl Brand
//@route Get /api/brands/:id
//@access Public
export const getBrands = getAll(BrandModel);


//@desc GET specific Brand by id
//@route Get /api/brands/:id
//@access Public
export const getBrand = getOne(BrandModel)

//@desc create  Brand
//@route POST /api/brands/
//@access private
export const createBrand = createOne(BrandModel)

//@desc UPDATE specific Brand by id
//@route PUT /api/brands/:id
//@access private
export const updateBrand = updateOne(BrandModel)

//@desc DELETE specific Brand by id
//@route delete /api/Brands/:id
//@access private
export const deleteBrand = deleteOne(BrandModel)