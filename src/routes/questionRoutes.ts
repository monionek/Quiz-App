import express from "express";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../controllers/questionController";
import {
  validateQuestionCreate,
  validateQuestionEdit,
} from "../middleware/questionValidators";
import { valResult } from "../middleware/validateResult";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/:quizId", requireAuth, getQuestions);
router.post(
  "/:quizId/add",
  requireAuth,
  validateQuestionCreate,
  valResult,
  addQuestion,
);
router.patch(
  "/:quizId/edit/:questionId",
  requireAuth,
  validateQuestionEdit,
  valResult,
  editQuestion,
);
router.delete("/:quizId/delete/:questionId", requireAuth, deleteQuestion);

export default router;
