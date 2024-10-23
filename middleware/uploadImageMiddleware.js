//Importing Dependencies:
import multer from "multer";
import ApiError from '../utils/apiError.js';

//This setup ensures that only image files are accepted and stored in memory.
const multerOptions = () => {
  // uploading images (diskStorage)
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/categories')
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split('/')[1]
  //     const fileName = `Category-${Date.now()}.${ext}`
  //     cb(null, fileName)
  //   }
  // });

  // 2- Memory  storage engine
  //Stores the files in memory as Buffer objects. 
  const multerStorage = multer.memoryStorage();

  // 3- filter images only
  const multerfilter = function (req, file, cb) {
    //Checks the file’s MIME type to ensure it’s an image.
    if (file.mimetype.startsWith("image")) {
      cb(null, true)
    } else {
      //Calls the callback with an error if the file is not an image.
      cb(new ApiError('Only image allowed', 400), false);
    }
  };
  //Configures multer with the defined storage and file filter options.
  const upload = multer({ storage: multerStorage, fileFilter: multerfilter });

  //Returning the Upload Middleware:
  return upload
}

//This function takes a fieldName parameter, which specifies the name of the form field that contains the image file.

//It calls multerOptions() to get the configured multer instance and uses the.single(fieldName) method to handle single file uploads for the specified field.

export const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

//This function takes an arrayOfFields parameter, which is an array of objects specifying the field names and the maximum number of files for each field.

//It calls multerOptions() to get the configured multer instance and uses the .fields(arrayOfFields) method to handle multiple file uploads.
export const uploadImages = (arrayOfFields) => multerOptions().fields(arrayOfFields)


