import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db';

import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';

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
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy roles' });
  }
});

// Users CRUD routes
import usersRouter from './routes/users';
import authRouter from './routes/auth';
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend chạy tại http://localhost:${PORT}`);
});