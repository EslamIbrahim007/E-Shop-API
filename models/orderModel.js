import { Schema, model } from "mongoose";

//create order Schema
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true,'Order musr be belong to user']
  },
  orderItems: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number,
    color: String,
    price: Number
  }],
  taxPrice: {
    type: Number,
    default:0
  },
  ShippingPrice: {
    type: Number,
    default: 0
  },
  shippingAddress: {
    details: String,
    phone: String,
    postalCode: Number,
    city: String,
  },
  totalOrderPrice: {
    type:Number
  },
  paymentMethodType: {
    type: String,
    enum: ["cashOnDelivery", "onlinePayment"],
    required: [true, "Payment method is required"],
    default:"cashOnDelivery"
  },
  isPaid: {
    type: Boolean,
    default:false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt:Date
}, { timestamps: true });

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone"
  }).populate({
    path: "orderItems.product",
    select:"title imageCover"
  });
  next();
})


//create order model
const orderModel = model("Order", orderSchema);
export default orderModel;