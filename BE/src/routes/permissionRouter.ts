import { Router } from 'express';
import * as permissionController from '../controllers/permissionController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { createPermissionSchema, getPermissionsSchema, updatePermissionSchema, deletePermissionSchema } from '../schemas/permissionSchema';

const permissionRouter = Router();

permissionRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         permissionKey: { type: string, example: "USER_C" }
 *         entity: { type: string, example: "User" }
 *         description: { type: string, example: "Quyền tạo người dùng" }
 */

/**
 * @openapi
 * /api/permission:
 *   get:
 *     tags: [Permissions]
 *     summary: Danh sách mã quyền (GROUP_R)
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Permission' } }
 */
permissionRouter.get(
    '/', 
    requirePermission(PERMISSIONS.GROUP_R), 
    validate(getPermissionsSchema), 
    permissionController.listPermissions);

/**
 * @openapi
 * /api/permission/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: Chi tiết mã quyền (GROUP_R)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { content: { application/json: { schema: { $ref: '#/components/schemas/Permission' } } } }
 */
permissionRouter.get(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_R), 
    validate(getPermissionsSchema), 
    permissionController.getPermission);

/**
 * @openapi
 * /api/permission:
 *   post:
 *     tags: [Permissions]
 *     summary: Tạo mã quyền mới (GROUP_U)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissionKey]
 *             properties:
 *               permissionKey: { type: string }
 *               entity: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Tạo thành công }
 */
permissionRouter.post(
    '/', 
    requirePermission(PERMISSIONS.GROUP_U), 
    validate(createPermissionSchema), 
    permissionController.createPermission);

/**
 * @openapi
 * /api/permission/{id}:
 *   put:
 *     tags: [Permissions]
 *     summary: Cập nhật mã quyền (GROUP_U)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Thành công }
 */
permissionRouter.put(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_U), 
    validate(updatePermissionSchema), 
    permissionController.updatePermission);

/**
 * @openapi
 * /api/permission/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Xóa mã quyền (GROUP_D)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Xóa thành công }
 */
permissionRouter.delete(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_D), 
    validate(deletePermissionSchema), 
    permissionController.deletePermission);

/**
 * @openapi
 * /api/permission/attach:
 *   post:
 *     tags: [Permissions]
 *     summary: Gán quyền vào nhóm (GROUP_U)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, permissionId]
 *             properties:
 *               groupId: { type: integer }
 *               permissionId: { type: integer }
 *     responses:
 *       201: { description: Gán thành công }
 */
permissionRouter.post(
    '/attach', 
    requirePermission(PERMISSIONS.GROUP_U), 
    permissionController.attachPermissionToGroup);

export default permissionRouter;
