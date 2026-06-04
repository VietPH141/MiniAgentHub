import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    fullName: z.string().min(1, 'Tên đầy đủ không được để trống').optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ').optional(),
    fullName: z.string().min(1, 'Tên đầy đủ không được để trống').optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    theme: z.enum(['LIGHT', 'DARK']).optional(),
    language: z.enum(['VI', 'EN']).optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const getUserByIdSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const deleteUserSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});
