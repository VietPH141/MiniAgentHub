import { z } from 'zod';

export const getConversationsSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    ownerId: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const createConversationSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    modelConfig: z.string().optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateConversationSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    modelConfig: z.string().optional(),
    deletedAt: z.date().nullable().optional(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const deleteConversationSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});
