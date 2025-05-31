import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
  userId: String,
  quizId: String,
  answers: [{ questionId: String, answer: String }],
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

export const QuizResult = mongoose.model("QuizResult", QuizResultSchema);
