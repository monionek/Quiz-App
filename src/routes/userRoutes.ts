import express from "express";
import { requireAuth } from "../middleware/auth";
import { registerUser, getUser, loginUser, updateUser } from "../controllers/userController";
import { validateRegister, validateLogin, validateUpdate } from "../middleware/validateUser";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.get("/:selector", getUser);
router.post("/login", validateLogin, loginUser)
router.patch("/updateUser", validateUpdate, requireAuth, updateUser)

export default router;
