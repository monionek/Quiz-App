import { Model } from "sequelize";
import { Tag } from "./postgresModels";

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

  setTags: (tags: number[] | Tag[]) => Promise<void>;
  addTag: (tag: number | Tag) => Promise<void>;
  addTags: (tags: number[] | Tag[]) => Promise<void>;
  removeTag: (tag: number | Tag) => Promise<void>;
  removeTags: (tags: number[] | Tag[]) => Promise<void>;
  getTags: () => Promise<Tag[]>;
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
