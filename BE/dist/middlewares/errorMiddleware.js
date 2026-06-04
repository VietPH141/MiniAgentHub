"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
const errorMiddleware = (err, req, res, next) => {
    let error = err;
    // 1. Chuyển đổi các loại lỗi lạ về ApiError để xử lý thống nhất
    if (!(error instanceof apiError_1.ApiError)) {
        let statusCode = error.statusCode || (error instanceof client_1.Prisma.PrismaClientKnownRequestError || error instanceof zod_1.ZodError ? 400 : 500);
        let message = error.message || 'Internal Server Error';
        // Xử lý lỗi Database từ Prisma
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002')
                message = `Dữ liệu đã tồn tại (Trùng field: ${error.meta?.target})`;
            if (error.code === 'P2025') {
                statusCode = 404;
                message = 'Không tìm thấy dữ liệu';
            }
        }
        // Xử lý lỗi Validation từ Zod
        if (error instanceof zod_1.ZodError) {
            message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(' | ');
        }
        // Xử lý lỗi Token JWT
        if (error.name === 'JsonWebTokenError') {
            statusCode = 401;
            message = 'Token không hợp lệ';
        }
        if (error.name === 'TokenExpiredError') {
            statusCode = 401;
            message = 'Token đã hết hạn';
        }
        error = new apiError_1.ApiError(statusCode, message, false, err.stack);
    }
    // 2. Trả về JSON cho Frontend
    const response = {
        code: error.statusCode,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) // Chỉ hiện chi tiết lỗi khi code máy mình
    };
    res.status(error.statusCode).send(response);
};
exports.errorMiddleware = errorMiddleware;
