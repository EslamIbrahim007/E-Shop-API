import { deleteOne, updateOne,createOne ,getOne,getAll} from "./handlerFactory.js"

import SubCategoryModel from "../models/subCategoryModel.js"


export const setCategortIdToBody=(req, res, next) => {
  //Nested route(create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next()
  
}
//Nested route
//Get /api/subcCategories/:categoryid/subcategory

export const createFilterObject = (req, res, next) => { 
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next()
}
//@desc GET  subcategory by id
//@route Get /api/subcCategories
//@access Public

export const getSubCategories = getAll(SubCategoryModel);


//@desc GET specific subcategory by id
//@route Get /api/subcCategories/:id
//@access Public
export const getSubCategory = getOne(SubCategoryModel);


//@desc Creast subcategory
//@route POST /api/subcCategories
//@access Private
export const createSubCategory = createOne(SubCategoryModel);

//@desc UPDATE specific subcategory by id
//@route PUT /api/subcCategories/:id
//@access private
export const updateSubCategory = updateOne(SubCategoryModel);
;

//@desc DELETE specific subcategory by id
//@route delete /api/subcCategories/:id
//@access private
export const deleteSubCategory = deleteOne(SubCategoryModel);