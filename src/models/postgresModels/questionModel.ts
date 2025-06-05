import { DataTypes } from "sequelize";
import { sequelize } from "../../db/postgres";

export const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "quizzes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM("single", "multiple", "true_false", "open"),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    correctAnswers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    hint: {
      type: DataTypes.STRING,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "questions",
    timestamps: true,
  },
);
