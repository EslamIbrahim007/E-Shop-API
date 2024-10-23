import {Schema,model} from 'mongoose';


//create a new Schema
const couponSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    unique: [true, 'Coupon must be unique'],
    trim:true
  },
  expire: {
    type: Date,
    required: [true, 'Coupon expiry date is required']
  },
  discount: {
    type: Number,
    required: [true, 'Coupon discount percentage is required'],
    min: [1, 'Coupon discount must be greater than 0'],
    max: 100
  }
}, { timestamps: true });

// create the model
const CouponModel = model("Coupon", couponSchema);

export default CouponModel;