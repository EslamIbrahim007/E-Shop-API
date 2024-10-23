import mongoose, { Schema, model } from 'mongoose'

const subCategorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, 'SubCategory must be unique!'],
    minlength: [2, 'too short SubCategory name'],
    maxlength: [32, 'too long SubCategory name']
  },
  slug: {
    type: String,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required:[true,'Must select a main Category']
  }
}, { timestamps: true });

const subCategoryModel = model('SubCategory', subCategorySchema);

export default subCategoryModel;
