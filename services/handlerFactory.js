/* eslint-disable no-unused-vars */
import asyncHandler from "express-async-handler";

import ApiError from '../utils/apiError.js';

import ApiFeatures from "../utils/apiFeatures.js";
// to handle the deletion of a document in a MongoDB collection using Mongoose. 
export const deleteOne = (Model) => asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findById(id);

  if (!document) {
    return next(new ApiError(`There is no document with this ID ${id}`, 404));
  }
  // Trigger "remove" event when update document
  // Use `deleteOne` for Mongoose v5+ or `remove` for older versions
  
    await document.deleteOne();
  res.status(200).json({ msg: "document deleted successfully " });
});

//for updating a document in a MongoDB collection using Mongoose. 
export const updateOne = (model) => asyncHandler(async (req, res, next) => {
  const document = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!document) {
    return next(new ApiError(`There is no document with this ID ${req.params.id}`, 404))
  };
  // Tirgger to the save event
  document.save()
  res.status(200).json({ msg: "document updated successfully ", Brand: document });
});

//for creating a document in a MongoDB collection using Mongoose. 
export const createOne = (Model) => asyncHandler(async (req, res, next) => {

  const newDocument = await Model.create(req.body);

  res.status(201).json({ data: newDocument });

});

//to get a specified  document from a MongoDB collection using Mongoose.
export const getOne = (Model, populationOpt) => asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //Build query
  let query = Model.findById(id);
  if (populationOpt) {
    query = query.populate(populationOpt)
  }
  //Execute query
  const document = await query;
  if (!document) { 
    return next(new ApiError(`There is no document with this ID ${id}`, 404));
  }
  res.status(200).json({ DOC: document });
});

//to handle fetching multiple documents from a MongoDB collection with various query features.
export const getAll = (Model, modelName = " ") =>
  asyncHandler(async (req, res, next) => {
    //Initializes a filter object and updates it if req.filterObj is present.

    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    };
    console.log(filter);

    //build query.
    //Gets the total count of documents
    const documentsCounts = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .Pagination(documentsCounts)
      .filter()
      .sort()
      .search(modelName)
      .limitFields();
    //Executes the built query and retrieves the documents.

    const { mongooseQuery, paginationResult } = apiFeatures
    const documents = await mongooseQuery;

    res.status(200).json({ Results: documents.length, paginationResult, Documents: documents })
  });