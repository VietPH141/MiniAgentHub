import { Router } from 'express';
import * as groupController from '../controllers/groupController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { createGroupSchema, getGroupsSchema, updateGroupSchema, deleteGroupSchema } from '../schemas/groupSchema';

const groupRouter = Router();

groupRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         name: { type: string, example: "Admin Group" }
 *         description: { type: string, example: "Nhóm có quyền quản trị tối cao" }
 *         createdAt: { type: string, format: date-time }
 *     GroupResponse:
 *       type: object
 *       properties:
 *         code: { type: integer }
 *         message: { type: string }
 *         data: { $ref: '#/components/schemas/Group' }
*/

/**
 * @openapi
 * /api/group:
 *   get:
 *     tags: [Groups]
 *     summary: Danh sách tất cả nhóm
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Group' } }
*/
groupRouter.get(
    '/', 
    requirePermission(PERMISSIONS.GROUP_R), 
    validate(getGroupsSchema), 
    groupController.listGroups);

/**
 * @openapi
 * /api/group/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Lấy chi tiết nhóm (GROUP_R)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Group' }
 *       404: { description: Không tìm thấy nhóm }
*/
groupRouter.get(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_R), 
    validate(getGroupsSchema), 
    groupController.getGroup);

/**
 * @openapi
 * /api/group:
 *   post:
 *     tags: [Groups]
 *     summary: Tạo nhóm mới (GROUP_C)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Tạo thành công }
 *       400: { description: Tên nhóm đã tồn tại }
*/
groupRouter.post(
    '/', 
    requirePermission(PERMISSIONS.GROUP_C), 
    validate(createGroupSchema), 
    groupController.createGroup);

/**
 * @openapi
 * /api/group/{id}:
 *   put:
 *     tags: [Groups]
 *     summary: Cập nhật thông tin nhóm (GROUP_U)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Group' }
 *     responses:
 *       200: { description: Thành công }
*/
groupRouter.put(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_U), 
    validate(updateGroupSchema), 
    groupController.updateGroup);

/**
 * @openapi
 * /api/group/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Xóa nhóm (GROUP_D)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Xóa thành công }
*/
groupRouter.delete(
    '/:id', 
    requirePermission(PERMISSIONS.GROUP_D), 
    validate(deleteGroupSchema), 
    groupController.deleteGroup);

/**
 * @openapi
 * /api/group/assign-user:
 *   post:
 *     tags: [Groups]
 *     summary: Thêm người dùng vào nhóm (GROUP_ADD_USER)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, groupId]
 *             properties:
 *               userId: { type: integer }
 *               groupId: { type: integer }
 *     responses:
 *       201: { description: Thêm thành công }
 */
groupRouter.post(
    '/assign-user', 
    requirePermission(PERMISSIONS.GROUP_ADD_USER), 
    groupController.addUserToGroup);

export default groupRouter;
