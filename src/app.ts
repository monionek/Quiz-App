import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { json } from "body-parser";
import quizRoutes from "./routes/quizRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { connectPostgres } from "./db/postgres";
import { connectMongo } from "./db/mongo";
import { envConfig } from "./config/config";
import userRoutes from "./routes/userRoutes";
import "./models/postgresModels/index";
import categoryRoutes from "./routes/categoryRoutes";
import tagRoutes from "./routes/tagRoutes";
import questionsRoutes from "./routes/questionRoutes";
import quizSessionRoutes from "./routes/quizSessionRoutes";
import quizResultRoutes from "./routes/quizResultRoutes";
const app = express();
app.use(helmet());
app.use(cors());
app.use(json());
app.use(morgan("dev"));

//DB Connection
connectMongo();
connectPostgres();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/session", quizSessionRoutes);
app.use("/api/quiz-result", quizResultRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(envConfig.port, () => {
  console.log(`Server running on http://localhost:${envConfig.port}`);
});
