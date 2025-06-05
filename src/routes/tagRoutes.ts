import express from "express";
import { createTag, deleteTag } from "../controllers/tagController";
import { isAdmin } from "../middleware/isAdmin";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/create", requireAuth, isAdmin, createTag);
router.delete("/delete/:id", requireAuth, isAdmin, deleteTag);

export default router;
