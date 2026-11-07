import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { config } from './config/env.js';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes mount
app.use('/api', apiRouter);

// Fallback error handler
app.use(errorHandler);

export default app;
