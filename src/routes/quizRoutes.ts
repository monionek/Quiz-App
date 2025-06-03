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

const router = express.Router();

router.post("/create-quiz", validateQuiz, requireAuth, createQuiz);
router.get("/quizes", getQuizzes);
router.get("/quiz/:id", getQuiz);
router.delete("/quiz-editor/delete/:id", requireAuth, deleteQuiz);
router.patch("/quiz-editor/:id", requireAuth, validateQuizUpdate, editQuiz);
router.delete("/quiz/:quizId/tag/:tagName", removeTagFromQuiz);

export default router;
