//Importing validationResult:
import { validationResult } from 'express-validator';

/* validationResult(req): Extracts the validation errors from the request.

errors.isEmpty(): Checks if there are any validation errors.

res.status(400).json({ errors: errors.array() }): If there are errors, responds with a 400 status code and the array of errors.

next(): If no errors, passes control to the next middleware or route handler. */

const validatorMiddleware = (req, res, next) => {
  //2-middleware ==> catch errors from rules that i made if it exist

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validatorMiddleware