import { Request, Response } from "express";
import { Category, Quiz, Tag } from "../models/postgresModels";
import { Op } from "sequelize";
import { QuizInstance } from "../models/models";
import { sequelize } from "../db/postgres";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Must be logged in" });
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
    console.log("USERID:",userId)

    const newQuiz = await Quiz.create({
      title,
      description,
      difficulty,
      categoryId,
      duration,
      isPrivate,
      language,
      userId
    });

    if (!newQuiz) {
      res.status(400).json({ message: "Quiz could not be created" });
      return;
    }

    if (Array.isArray(tags)) {
      const tagInstances = await Promise.all(
        tags.map(async (tagName: string) => {
          const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
          return tag;
        })
      );

      await (newQuiz as QuizInstance).setTags(tagInstances);
    }

    res.status(201).json({ quiz: newQuiz });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Server error" });
  }
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
      Tags,
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
      whereClause.categoryId = categoryId;
    }

    const includeClause: any[] = [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: Tag,
        as: "tags",
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    ];

    if (Tags) {
      includeClause[1].where = {
        name: {
          [Op.iLike]: `%${Tags}%`,
        },
      };
    }

    const quizzes = await Quiz.findAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      include: includeClause,
      order: [[String(sortBy), String(order)]],
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};


export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {model: Category, as: "category", attributes: ["id", "name"], },
        { model: Tag, as: "tags", attributes: ["id", "name"] },
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
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const userRole = req.user?.role;
    const userId = req.user?.username;
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
  }
};

export const editQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    if (userRole !== "admin" && quiz.get().userId !== userId) {
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
    res.status(200).json({ message: "Quiz updated", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTagToQuiz = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
        const quizId = req.params.id;
    const tagName = req.body.tagName;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const quiz = await Quiz.findByPk(quizId, { transaction: t });
    if (!quiz) {
      await t.rollback();
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    if (userRole !== "admin" && quiz.get().userId !== userId) {
      await t.rollback();
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const [tag] = await Tag.findOrCreate({
      where: { name: tagName },
      defaults: { name: tagName },
      transaction: t,
    });

    await (quiz as QuizInstance).addTag(tag, { transaction: t });

    await t.commit();
    res.status(200).json({ message: `Tag '${tagName}' added to quiz` });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const removeTagFromQuiz = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const quizId = req.params.id;
    const tagName = req.body.tagName;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const quiz = await Quiz.findByPk(quizId, { transaction: t });
    if (!quiz) {
      await t.rollback();
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    if (userRole !== "admin" && quiz.get().userId !== userId) {
      await t.rollback();
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const tag = await Tag.findOne({ where: { name: tagName }, transaction: t });
    if (!tag) {
      await t.rollback();
      res.status(404).json({ message: "Tag not found" });
      return;
    }

    await (quiz as QuizInstance).removeTag(tag, { transaction: t });

    await t.commit();
    res.status(200).json({ message: `Tag '${tagName}' removed from quiz` });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAllQuizzes = async (req: Request, res: Response) => {
  try {
    await Quiz.destroy({ where: {}, truncate: true, cascade: true });
    res.status(200).json({ message: "All quizzes have been deleted." });
  } catch (error) {
    console.error("Failed to delete quizzes:", error);
    res.status(500).json({ message: "Server error while deleting quizzes." });
  }
};