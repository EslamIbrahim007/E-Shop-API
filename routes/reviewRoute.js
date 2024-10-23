import express from 'express';

//mergeParams: Allows us to access parameters from onther routes
const router = express.Router({ mergeParams: true });
import {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator

} from '../utils/Validators/reviewValidators.js'

import { protect, allowTo } from "../services/authService.js"

import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdToBody
} from "../services/reviewService.js"

router
  .route('/')
  .get(
    createFilterObject,
    getReviews)
  .post(
    protect,
    allowTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview);
  
router
  .route('/:id')
  .get(
    getReviewValidator,
    getReview)
  .put(
    protect,
    allowTo('user'),
    updateReviewValidator,
    updateReview)
  .delete(
    protect,
    allowTo('admin', "manger", "user"),
    deleteReviewValidator,
    deleteReview);

export default router