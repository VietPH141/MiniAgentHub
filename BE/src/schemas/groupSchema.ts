import { z } from 'zod';

export const getGroupsSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const getGroupByIdSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n) && n > 0, 'ID phải là số nguyên dương'),
  }),
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
    name: z.string().min(1, 'Tên nhóm không được để trống').optional(),
    description: z.string().optional().nullable(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n) && n > 0, 'ID phải là số nguyên dương'),
  }),
});

export const deleteGroupSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n) && n > 0, 'ID phải là số nguyên dương'),
  }),
});

const memberBody = z.object({
  userId:  z.number().int().positive('userId phải là số nguyên dương'),
  groupId: z.number().int().positive('groupId phải là số nguyên dương'),
});

export const assignUserSchema = z.object({
  body:   memberBody,
  query:  z.object({}).strict(),
  params: z.object({}).strict(),
});

export const removeUserSchema = z.object({
  body:   memberBody,
  query:  z.object({}).strict(),
  params: z.object({}).strict(),
});