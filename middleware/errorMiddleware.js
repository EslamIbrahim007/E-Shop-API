/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import ApiError from '../utils/apiError.js';

const handleJwtInvalidSignature = () => new ApiError('Invalid token , please login again...', 401);
const handleJwtExpired = () => new ApiError('Expired token , please login again...', 401);
const globalError = ((err, req, res, next) => {
  //Setting Default Error Properties:
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //his will log the error details to the console, which is useful for debugging.
  console.log(err); // Add this line
  
  //Handling Errors Based on Environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, req, res, next)
  }
  else {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJwtExpired();
    sendErrorForProd(err, req, res, next)
  }

});


const sendErrorForDev = ((err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
});

const sendErrorForProd = ((err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});


export default globalError