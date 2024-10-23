import express from 'express';
const router = express.Router();

import { protect, allowTo } from '../services/authService.js';
import { addProductToWishlist, removeProductToWishlist, getWishlist } from '../services/wishlistService.js';

router.use(protect, allowTo('user'),)
router
  .post('/', addProductToWishlist)
  .get('/', getWishlist);
router.delete('/:productId', removeProductToWishlist);


export default router