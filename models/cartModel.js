import mongoose from "mongoose";

// Create the cart Schema
const cartSchema = new mongoose.Schema({
  cartItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: {
      type: Number,
      default:1
    },
    color: String,
    price: Number
  }],
  totalCartPrice: Number,
  totalPriceAfterCoupon: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
}, { timestamps: true });

// create the model
const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel