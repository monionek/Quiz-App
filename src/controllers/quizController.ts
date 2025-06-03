import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Category, Quiz, Tag } from "../models/postgresModels";
import { Op } from "sequelize";
import { QuizInstance } from "../models/models";

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
      difficulty,
      duration,
      isPrivate,
      tags,
      language,
      categoryId,
    } = req.body;
    const userId = req.user.id;
    const newQuiz = await Quiz.create({
      title,
      description,
      difficulty,
      categoryId,
      duration,
      isPrivate,
      userId,
      language,
    });
    if (newQuiz) {
      await (newQuiz as QuizInstance).setTags(tags);
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
      categoryId,
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
    if (language) {
      whereClause.language = language;
    }
    if (categoryId) {
      whereClause["$Category.name$"] = {
        [Op.iLike]: `%${categoryId}%`,
      };
    }

    const quizzes = await Quiz.findAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      include: [Category, Tag],
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
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: Tag, attributes: ["id", "name"] },
      ],
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
    if (userRole === "admin" || quiz.get().ownerId === userId) {
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
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const quizId = req.params.id;
    const userRole = req.user.role;
    const userId = req.user.id;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    if (userRole !== "admin" && quiz.get().ownerId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const updateFields: Partial<QuizInstance> = {};
    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "isPrivate",
      "duration",
      "language",
      "categoryId",
    ];

    for (const field of allowedFields as (keyof QuizInstance)[]) {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    }

    await quiz.update(updateFields);

    if (req.body.tags && Array.isArray(req.body.tags)) {
      const tags = req.body.tags;

      const tagInstances = await Tag.findAll({
        where: { name: tags },
      });

      await (quiz as QuizInstance).setTags(tagInstances);
    }

    res.status(200).json({ message: "Quiz updated", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeTagFromQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, tagName } = req.params;

    if (!req.user) {
      res.status(403).json({ message: "You must be logged in" });
      return;
    }

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole !== "admin" && quiz.get().ownerId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const tag = await Tag.findOne({ where: { name: tagName } });
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    await (quiz as QuizInstance).removeTag(tag);

    res.status(200).json({ message: `Tag '${tagName}' removed from quiz` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
