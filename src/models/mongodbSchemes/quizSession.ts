import { Schema, model, Document } from "mongoose";

export interface Answer {
  questionId: string; // Postgres Question.id
  selectedAnswers: string[];
  answeredAt: Date;
  isCorrect?: boolean;
  points: number;
}

export interface QuizSessionDocument extends Document {
  userId: string; // Postgres User.id
  quizId: string; // Postgres Quiz.id
  answers: Answer[];
  currentQuestionIndex: number;
  status: "in_progress" | "completed";
  startedAt: Date;
  endedAt: Date;
}

const AnswerSchema = new Schema<Answer>(
  {
    questionId: { type: String, required: true },
    selectedAnswers: { type: [String], required: true },
    answeredAt: { type: Date, required: true },
    isCorrect: { type: Boolean, default: undefined },
    points: { type: Number, default: 1 },
  },
  { _id: false },
);

const QuizSessionSchema = new Schema<QuizSessionDocument>(
  {
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    answers: { type: [AnswerSchema], default: [] },
    currentQuestionIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const QuizSession = model<QuizSessionDocument>(
  "QuizSession",
  QuizSessionSchema,
);
