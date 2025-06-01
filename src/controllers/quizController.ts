import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Quiz } from "../models/postgresModels";
import { Op } from "sequelize";

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

export const getQuizes = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      difficulty,
      category,
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
