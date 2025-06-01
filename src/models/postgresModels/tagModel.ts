import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/postgres";

export class Tag extends Model {}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
  }
);
