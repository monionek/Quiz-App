import { Model } from "sequelize";
import { Tag } from "./postgresModels";
import { InferAttributes, InferCreationAttributes } from "sequelize";

export interface QuizInstance extends Model {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  isPrivate: boolean;
  language: string;
  ownerId: string;

  // Sequelize magic methods for Tag relation
  setTags: (tags: number[] | Tag[]) => Promise<void>;
  addTag: (tag: number | Tag) => Promise<void>;
  addTags: (tags: number[] | Tag[]) => Promise<void>;
  removeTag: (tag: number | Tag) => Promise<void>;
  removeTags: (tags: number[] | Tag[]) => Promise<void>;
  getTags: () => Promise<Tag[]>;
}

export interface SessionAnswer {
  questionId: string;
  selectedAnswers: string[];
  answeredAt: Date;
  isCorrect?: boolean;
}

import { Document } from "mongoose";

export interface IQuizSession extends Document {
  userId: string;
  quizId: string;
  answers: SessionAnswer[];
  currentQuestionIndex: number;
  startedAt: Date;
  endedAt?: Date;
  status: "active" | "completed";
}

export interface IQuizResult extends Document {
  userId: string;
  quizId: string;
  score: number;
  maxScore: number;
  durationInSeconds: number;
  answers: Array<
    SessionAnswer & { correctAnswers: string[]; isCorrect: boolean }
  >;
  createdAt: Date;
}

export class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: string;
  declare quizId: string;
  declare type: string;
  declare text: string;
  declare options: string[];
  declare correctAnswers: string[];
  declare hint?: string;
  declare points: number;
  declare order: number;
}
