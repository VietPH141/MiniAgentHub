"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.getUserByIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        fullName: zod_1.z.string().min(1, 'Tên đầy đủ không được để trống').optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ').optional(),
        fullName: zod_1.z.string().min(1, 'Tên đầy đủ không được để trống').optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        theme: zod_1.z.enum(['LIGHT', 'DARK']).optional(),
        language: zod_1.z.enum(['VI', 'EN']).optional(),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({
        id: zod_1.z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
    }),
});
exports.getUserByIdSchema = zod_1.z.object({
    body: zod_1.z.object({}).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({
        id: zod_1.z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    body: zod_1.z.object({}).strict(),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({
        id: zod_1.z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
    }),
});
