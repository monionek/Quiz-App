import { DataTypes } from "sequelize";
import { sequelize } from "../../db/postgres";
import { User } from "./userModel";
import { Quiz } from "./quizModel";

export const QuizResult = sequelize.define(
  "QuizResult",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Quiz,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationInSeconds: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "quiz_results",
    timestamps: true,
  },
);
