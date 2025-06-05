import { Request, Response } from "express";
import { Question } from "../models/postgresModels";
import { validationResult } from "express-validator";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId;
    const questions = await Question.findAll({ where: { quizId } });

    const safeQuestions = questions.map((q) => {
      const { correctAnswers, ...rest } = q.get({ plain: true });
      return rest;
    });

    res.status(200).json({ questions: safeQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addQuestion = async (req: Request, res: Response) => {
  const quizId = req.params.quizId;

  try {
    const {
      text,
      type,
      options,
      correctAnswers,
      hint,
      points = 1,
      order = 0,
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
    res.status(500).json({ message: "Server error while creating question" });
  }
};

export const editQuestion = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  const question = await Question.findByPk(questionId);
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  const { text, type, options, correctAnswers, hint, points, order } = req.body;

  await question.update({
    ...(text !== undefined && { text }),
    ...(type !== undefined && { type }),
    ...(options !== undefined && { options }),
    ...(correctAnswers !== undefined && { correctAnswers }),
    ...(hint !== undefined && { hint }),
    ...(points !== undefined && { points }),
    ...(order !== undefined && { order }),
  });

  res.status(200).json({ message: "Question updated", question });
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const questionId = req.params.questionId;

  const question = await Question.findByPk(questionId);
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  await question.destroy();
  res.status(200).json({ message: "Question deleted" });
};
