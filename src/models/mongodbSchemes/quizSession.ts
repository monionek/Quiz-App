import mongoose from "mongoose";

const QuizSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    currentQuestionIndex: { type: Number, default: 0 },
    answers: [
      {
        questionId: String,
        selectedAnswers: [String],
        isCorrect: Boolean,
        answeredAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    score: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const QuizSession = mongoose.model("QuizSession", QuizSessionSchema);
