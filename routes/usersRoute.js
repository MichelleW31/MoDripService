import express from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';
import { validate } from '../middleware/validators/validator.js';
import {
  createUserValidationRules,
  userIdValidationRules,
  getUserIdValidationRules,
} from '../middleware/validators/userValidation.js';
// import verifyRoles from '../middleware/verifyRoles.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, getUsers)
  .post(createUserValidationRules(), validate, createUser)
  .put(verifyJWT, userIdValidationRules(), validate, updateUser)
  .delete(verifyJWT, userIdValidationRules(), validate, deleteUser);

router
  .route('/:id')
  .get(verifyJWT, getUserIdValidationRules(), validate, getUser);

export default router;
