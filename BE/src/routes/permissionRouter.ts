import { Router } from 'express';
import * as permissionController from '../controllers/permissionController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { getPermissionsSchema } from '../schemas/permissionSchema';

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
