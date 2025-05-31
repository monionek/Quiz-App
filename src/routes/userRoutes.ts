import express from "express";
import { requireAuth } from "../middleware/auth";
import {
  registerUser,
  getUser,
  loginUser,
  updateUser,
  updateUserRole,
  restartPassword,
} from "../controllers/userController";
import {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateUpdateRole,
} from "../middleware/validateUser";
import { body } from "express-validator";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.get("/:selector", getUser);
router.post("/login", validateLogin, loginUser);
router.patch("/updateUser", validateUpdate, requireAuth, updateUser);
router.patch("updateUser/:name", validateUpdateRole, updateUserRole);
router.patch(
  "user/restartPassword",
  body("email").isEmail().withMessage("email must be provided"),
  restartPassword,
);

export default router;
