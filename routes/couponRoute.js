import express from 'express';
const router = express.Router();

import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon
} from '../services/coupomService.js';

import { protect, allowTo } from '../services/authService.js';

router.use(protect, allowTo('admin', 'manger'));

router
  .post('/', createCoupon)
  .get('/', getAllCoupons);

router
  .route('/:id')
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default router;


