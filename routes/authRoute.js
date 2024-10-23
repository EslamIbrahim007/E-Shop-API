import express from 'express';

const router = express.Router();
import {
  signUpValidator,
  logInValidator
} from '../utils/Validators/authValidators.js'

import {
  signUp,
  logIn,
  forgetPassword,
  verifyPasswordResetCode,
  resetPassWord
} from "../services/authService.js"


router
  .route('/signup')
  .post(signUpValidator, signUp);

router
  .route('/login')
  .post(logInValidator, logIn);

router.post('/forgetPassword',forgetPassword);
router.post('/verifyResetCode', verifyPasswordResetCode);
router.put('/resetPassWord', resetPassWord);



export default router