import express from 'express';
const router = express.Router();

import { protect, allowTo } from '../services/authService.js';
import { addAddressToAddressesList, removeAddress, getAddress } from '../services/addressService.js';

router.use(protect, allowTo('user'),)
router
  .post('/', addAddressToAddressesList)
  .get('/', getAddress);
router.delete('/:addressId', removeAddress);


export default router