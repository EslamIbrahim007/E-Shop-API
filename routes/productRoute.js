
import express from 'express';

const router = express.Router();
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImage
} from "../services/productService.js";
import reviewsRoute from "./reviewRoute.js"
import { protect, allowTo } from "../services/authService.js"

import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} from "../utils/Validators/productValidator.js"

//Nested route  prouducts/jdosnfisndddf(productID)/reviews
router.use('/:productId/reviews', reviewsRoute);

router
  .route('/')
  .get(getProducts)
  .post(protect, allowTo('manger', 'admin'), uploadProductImages, resizeImage,createProductValidator, createProduct);

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(protect, allowTo('manger', 'admin'), uploadProductImages, resizeImage, updateProductValidator, updateProduct)
  .delete(protect, allowTo('admin'), deleteProductValidator, deleteProduct);

export default router