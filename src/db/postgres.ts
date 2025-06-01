import { Sequelize } from "sequelize";
import { envConfig } from "../config/config";
export const sequelize = new Sequelize(
  envConfig.postgresDB,
  envConfig.postgresUser,
  envConfig.postgresPassword,
  {
    host: envConfig.postgresHost,
    port: envConfig.postgresPort,
    dialect: "postgres",
  },
);
export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");
    await sequelize.sync({ alter: true });
    console.log("🛠️ Models synced");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
};
