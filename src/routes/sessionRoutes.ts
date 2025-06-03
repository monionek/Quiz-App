import { Router } from "express";
import { startSession, submitAnswer } from "../controllers/quizSessionController";
import { validateStartSession, validateSubmitAnswer } from "../middleware/sessionValidators";
import { authorizeQuizAccess } from "../middleware/authorizeQuizAccess";

const router = Router();

// POST /api/quiz/:id/session/start
router.post(
  "/:id/session/start",
  validateStartSession,
  authorizeQuizAccess,
  startSession
);

// POST /api/quiz/session/:sessionId/answer
router.post(
  "/session/:sessionId/answer",
  validateSubmitAnswer,
  submitAnswer
);

export default router;
