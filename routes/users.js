import express from 'express';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController.js';
import { validate } from '../middleware/validators/validator.js';
import { createUserValidationRules } from '../middleware/validators/userValidation.js';
import verifyRoles from '../middleware/verifyRoles.js';

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(createUserValidationRules(), validate, createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

// router
//   .route("/")
//   .get(verifyRoles(ROLES_LIST.Admin), userController.getUsers)
//   .put(
//     verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
//     userController.updateUser
//   )
//   .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

export default router;

// {"firstName": "MatMichelle", "lastName": "Joe", "email": "matmic@gmail.com", "password": "test123"}
