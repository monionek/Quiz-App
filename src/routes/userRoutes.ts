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
import { valResult } from "../middleware/validateResult";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/register", validateRegister, valResult, registerUser);
router.get("/:selector", getUser);
router.post("/login", validateLogin, valResult, loginUser);
router.patch(
  "/update-user",
  validateUpdate,
  valResult,
  requireAuth,
  updateUser,
);
router.patch(
  "update-user/:name",
  validateUpdateRole,
  valResult,
  requireAuth,
  isAdmin,
  updateUserRole,
);
router.patch(
  "user/restartPassword",
  body("email").isEmail().withMessage("email must be provided"),
  valResult,
  restartPassword,
);

export default router;
