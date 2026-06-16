import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // 1. Chuyển đổi các loại lỗi lạ về ApiError để xử lý thống nhất
  if (!(error instanceof ApiError)) {
    let statusCode =
      error?.statusCode ||
      (error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof ZodError
        ? 400
        : 500);

    let message = error?.message || 'Internal Server Error';
    
    // Xử lý lỗi Database từ Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') message = `Dữ liệu đã tồn tại (Trùng field: ${error.meta?.target})`;
      if (error.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
    }
    
    // Xử lý lỗi Validation từ Zod
    if (error instanceof ZodError) {
      message = error.issues?.length
        ? error.issues
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join(' | ')
        : error.message;
    }

    // Xử lý lỗi Token JWT
    if (error.name === 'JsonWebTokenError') { statusCode = 401; message = 'Token không hợp lệ'; }
    if (error.name === 'TokenExpiredError') { statusCode = 401; message = 'Token đã hết hạn'; }

    error = new ApiError(statusCode, message, false, err.stack);
  }

  // 2. Trả về JSON cho Frontend
  const response = {
    code: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) // Chỉ hiện chi tiết lỗi khi code máy mình
  };

  res.status(error.statusCode).send(response);
};