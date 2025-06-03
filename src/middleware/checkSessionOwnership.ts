import { Response, Request, NextFunction } from "express";
import { QuizSession } from "../models/mongodbSchemes/quizSession";

export const checkSessionOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sessionId } = req.params;

  if (!req.user) {
    res.status(403).json({ message: "You must be logged in" });
    return;
  }

  const session = await QuizSession.findById(sessionId);
  if (!session) {
    res.status(404).json({ message: "Session not found" });
    return;
  }

  if (session.userId !== req.user.id && req.user.role !== "admin") {
    res
      .status(403)
      .json({ message: "You do not have permission to access this session" });
    return;
  }

  (req as any).quizSession = session;
  next();
};
