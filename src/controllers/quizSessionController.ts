import { Response, Request } from "express";
import { Question, Quiz } from "../models/postgresModels";
import { QuizSession } from "../models/mongodbSchemes/quizSession";
import { QuestionInterface } from "../models/models";
import { QuizResult } from "../models/postgresModels/quizResultModel";

export const startSession = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user?.id;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz)  { 
      res.status(404).json({ message: "Quiz not found" });
      return;
    };
    const durationMinutes = quiz.get().duration || 15;

    const start = new Date();
    const end = new Date(start.getTime() + durationMinutes * 60_000);

    const existingSession = await QuizSession.findOne({
      userId,
      quizId,
      status: "in_progress",
    });

    if (existingSession) {
      res.status(400).json({ message: "You already started this quiz" });
      return;
    }

    const session = await QuizSession.create({
      userId,
      quizId,
      startedAt: start,
      endTime: end,
    });

    res.status(201).json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error starting quiz session" });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.id;
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    if (req.user?.id !== session.userId) {
      res.status(403).json({message: "Access denied"});
      return;
    }

    const { questionId, selectedAnswers } = req.body;
    const question = await Question.findByPk(questionId);
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const correctAnswers = (question as QuestionInterface).correctAnswers;
    const points = (question as QuestionInterface).points;
    const isCorrect =
      JSON.stringify([...correctAnswers].sort()) ===
      JSON.stringify([...selectedAnswers].sort());

    session.answers.push({
      questionId,
      selectedAnswers,
      answeredAt: new Date(),
      isCorrect,
      points: points,
    });

    session.currentQuestionIndex += 1;

    const totalQuestions = await Question.count({
      where: { quizId: session.quizId },
    });

    if (session.currentQuestionIndex < totalQuestions) {
      await session.save();
      res.status(203).json({ message: "Answer saved", isCorrect: isCorrect });
      return;
    }
    session.status = "completed";
    session.endedAt = new Date();
    const score = session.answers.reduce((sum, a) => {
      if (a.isCorrect) {
        return sum + a.points;
      }
      return sum;
    }, 0);
    const maxScore = session.answers.reduce((sum, a) => sum + a.points, 0);
    const durationInSeconds =
      (new Date().getTime() - new Date(session.startedAt).getTime()) / 1000;
    await QuizResult.create({
      userId: session.userId,
      quizId: session.quizId,
      score,
      maxScore,
      answers: session.answers,
      durationInSeconds,
    });
    await session.save();
    res.status(200).json({ message: "Answer saved", isCorrect, score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.id;
    const del = await QuizSession.findByIdAndDelete(sessionId);
    if (!del) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    res.status(200).json({ message: "Session deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.id;
    const session = await QuizSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ message: "session not found" });
      return;
    }
    if (session.userId !== req.user?.id) {
      res.status(403).json({message: "Access Denied"});
      return;
    } 
    res.status(203).json({ session: session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
