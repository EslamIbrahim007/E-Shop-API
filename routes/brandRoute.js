import express from'express';

const router = express.Router();
import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator

} from '../utils/Validators/brandValidators.js'
import { protect, allowTo } from "../services/authService.js"

import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage
} from "../services/brandService.js"
router.use(protect, allowTo('admin', 'manger'));

router
  .route('/')
  .get(getBrands)
  .post( uploadBrandImage, resizeImage,createBrandValidator, createBrand);
  
router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put( uploadBrandImage, resizeImage,updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router