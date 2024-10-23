import express from 'express';

const router = express.Router();
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
  updateMyDateValidator
} from '../utils/Validators/userValidators.js'
import { protect, allowTo } from "../services/authService.js"

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserDate,
  deactivateLoggedUser
} from "../services/userService.js"

router.use(protect);

router.get('/getMyInfo', getLoggedUserData, getUser);
router.put('/changeMyPassword', changeUserPasswordValidator, updateLoggedUserPassword);
router.put('/updateMyInfo', updateMyDateValidator, updateLoggedUserDate);
router.delete('/deactivateMe', deactivateLoggedUser);



//Admin
router.use(allowTo('admin','manger'));
router.put("/:id/changePassword", changeUserPasswordValidator, changeUserPassword);
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator,getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator,updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router