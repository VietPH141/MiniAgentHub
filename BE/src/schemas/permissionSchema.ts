import { z } from 'zod';

export const getPermissionsSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const createPermissionSchema = z.object({
  body: z.object({
    permissionKey: z.string().min(1, 'permissionKey không được để trống'),
    entity: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updatePermissionSchema = z.object({
  body: z.object({
    permissionKey: z.string().min(1).optional(),
    entity: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  }).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});

export const deletePermissionSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().transform(v => Number(v)).refine(n => !isNaN(n), 'ID phải là số'),
  }),
});
