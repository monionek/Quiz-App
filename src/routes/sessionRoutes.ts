import { Router } from "express";
import {
  deleteSession,
  getSession,
  startSession,
  submitAnswer,
} from "../controllers/quizSessionController";
import {
  validateStartSession,
  validateSubmitAnswer,
} from "../middleware/sessionValidators";
import { authorizeQuizAccess } from "../middleware/authorizeQuizAccess";
import { requireAuth } from "../middleware/auth";
import { valResult } from "../middleware/validateResult";

const router = Router();

// POST /api/quiz/:id/session/start
router.post(
  "/:id/start",
  validateStartSession,
  requireAuth,
  authorizeQuizAccess,
  startSession,
);

// POST /api/quiz/session/:sessionId/answer
router.post(
  "/:id/answer",
  requireAuth,
  validateSubmitAnswer,
  valResult,
  submitAnswer,
);
router.delete("/:id/delete", requireAuth, deleteSession);
router.get("/:id", requireAuth, getSession);

export default router;
