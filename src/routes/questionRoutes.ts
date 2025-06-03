import express from "express";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
  getQuestions,
} from "../controllers/questionController";
import { authorizeQuizAccess } from "../middleware/authorizeQuizAccess";
import {
  validateAddQuestion,
  validateEditQuestion,
} from "../middleware/questionValidators";

const router = express.Router();

router.get("/quiz/:quizId/questions", authorizeQuizAccess, getQuestions);
router.post(
  "/quiz/:quizId/questions",
  authorizeQuizAccess,
  validateAddQuestion,
  addQuestion,
);
router.patch(
  "/questions/:questionId",
  authorizeQuizAccess,
  validateEditQuestion,
  editQuestion,
);
router.delete("/questions/:questionId", authorizeQuizAccess, deleteQuestion);

export default router;
