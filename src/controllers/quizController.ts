import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Quiz } from "../models/postgresModels";
import { Op } from "sequelize";
import { QuizInterface } from "../models/models";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "You must be logged in to update user" });
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
      return;
    }
    const {
      title,
      description,
      category,
      difficulty,
      duration,
      isPrivate,
      tags,
      language,
    } = req.body;
    const userId = req.user.id;
    const newQuiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      duration,
      isPrivate,
      tags,
      userId,
      language,
    });
    if (newQuiz) {
      res.status(201).json({ message: "Quiz created", quiz: newQuiz });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
  res.status(400).json({ message: "server error" });
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      difficulty,
      category,
      language,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {
      isPrivate: false,
    };

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    if (difficulty) {
      whereClause.language = language;
    }

    if (category) {
      const tags = String(category).split(",");
      whereClause.categories = {
        [Op.contains]: tags,
      };
    }

    const quizzes = await Quiz.findAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      order: [[String(sortBy), String(order)]],
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
    return;
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res
        .status(403)
        .json({ message: "You must be logged in for starting a quiz" });
      return;
    }
    const quizId = req.params.id;
    const quiz = await Quiz.findOne({
      where: { quizId },
    });
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    res.status(203).json({ quiz: quiz });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch quiz" });
    return;
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "You must be logged in to update user" });
      return;
    }
    const quizId = req.params.id;
    const userRole = req.user.role;
    const userId = req.user.username;
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    if (userRole === "admin" || quiz.get().userId === userId) {
      await quiz.destroy();
      res.status(200).json({ message: "Quiz deleted" });
      return;
    }
    res.status(403).json({ message: "access ednied" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
export const submitQuiz = async (req: Request, res: Response) => {
  // przyjmij odpowiedzi i oblicz wynik
  res.status(200).json({ score: 3 });
};

export const editQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: "You must be logged in" });
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
      return;
    }
    const quizId = req.params.id;
    const userRole = req.user.role;
    const userId = req.user.username;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    if (userRole !== "admin" && quiz.get().userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const updateFields: Partial<QuizInterface> = {};
    const allowedFields = [
      "title",
      "description",
      "tags",
      "difficulty",
      "isPrivate",
      "duration",
    ];

    for (const field of allowedFields as (keyof QuizInterface)[]) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      res.status(400).json({ message: "No valid fields provided for update" });
      return;
    }

    await quiz.update(updateFields);
    res.status(200).json({ message: "Quiz updated", quiz });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
