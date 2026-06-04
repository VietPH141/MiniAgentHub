import { z } from 'zod';

export const getMessageSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    conversationId: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'conversationId phải là số'),
    role: z.enum(['USER', 'ASSISTANT', 'SYSTEM']).optional(),
    content: z.string().min(1, 'Content is required'),
    responseTime: z.number().optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateMessageSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'ASSISTANT', 'SYSTEM']).optional(),
    content: z.string().optional(),
    responseTime: z.number().optional(),
    deletedAt: z.date().nullable().optional(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const deleteMessageSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});
