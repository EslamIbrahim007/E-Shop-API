/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET)
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';
import { deleteOne, updateOne, createOne, getOne, getAll } from "./handlerFactory.js"

import ProductModel from "../models/ProductModel.js";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js"

//@desc Add order paided in cash
//@route POST /api/orders/cardId
//@access Protected/User

export const createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const cardIdShippingPrice = 0;
  //1) Get Cart depend on cartId
  const userCart = await cartModel.findById(req.params.cartId);
  if (!userCart) {
    return next(new ApiError(`there is on cart with this ID${req.params.cartId}`, 404))
  };
  //2) get order price from the cart but we check if there a coupon
  const cartPrice = userCart.totalPriceAfterCoupon ? userCart.totalPriceAfterCoupon : userCart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + cardIdShippingPrice;
  //3) create the order with cash method
  const order = await orderModel.create({
    user: req.user._id,
    orderItems: userCart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  })
  //4)after make the order we will update i product it self ^decrement the quantity increment the sold 
  if (order) {
    const bulkOption = userCart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    //update the product
    await ProductModel.bulkWrite(bulkOption,{});

    //5) clear user cart
    await cartModel.findByIdAndDelete(req.params.cartId);
  };
  res.status(201).json({
    status: "success",
    msg: "Order created successfully",
    data:order
  });
});

export const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
})
//@desc Get all order
//@route POST /api/orders
//@access Protected/User-admin-manger
export const findAllOrders = getAll(orderModel);


//@desc Get all order
//@route POST /api/orders
//@access Protected/User-admin-manger
export const findSpecificOrder = getOne(orderModel);


//@desc update  order statue
//@route Put /api/orders/:Id/paid
//@access Protected/admin-manger
export const updateOrderStatusToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`there are no orders with this Id${req.params.id}`));
  };
  //update the order status to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: 'success', msg: "Order paided successfully ", data: updatedOrder });
});

//@desc update  order statue
//@route Put /api/orders/:Id/delivered
//@access Protected/admin-manger
export const updateOrderStatusToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError(`there are no orders with this Id${req.params.id}`));
  };
  //update the order status to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: 'success', msg: "Order Delivered successfully ", data: updatedOrder });
});


//@desc GET checkout Session from stripe and send it in the reponse
//@route GET /api/orders/checkout-session/cardId
//@access Protected/User
//fix-code
export const checkOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const cardIdShippingPrice = 0;

  console.log(req.params.cartId); // Log cartId to debug
  // 1) Get Cart depending on cartId
  const userCart = await cartModel.findById(req.params.cartId);
  if (!userCart) {
    return next(new ApiError(`There is no cart with this ID ${req.params.cartId}`, 404));
  }

  // 2) Get order price from the cart but we check if there's a coupon
  const cartPrice = userCart.totalPriceAfterCoupon ? userCart.totalPriceAfterCoupon : userCart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + cardIdShippingPrice;

  // 3) Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100, // Amount in the smallest currency unit
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress
  });

  // 4) Send session to the response
  res.status(200).json({ status: "Success", session });
});

const createCardOrder = async (session) => {
  const cardId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrise = session.amount_total / 100;
  

  const cart = await cartModel.findById(cardId);
  const user = await cartModel.findOne({ email: session.customer_email })
  //create order
  //3) create the order with card method
  const order = await orderModel.create({
    user: user._id,
    orderItems: cart.cartItems,
    totalOrderPrice: orderPrise,
    shippingAddress,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType:"onlinePayment"
  });
  //4)after make the order we will update i product it self ^decrement the quantity increment the sold 
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    //update the product
    await ProductModel.bulkWrite(bulkOption, {});

    //5) clear user cart
    await cartModel.findByIdAndDelete(cardId);
  };
}

export const webhookCheckout = asyncHandler(async (req, res, next) => {
  let event = req.body;

    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`⚠️  Webhook signature verification failed.`, err.message);
  }
  if (event.type === 'checkout.session.completed') {
    console.log('Order is createing...');
    createCardOrder(event.data.object)
  }
  res.status(200).json({received:true})
});
