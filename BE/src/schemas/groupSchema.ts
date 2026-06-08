import { z } from 'zod';

export const getGroupsSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tên nhóm không được để trống'),
    description: z.string().optional().nullable(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const deleteGroupSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});
