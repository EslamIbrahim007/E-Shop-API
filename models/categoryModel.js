/* eslint-disable no-undef */
import { Schema, model } from "mongoose";

// create Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category is required'],
    unique: [true, 'Category must be UNIQUE'],
    minlength: [3, 'Too short to category name'],
    maxlenth: [32, 'Too long to category name']
  },
  // A and B ==> shoping.com /a-and-b
  slug: {
    type: String,
    lowercase: true,
  },
  image: {
    type: String
  }
}, { timestamps: true });


const setImageUrl = (doc) => {
  // set image url + image Name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl
  }
}
categorySchema.post('init', (doc) => {
  setImageUrl(doc)
});

categorySchema.post('save', (doc) => {
  setImageUrl(doc)
});


//create model
const CategoryModel = model("Category", categorySchema)

export default CategoryModel;

