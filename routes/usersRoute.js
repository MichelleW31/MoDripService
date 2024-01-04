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
} from '../middleware/validators/userValidation.js';
import verifyRoles from '../middleware/verifyRoles.js';
import verifyJWT from '../middleware/verifyJWT.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, getUsers)
  .post(createUserValidationRules(), validate, createUser);

router
  .route('/:id')
  .get(verifyJWT, userIdValidationRules(), getUser)
  .put(verifyJWT, userIdValidationRules(), updateUser)
  .delete(verifyJWT, userIdValidationRules(), deleteUser);

export default router;

// {"email": "mat@gmail.com", "password":"test123"}
