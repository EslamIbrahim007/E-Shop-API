import express from 'express';

//mergeParams: Allows us to access parameters from onther routes
const router = express.Router({mergeParams:true});

import {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategortIdToBody,
  createFilterObject

} from "../services/subCategoryService.js"
import { protect, allowTo } from "../services/authService.js"

import {
  getSubCategoryValidator,
  createSubSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator
} from "../utils/Validators/subCategoryValidators.js"


router
  .route('/')
  .get(createFilterObject,getSubCategories)
  .post(protect, allowTo('manger', 'admin'), setCategortIdToBody,createSubSubCategoryValidator, createSubCategory);

router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(protect, allowTo('manger', 'admin'), updateSubCategoryValidator,updateSubCategory)
  .delete(protect, allowTo( 'admin'), deleteSubCategoryValidator,deleteSubCategory)


export default router
