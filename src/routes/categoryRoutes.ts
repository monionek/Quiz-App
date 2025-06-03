import express from "express";
import {
  createCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/create", isAdmin, createCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
