import express from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuizes,
  submitQuiz,
} from "../controllers/quizController";
import { requireAuth } from "../middleware/auth";
import validateQuiz from "../middleware/validateQuiz";

const router = express.Router();

router.post("/create-quiz", validateQuiz, requireAuth, createQuiz);
// router.get("/:id", getQuiz);
// router.post("/:id/submit", requireAuth, submitQuiz);
router.delete("/quiz-modify/:id", requireAuth, deleteQuiz);

export default router;
