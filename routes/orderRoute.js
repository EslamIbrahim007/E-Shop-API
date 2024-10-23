import  express from 'express'; 
const router = express.Router();

import { protect, allowTo } from '../services/authService.js';

import {
  createCashOrder
  , findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderStatusToPaid,
  updateOrderStatusToDelivered,
  checkOutSession
} from '../services/orderService.js'

router.use(protect);

router.get("/checkout-session/:cartId", allowTo('user'), checkOutSession)
router.post('/:cartId', allowTo('user'),createCashOrder)
router.get('/',
  allowTo('admin', 'manger', 'user'),
  filterOrderForLoggedUser,
  findAllOrders);

router.get('/:id',
  allowTo('admin', 'manger', 'user'),
  filterOrderForLoggedUser,
  findSpecificOrder);

router.put('/:id/paid',
  allowTo('admin', 'manger'),
  updateOrderStatusToPaid,);

router.put('/:id/deliver',
  allowTo('admin', 'manger'),
  updateOrderStatusToDelivered,);


export default router
