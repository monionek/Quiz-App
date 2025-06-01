import { User } from "./userModel";
import { Quiz } from "./quizModel";
import { Question } from "./questionModel";
import { Tag } from "./tagModel";
import { Category } from "./categoryModel";

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

Quiz.belongsTo(Category, { foreignKey: "categoryId" }); // quiz.categoryId
Category.hasMany(Quiz, { foreignKey: "categoryId" });

Quiz.belongsToMany(Tag, { through: "QuizTags", foreignKey: "quizId" });
Tag.belongsToMany(Quiz, { through: "QuizTags", foreignKey: "tagId" });
// Eksport modeli
export { User, Quiz, Question };
