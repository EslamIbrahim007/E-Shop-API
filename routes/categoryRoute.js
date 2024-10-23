import express from'express';
const router = express.Router();

import subCategoryRoute from './subCategoryRoute.js' 
import { protect, allowTo }from "../services/authService.js"
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator

} from '../utils/Validators/categoryValidators.js'

import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} from "../services/categoryService.js"

//Nested route 
router.use('/:categoryId/subcCategories', subCategoryRoute);
router
  .route('/')
  .get(getCategories)
  .post(protect, allowTo('manger','admin'),uploadCategoryImage, resizeImage,createCategoryValidator, createCategory);
  
router
  .route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(protect, allowTo('manger', 'admin'), uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
  .delete(protect, allowTo( 'admin'), deleteCategoryValidator,deleteCategory);

export default router