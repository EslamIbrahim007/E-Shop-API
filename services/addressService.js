/* eslint-disable no-unused-vars */
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";


//@desc Add address to addresses list
//@route POST /api/addresses/
//@access Protected/User

export const addAddressToAddressesList = asyncHandler(async (req, res, next) => {
  //addToSet add address to addresses array if the address not exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses : req.body}
    },
    { new: true });
  
  res.status(200).json({
    status: "Success",
    message: "You added your address successfully",
    date: user.addresses
  })
});

//@desc remove address to addresses list
//@route DELETE /api/addresses/:addressId
//@access Protected/User

export const removeAddress = asyncHandler(async (req, res, next) => {
  //pull remove address from addresses array if the id not exist

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } }
    },
    { new: true });

  res.status(200).json({
    status: "Success",
    message: "You removed your address successfully",
    date: user.addresses
  })
});

//@desc get addresses
//@route GET /api/addresses
//@access Protected/User

export const getAddress = asyncHandler(async (req, res, next) => {
  //pull remove products to wishlist array if the id not exist

  const user = await UserModel.findById(req.user._id).populate('addresses');

  res.status(200).json({
    status: "Success",
    results: user.addresses.length,
    date: user.addresses
  })
});
