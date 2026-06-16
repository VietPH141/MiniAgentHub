import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import { errorMiddleware } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

// API routes

// Users CRUD routes
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import chatRouter from './routes/chatRouter';
import conversationRouter from './routes/conversationRouter';
import messageRouter from './routes/messageRouter';
import groupRouter from './routes/groupRouter';
import permissionRouter from './routes/permissionRouter';
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);
app.use('/api/group', groupRouter);
app.use('/api/permission', permissionRouter);

// Error handling middleware (phải được đặt cuối cùng)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend chạy tại http://localhost:${PORT}/swagger`);
});
