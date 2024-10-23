/* eslint-disable no-undef */
import { Schema, model } from "mongoose";

// create Schema for product
const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [5, "Title should be at least 5 characters long"],
    maxlength: [100, "Title should not exceed 100 characters"]
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    minlength: [10, "Description should be at least 10 characters long"],
    maxlength: [500, "Description should not exceed 500 characters"]
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is  required']
  },
  sold: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    trim: true,
    max: [1000000, "Too long for product price to be"]
  },
  priceAfterDiscount: {
    type: Number
  },

  colors: [String],

  imageCover: {
    type: String,
    required: [true, "Product Image cover is required"]
  },

  images: [String],

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  subCategories:
    [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }]
  ,

  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  ratingsAverage: {
    type: Number,
    min: [1, "Rating must be between 1 and 5"],
    max: [5, "Rating must be between 1 and 5"]
  },
  ratingsQuantity: {
    type: String,
    default: 0
  }
}, {
  timestamps: true,
  //to enable virtuals populate
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


productSchema.virtual('reviews', {
  ref: "Review",
  foreignField: "product",
  localField:"_id"
})

// Mogoose query middleware
// use of the pre middleware in Mongoose to automatically populate the category field before executing any find query is a great approach.

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id"
  });
  next()
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "subCategories",
    select: "name -_id"
  });
  next()
});

const setImageUrl = (doc) => {
  // set image url + image Name

  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl
  };
  if (doc.images) {
    const imagesList=[];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl)
    });
    doc.images = imagesList
  }
};

//findOne findAll ,Update
productSchema.post('init', (doc) => {
  setImageUrl(doc)
});

productSchema.post('save', (doc) => {
  setImageUrl(doc)
});


const ProductModel = model("Product", productSchema);

export default ProductModel;