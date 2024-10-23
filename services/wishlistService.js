/* eslint-disable no-unused-vars */
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';
import UserModel from "../models/userModel.js";


//@desc Add product to wishlist
//@route POST /api/wishlist/
//@access Protected/User

export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  //addToSet add prpducts to wishlist array if the id not exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist : req.body.productId}
    },
    { new: true });
  
  res.status(200).json({
    status: "Success",
    message: "You added this product to the wishlist successfully",
    date: user.wishlist
  })
});

//@desc Add product to wishlist
//@route DELETE /api/wishlist/:productId
//@access Protected/User

export const removeProductToWishlist = asyncHandler(async (req, res, next) => {
  //pull remove products to wishlist array if the id not exist

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId }
    },
    { new: true });

  res.status(200).json({
    status: "Success",
    message: "You removed this product to the wishlist successfully",
    date: user.wishlist
  })
});

//@desc get wishlist  products
//@route DELETE /api/wishlist
//@access Protected/User

export const getWishlist = asyncHandler(async (req, res, next) => {
  //pull remove products to wishlist array if the id not exist

  const user = await UserModel.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    date: user.wishlist
  })
});
