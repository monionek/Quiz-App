import { User } from "./userModel";
import { Quiz } from "./quizModel";
import { Question } from "./questionModel";

// RELACJA: User → Quiz (1:N)
User.hasMany(Quiz, {
  foreignKey: "userId",
  as: "quizzes",
});

Quiz.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

// RELACJA: Quiz → Question (1:N)
Quiz.hasMany(Question, {
  foreignKey: "quizId",
  as: "questions",
});

Question.belongsTo(Quiz, {
  foreignKey: "quizId",
  as: "quiz",
});

// Eksport modeli
export { User, Quiz, Question };
