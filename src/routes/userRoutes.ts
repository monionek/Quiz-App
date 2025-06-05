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
  validatePasswordRestart,
} from "../middleware/validateUser";
import { valResult } from "../middleware/validateResult";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/register", validateRegister, valResult, registerUser);
router.get("/:id", getUser);
router.post("/login", validateLogin, valResult, loginUser);
router.patch(
  "/update-user",
  requireAuth,
  validateUpdate,
  valResult,
  updateUser,
);
router.patch(
  "/update-user-role/:id",
  requireAuth,
  isAdmin,
  validateUpdateRole,
  valResult,
  updateUserRole,
);
router.patch(
  "/restart-password",
  validatePasswordRestart,
  valResult,
  restartPassword,
);

export default router;
