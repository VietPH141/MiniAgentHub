export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean; // Để phân biệt lỗi do logic và lỗi do hệ thống sập

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Công cụ bọc các hàm async để không phải viết try-catch ở Controller
export const catchAsync = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};