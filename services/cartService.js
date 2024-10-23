/* eslint-disable no-unused-vars */
import asyncHandler from "express-async-handler";

import ApiError from '../utils/apiError.js';

import ProductModel from "../models/ProductModel.js";
import cartModel from "../models/cartModel.js";
import couponModel from '../models/couponModel.js'

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  // update the totalPrice
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

//@desc Add product to cart
//@route POST /api/cart/
//@access Protected/User
export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);

  //get logged user cart if it exist
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    // create a cart to the user with the selected product
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price
        }
      ]
    })
  } else {
    //product exist in  cart so we update the quantity
    const productIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId && item.color === color);
    if (productIndex > -1) {
      const currentCartItem = cart.cartItems[productIndex];
      currentCartItem.quantity += 1;
      cart.cartItems[productIndex] = currentCartItem
    } else {
      // this selected product does not exist or not match the 2 condition
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price
      })
    }
  };
  //Calculate the total price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'Success',
    msg: "Product added to your cart successfully",
    NumberOfCartItems: cart.cartItems.length,
    data: cart
  })
});


//@desc Show product in cart of looged user
//@route GET /api/cart/
//@access Protected/User

export const getCartOfLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no cart for this user yet", 404));
  };
  res.status(200).json({
    status: "success",
    NumberOfCartItems: cart.cartItems.length,
    date: cart
  })
});

//@desc remove cart from carts of logged user
//@route DELETE /api/cart/:itemId
//@access Protected/User
export const removespecificCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } }
    },
    { new: true });

  //reCalculate the total price
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    msg: "cart remove successfully",
    NumberOfCartItems: cart.cartItems.length,
    date: cart
  })
});

//@desc clear cart logged user
//@route DELETE /api/cart/clear
//@access Protected/User
export const clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id })

  res.status(204).json({
    status: "success",
    msg: "Cart is Empty",
  })
});

//@desc updare specific cart item quantity
//@route PUT /api/cart/:itemId
//@access Protected/User

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("There is no cart for this user yet", 404));
  };
  const itemIdex = cart.cartItems.findIndex((item) => 
    item._id.toString() === req.params.itemId
  );

  if (itemIdex > -1) {
    const cartItem = cart.cartItems[itemIdex];
    cartItem.quantity = quantity;

    cart.cartItems[itemIdex] = cartItem;
  } else {
    return next(new ApiError("There is no item ", 404));
  };
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
export const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await cartModel.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterCoupon = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
