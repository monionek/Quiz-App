import { DataTypes } from "sequelize";
import { sequelize } from "../../db/postgres";

export const QuizResultAnswer = sequelize.define(
  "QuizResultAnswer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    resultId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    selectedAnswers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    correctAnswers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "quiz_result_answers",
    timestamps: true,
  },
);
