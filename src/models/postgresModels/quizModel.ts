import { DataTypes } from "sequelize";
import { sequelize } from "../../db/postgres";

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
    category: { type: DataTypes.STRING, allowNull: false },
    difficulty: {
      type: DataTypes.ENUM("easy", "medium", "hard"),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 120,
    }, // w sekundach
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "quizzes",
    timestamps: true,
  },
);
