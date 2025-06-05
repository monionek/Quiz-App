import express from "express";
import {
  addTagToQuiz,
  createQuiz,
  deleteAllQuizzes,
  deleteQuiz,
  editQuiz,
  getQuiz,
  getQuizzes,
  removeTagFromQuiz,
} from "../controllers/quizController";
import { requireAuth } from "../middleware/auth";
import { validateQuizUpdate, validateQuiz } from "../middleware/validateQuiz";
import { valResult } from "../middleware/validateResult";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/create-quiz",  requireAuth, validateQuiz, valResult, createQuiz);
router.get("/list", getQuizzes);
router.get("/:id", requireAuth, getQuiz);
router.delete("/delete/:id", requireAuth, deleteQuiz);
router.patch(
  "/quiz-editor/:id",
  requireAuth,
  validateQuizUpdate,
  valResult,
  editQuiz,
);
router.patch("/quiz-editor/:id/tags-remove", requireAuth, removeTagFromQuiz);
router.patch("/quiz-editor/:id/tags-add", requireAuth, addTagToQuiz)
router.delete("/deleteAll", requireAuth, isAdmin,deleteAllQuizzes)
export default router;
