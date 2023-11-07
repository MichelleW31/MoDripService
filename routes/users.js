import express from "express";
import { createUser } from "../controllers/usersController.js";
import verifyRoles from "../middleware/verifyRoles.js";

const router = express.Router();

router.route("/").post(createUser);
// router.route("/").get(getUsers).post(createUser);

// router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

// router
//   .route("/")
//   .get(verifyRoles(ROLES_LIST.Admin), userController.getUsers)
//   .put(
//     verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User),
//     userController.updateUser
//   )
//   .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

export default router;

// {"firstName": "Michelle", "lastName": "Williams", "email": "m@gmail.com", "password": "test123"}
