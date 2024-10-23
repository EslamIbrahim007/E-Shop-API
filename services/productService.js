import sharp from "sharp";
import asyncHandler from "express-async-handler";

import { deleteOne, updateOne, createOne, getOne, getAll } from "./handlerFactory.js"

import { uploadImages } from "../middleware/uploadImageMiddleware.js";

import ProductModel from "../models/ProductModel.js";




// middleware for uploading product images
export const uploadProductImages = uploadImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 }
]);

export const resizeImage = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  // image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `Product-${Date.now()}-cover.jpeg`

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    //save image into our DB
    req.body.imageCover = imageCoverFileName;
  };

  // image processing for images
  if (req.files.images) {
    req.body.images=[];
    await Promise.all(req.files.images.map(async (img, index) => {
      const imageName = `Product-${Date.now()}-${index + 1}.jpeg`;

      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageName}`);
      //save image into our DB
      req.body.images.push(imageName);
    }))
    next();
  }
});

//@desc GET Product
//@route Get /api/Product
//@access Public
export const getProducts = getAll(ProductModel, "Products")

//@desc GET specific product by id
//@route Get /api/products/:id
//@access Public
export const getProduct = getOne(ProductModel,"reviews");

//@desc create  product
//@route POST /api/products/
//@access private
export const createProduct = createOne(ProductModel)

//@desc UPDATE specific product by id
//@route PUT /api/products/:id
//@access private
export const updateProduct = updateOne(ProductModel)


//@desc DELETE specific product by id
//@route delete /api/products/:id
//@access private
export const deleteProduct = deleteOne(ProductModel)