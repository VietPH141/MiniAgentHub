import { z } from 'zod';

export const getPermissionsSchema = z.object({
  body:   z.object({}).strict(),
  query:  z.object({}).strict(),
  params: z.object({}).strict(),
});

export const syncGroupPermissionsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'groupId phải là số nguyên dương'),
  }),
  body: z.object({
    permissionIds: z
      .array(z.number().int().positive('Mỗi permissionId phải là số nguyên dương'))
      .min(0),
  }),
  query: z.object({}).strict(),
});