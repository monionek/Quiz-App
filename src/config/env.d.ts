// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    // PostgreSQL
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;

    // MongoDB
    MONGO_URI: string;

    // JWT / Auth
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    // Firebase (jeśli używasz)
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;

    // Ogólne
    PORT: string;
  }
}
