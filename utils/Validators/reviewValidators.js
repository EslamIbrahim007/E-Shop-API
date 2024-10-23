/* eslint-disable no-undef */
import { check } from 'express-validator';
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import Review from "../../models/reviewModel.js";

export const getReviewValidator = [
  check('id').isMongoId().withMessage("Invalid Review id"),
  validatorMiddleware
];


export const createReviewValidator = [
  check('content').optional(),
  check('ratings')
    .notEmpty().withMessage('Rating required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  check('user')
    .isMongoId().withMessage('invalid rating id '),
  check('product')
    .isMongoId().withMessage('invalid rating id ')
    .custom((val, { req }) =>
      // Check if logged user create a review before 
      Review.findOne({ user: req.user._id, product: req.body.product }).then((review) => {
        console.log(review);
        if (review) {
          return Promise.reject(
            new Error('User has already reviewed this product')
          );
        }
      })
    ),
  validatorMiddleware
];

export const updateReviewValidator = [
  check('id').isMongoId().withMessage("Invalid Review id")
    .custom((val, { req }) =>
      //Check if the review if belong to this user or not before edit it
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error('Review not found'));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error('You are only allow to update your review '));
        }
      })
    ),
  validatorMiddleware
];

export const deleteReviewValidator = [
  check('id').isMongoId().withMessage("Invalid Review id").custom((val, { req }) => {
    //Check if the review if belong to this user or not before edit it
    if (req.user.role === "user") {
      return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error('Review not found'));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(new Error('You are only allow to delete your review '));
        }
      })
    }
    return true;
  }),
  validatorMiddleware
];