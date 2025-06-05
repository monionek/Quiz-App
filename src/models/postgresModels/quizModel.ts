import { DataTypes } from "sequelize";
import { sequelize } from "../../db/postgres";
import { Category } from "./categoryModel";
import { Tag } from "./tagModel";

export const Quiz = sequelize.define(
  "Quiz",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 120,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attemptsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pl",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  },
);
