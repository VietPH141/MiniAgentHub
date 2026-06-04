import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.number().int().positive('ID cuộc trò chuyện phải là số dương'),
    content: z.string().min(1, 'Nội dung tin nhắn không được để trống'),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const createConversationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});
