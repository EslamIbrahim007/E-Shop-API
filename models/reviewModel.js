// Import necessary modules
import mongoose, { Schema } from 'mongoose';
import productModel from "./ProductModel.js";

// Create the review schema
const reviewSchema = new Schema({
  content: {
    type: String
  },
  ratings: {
    type: Number,
    min: [1, "Minimum rating value is 1"],
    max: [5, "Maximum rating value is 5"],
    required: [true, "Rating is required"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Review must belong to a user"]
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Review must belong to a product"]
  }
}, { timestamps: true });

// Create pre-middleware to populate the user field
reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: "user", select: "name" });
  next();
});

// Static method to calculate average ratings and quantity
reviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId) {
  const statistics = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "product", averageRating: { $avg: "$ratings" }, ratingQuantity: { $sum: 1 } } }
  ]);
  if (statistics.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: statistics[0].averageRating,
      ratingsQuantity: statistics[0].ratingQuantity
    });
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0
    });
  }
};

// Post save and delete middlewares
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  await this.model('Review').calcAverageRatingsAndQuantity(this.product);
});

// Create and export the review model
const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;
