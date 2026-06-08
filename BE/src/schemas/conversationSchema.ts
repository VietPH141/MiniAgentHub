import { z } from 'zod';

export const getConversationsSchema = z.object({
  query: z.object({
    isTrash: z.string().optional().transform(v => v === 'true'), // ?isTrash=true để lấy thùng rác
  }),
  params: z.object({}),
  body: z.object({}).strict(),
});

export const createConversationSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    modelConfig: z.string().optional(),
  }),
});

export const updateConversationSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    title: z.string().max(200).optional(),
    modelConfig: z.string().optional(),
  }).strict(), // Đảm bảo không truyền lén deletedAt vào đây
});

export const conversationIdSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
});

export const deleteConversationSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  query: z.object({
    permanent: z.string().optional().transform(v => v === 'true'),
  }),
});