import { User } from "./userModel";
import { Quiz } from "./quizModel";
import { Question } from "./questionModel";
import { Tag } from "./tagModel";
import { Category } from "./categoryModel";
import { QuizResult } from "./quizResultModel";

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

Quiz.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Quiz, { foreignKey: "categoryId" });

Quiz.belongsToMany(Tag, { through: "QuizTags", foreignKey: "quizId",  as: "tags" });
Tag.belongsToMany(Quiz, { through: "QuizTags", foreignKey: "tagId" });

// User -> QuizResult
User.hasMany(QuizResult, {
  foreignKey: "userId",
  as: "results",
});
QuizResult.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Quiz -> QuizResult
Quiz.hasMany(QuizResult, {
  foreignKey: "quizId",
  as: "results",
});
QuizResult.belongsTo(Quiz, {
  foreignKey: "quizId",
  as: "quiz",
});
export { User, Quiz, Question, Category, Tag };
