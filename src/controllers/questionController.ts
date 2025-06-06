import { Request, Response } from "express";
import { Question, Quiz } from "../models/postgresModels";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const questions = await Question.findAll({ where: { quizId } });

    const safeQuestions = questions.map((el) => {
      const { correctAnswers, ...rest } = el.get({ plain: true });
      return rest;
    });

    res.status(200).json({ questions: safeQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addQuestion = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({message: "Quiz not found"});
      return;
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if ( role !== "admin" && userId !== quiz.get().userId) {
      res.status(403).json({message: "Access denied"});
      return;
    }
    const {
      text,
      type,
      options,
      correctAnswers,
      hint,
      points = 1,
      order,
    } = req.body;
    const newQuestion = await Question.create({
      quizId,
      text,
      type,
      options,
      correctAnswers,
      hint,
      points,
      order,
    });

    res.status(201).json({
      message: "Question created",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const editQuestion = async (req: Request, res: Response) => {
  try {
      const quizId = req.params.quizId;
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({message: "Quiz not found"});
      return;
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if ( role !== "admin" && userId !== quiz.get().userId) {
      res.status(403).json({message: "Access denied"});
      return;
    }
  const questionId = req.params.questionId;

  const question = await Question.findByPk(questionId);
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  const { text, options, correctAnswers, hint, points, order } = req.body;
if ((correctAnswers !== undefined && options === undefined) || 
    (correctAnswers === undefined && options !== undefined)) {
  res.status(403).json({
    message: "You must provide both options and correctAnswers together if you're updating either.",
  });
  return;
}
  await question.update({
    ...(text !== undefined && { text }),
    ...(options !== undefined && { options }),
    ...(correctAnswers !== undefined && { correctAnswers }),
    ...(hint !== undefined && { hint }),
    ...(points !== undefined && { points }),
    ...(order !== undefined && { order }),
  });

  res.status(200).json({ message: "Question updated", question });
} catch (error) {
  console.log(error);
  res.status(500).json({message: error})
}
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
      const quizId = req.params.quizId;
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({message: "Quiz not found"});
      return;
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if ( role !== "admin" && userId !== quiz.get().userId) {
      res.status(403).json({message: "Access denied"});
      return;
    }
  const questionId = req.params.questionId;

  const question = await Question.findByPk(questionId);
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  await question.destroy();
  res.status(200).json({ message: "Question deleted" });
} catch (error) {
  console.log(error);
  res.status(500).json({message: error});
}
};
