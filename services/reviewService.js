
import { deleteOne, updateOne, createOne, getOne,getAll} from "./handlerFactory.js"

import ReviewModel from "../models/reviewModel.js";




//Nested route
//Get /api/product/:productid/reviews

export const createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next()
};
//@desc GET ALl reviews
//@route Get /api/reviews/:id
//@access Public
export const getReviews = getAll(ReviewModel);


//@desc GET specific Review by id
//@route Get /api/Reviews/:id
//@access Public
export const getReview = getOne(ReviewModel)


export const setProductIdAndUserIdToBody = (req, res, next) => {
  //Nested route(create)
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next()
};

//@desc create  Review
//@route POST /api/Reviews/
//@access private/protect/user
export const createReview = createOne(ReviewModel)

//@desc UPDATE specific Review by id
//@route PUT /api/Reviews/:id
//@access private/protect/user
export const updateReview = updateOne(ReviewModel)

//@desc DELETE specific Review by id
//@route delete /api/Reviews/:id
//@access private/protect/user/admin/manger
export const deleteReview = deleteOne(ReviewModel)