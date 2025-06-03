import { Request, Response, NextFunction } from "express";
import { Quiz } from "../models/postgresModels"; // dostosuj ścieżkę

export const authorizeQuizAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { quizId } = req.params;

  if (!req.user) {
    res.status(403).json({ message: "You must be logged in" });
    return;
  }

  const quiz = await Quiz.findByPk(quizId);

  if (!quiz) {
    res.status(404).json({ message: "Quiz not found" });
    return;
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = quiz.getDataValue("ownerId") === req.user.id;

  if (!isAdmin && !isOwner) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  // attach quiz to request in case controller needs it
  (req as any).quiz = quiz;

  next();
};
