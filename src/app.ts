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

const app = express();
app.use(helmet());
app.use(cors());
app.use(json());
app.use(morgan("dev"));

//DB Connection
connectMongo();
connectPostgres();

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/user", userRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(envConfig.port, () => {
  console.log(`Server running on http://localhost:${envConfig.port}`);
});
