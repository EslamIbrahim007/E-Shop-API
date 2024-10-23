import { deleteOne, updateOne, createOne, getOne, getAll } from "./handlerFactory.js"

import CouponModel from "../models/couponModel.js";

//@desc get all Coupons
//@route PUT /api/coupons
//@access private admin /manger

export const getAllCoupons = getAll(CouponModel);


//@desc get Coupon
//@route PUT /api/coupons/:couponId
//@access private admin /manger

export const getCoupon = getOne(CouponModel);

//@desc Create Coupon
//@route POST /api/coupons
//@access private admin /manger

export const createCoupon = createOne(CouponModel);


//@desc delete Coupon
//@route DELETE /api/coupons/:couponId
//@access private admin /manger

export const deleteCoupon = deleteOne(CouponModel);


//@desc update Coupon
//@route PUT /api/coupons/:couponId
//@access private admin /manger

export const updateCoupon = updateOne(CouponModel);