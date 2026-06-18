import { z } from 'zod';

export const getConversationsSchema = z.object({
  query: z.object({
    isTrash: z
      .string()
      .optional()
      .transform(v => v === 'true'),
  }),
  params: z.object({}).strict(),
  body: z.object({}).strict(),
});

export const createConversationSchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    modelConfig: z.string().optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const conversationIdSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  query: z.object({}).strict(),
  body: z.object({}).strict(),
});

export const updateConversationSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z
    .object({
      title: z.string().max(200).optional(),
      modelConfig: z.string().optional(),
    })
    .strict(), // prevent stealthy deletedAt injection
  query: z.object({}).strict(),
});

export const deleteConversationSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  query: z.object({}).strict(),
  body: z.object({}).strict(),
});