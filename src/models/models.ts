import { Model, Transaction } from "sequelize";
import { Tag } from "../models/postgresModels/tagModel";

export interface QuizInstance extends Model {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  isPrivate: boolean;
  language: string;
  ownerId: string;

  setTags(
    tags: number[] | Tag[],
    options?: { transaction?: Transaction }
  ): Promise<void>;

  addTag(
    tag: number | Tag,
    options?: { transaction?: Transaction }
  ): Promise<void>;

  addTags(
    tags: number[] | Tag[],
    options?: { transaction?: Transaction }
  ): Promise<void>;

  removeTag(
    tag: number | Tag,
    options?: { transaction?: Transaction }
  ): Promise<void>;

  removeTags(
    tags: number[] | Tag[],
    options?: { transaction?: Transaction }
  ): Promise<void>;

  getTags(options?: { transaction?: Transaction }): Promise<Tag[]>;
}

export interface QuestionInterface extends Model {
  id: string;
  quizId: string;
  type: "single" | "multiple" | "true_false" | "open";
  text: string;
  options: string[] | undefined;
  correctAnswers: string[];
  hint: string;
  points: number;
  order: number;
}

export interface UpdateUserInterface {
  username?: string;
  email?: string;
  password?: string;
}

export interface JwtPayload {
  username: string;
  role: "admin" | "user";
  id: string;
}