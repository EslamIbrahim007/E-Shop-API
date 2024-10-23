/* eslint-disable no-undef */

import { Schema, model } from "mongoose";

// create Schema
const brandSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Brand is required'],
    unique: [true, 'Brand must be UNIQUE'],
    minlength: [3, 'Too short to Brand name'],
    maxlenth: [32, 'Too long to Brand name']
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl
  }
};
brandSchema.post('init', (doc) => {
  setImageUrl(doc)
});

brandSchema.post('save', (doc) => {
  setImageUrl(doc)
})

//create model
const BrandModel = model("Brand", brandSchema)

export default BrandModel;

