import express from "express";
import {
  createQuiz,
  deleteQuiz,
  editQuiz,
  getQuiz,
  getQuizzes,
  removeTagFromQuiz,
} from "../controllers/quizController";
import { requireAuth } from "../middleware/auth";
import { validateQuizUpdate, validateQuiz } from "../middleware/validateQuiz";
import { valResult } from "../middleware/validateResult";

const router = express.Router();

router.post("/create-quiz", validateQuiz, valResult, requireAuth, createQuiz);
router.get("/quizes", getQuizzes);
router.get("/quiz/:id", requireAuth, getQuiz);
router.delete("/quiz-editor/delete/:id", requireAuth, deleteQuiz);
router.patch(
  "/quiz-editor/:id",
  requireAuth,
  validateQuizUpdate,
  valResult,
  editQuiz,
);
router.delete("/quiz/:quizId/tag/:tagName", removeTagFromQuiz);

export default router;
