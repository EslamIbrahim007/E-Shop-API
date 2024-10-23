import express from 'express';
const router = express.Router();
import {
  addProductToCart,
  getCartOfLoggedUser,
  removespecificCart,
  clearCart,
  updateCartItemQuantity,
  applyCoupon
} from "../services/cartService.js"
import { protect, allowTo } from '../services/authService.js';

router.use(protect, allowTo('user'))

router
  .post('/', addProductToCart)
  .get('/', getCartOfLoggedUser)
  .delete("/clear", clearCart);
  
router.put('/applyCoupon', applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removespecificCart);


export default router

