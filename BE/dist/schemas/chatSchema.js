"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationSchema = exports.sendMessageSchema = void 0;
const zod_1 = require("zod");
exports.sendMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        conversationId: zod_1.z.number().int().positive('ID cuộc trò chuyện phải là số dương'),
        content: zod_1.z.string().min(1, 'Nội dung tin nhắn không được để trống'),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
exports.createConversationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Tiêu đề không được để trống').optional(),
    }),
    query: zod_1.z.object({}).strict(),
    params: zod_1.z.object({}).strict(),
});
