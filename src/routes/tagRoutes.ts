import express from "express";
import { createTag, deleteTag } from "../controllers/tagController";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/create", isAdmin, createTag);
router.delete("/delete/:id", deleteTag);

export default router;
