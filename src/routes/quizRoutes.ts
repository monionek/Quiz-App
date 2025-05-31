import express from "express";
import { createQuiz, getQuiz, submitQuiz } from "../controllers/quizController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// router.post("/", requireAuth, createQuiz);
// router.get("/:id", getQuiz);
// router.post("/:id/submit", requireAuth, submitQuiz);

export default router;
