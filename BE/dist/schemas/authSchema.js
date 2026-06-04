"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        fullName: zod_1.z.string().min(1, 'Tên đầy đủ không được để trống').optional(),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(1, 'Mật khẩu không được để trống'),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token không được để trống'),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
