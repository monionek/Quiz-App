import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { json } from 'body-parser';
import quizRoutes from './routes/quizRoutes';
import { errorHandler } from './middleware/errorHandler';
import { connectPostgres } from './db/postgres';
import { connectMongo } from './db/mongo';

const app = express();
app.use(helmet());
app.use(cors());
app.use(json());
app.use(morgan('dev'));

// Routes
app.use('/api/quizzes', quizRoutes);

// Error handling
app.use(errorHandler);

// DB Connection
connectPostgres();
connectMongo();

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});