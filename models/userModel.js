import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"
//create a new schema

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'name required'],
  },
  // A and B ==> shoping.com /a-and-b
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  phone: String,
  profileImg: String,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  role: {
    type: String,
    enum: ['admin',"manger" ,'user'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true,
  },
  // child reference (1 to many)
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }
  ],
  //Embedded
  addresses: [{
    id: { type: Schema.Types.ObjectId },
    alias: String,
    postalCode: Number,
    street: String,
    city: String,
    country: String
  }]
  
}, { timestamps: true });


userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
})


//create model
const UserModel = model("User", userSchema);

export default UserModel;
