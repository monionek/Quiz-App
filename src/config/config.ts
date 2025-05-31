import dotenv from "dotenv";
dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

interface envConfig {
  postgresHost: string;
  postgresPort: number;
  postgresDB: string;
  postgresUser: string;
  postgresPassword: string;

  // MongoDB
  mongoUrl: string;

  // JWT / Auth
  jwtSecret: string;
  jwtTime: string;
  // Firebase (jeśli używasz)
  fireProjectID: string;
  fireClientEmail: string;
  firePrivKey: string;

  // Ogólne
  port: number;
}

export const envConfig = {
  // PostgreSQL
  postgresDB: getEnvVar("POSTGRES_DB"),
  postgresUser: getEnvVar("POSTGRES_USER"),
  postgresPassword: getEnvVar("POSTGRES_PASSWORD"),
  postgresHost: getEnvVar("POSTGRES_HOST"),
  postgresPort: parseInt(getEnvVar("POSTGRES_PORT"), 10),

  // MongoDB
  mongoUrl: getEnvVar("MONGO_URI"),

  // JWT / Auth
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtTime: getEnvVar("JWT_EXPIRES_IN"),

  // Firebase (jeśli używasz)
  fireProjectID: process.env.FIREBASE_PROJECT_ID,
  fireClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  firePrivKey: process.env.FIREBASE_PRIVATE_KEY,

  // Ogólne
  port: Number(process.env.PORT),
};
