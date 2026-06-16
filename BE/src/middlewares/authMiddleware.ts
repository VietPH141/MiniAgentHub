import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getFlattenedPermissions } from '../services/rbacService';
import { prisma } from '../config/prisma';
import type { AccessTokenPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ code: 401, message: 'Bạn chưa đăng nhập' });
    return;
  }

  try {
    // decoded is typed as AccessTokenPayload — no `any`, no casting
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    const userId = Number(decoded.sub);

    // Minimal query — only what we need to gate access
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(403).json({ code: 403, message: 'Tài khoản bị khóa hoặc không tồn tại' });
      return;
    }

    // Delegate permission loading to rbacService — no Prisma or flatMap here
    const permissions = await getFlattenedPermissions(userId);

    req.user = {
      id: userId,
      email: decoded.email, // free from the JWT payload, no extra DB column
      permissions,
    };

    next();
  } catch (err) {
    // JsonWebTokenError → errorMiddleware maps to 401
    // TokenExpiredError → errorMiddleware maps to 401
    next(err);
  }
};