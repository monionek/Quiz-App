import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryController";
import { isAdmin } from "../middleware/isAdmin";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/create",requireAuth ,isAdmin, createCategory);
router.delete("/delete/:id", requireAuth, isAdmin, deleteCategory);
router.get("/categories", getAllCategories);

export default router;
