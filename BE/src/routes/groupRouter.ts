import { Router } from 'express';
import * as groupController from '../controllers/groupController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import {
  createGroupSchema,
  getGroupsSchema,
  getGroupByIdSchema,
  updateGroupSchema,
  deleteGroupSchema,
  assignUserSchema,
  removeUserSchema,
} from '../schemas/groupSchema';

const groupRouter = Router();

groupRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:          { type: integer,  example: 1 }
 *         name:        { type: string,   example: "Admin" }
 *         description: { type: string,   example: "Nhóm quản trị viên" }
 *         createdAt:   { type: string,   format: date-time }
 *
 *     GroupEnvelope:
 *       type: object
 *       properties:
 *         code:    { type: integer, example: 200 }
 *         message: { type: string,  example: "Thành công" }
 *         data:    { $ref: '#/components/schemas/Group' }
 *
 *     GroupListEnvelope:
 *       type: object
 *       properties:
 *         code:    { type: integer, example: 200 }
 *         message: { type: string,  example: "Lấy danh sách nhóm thành công" }
 *         data:    { type: array, items: { $ref: '#/components/schemas/Group' } }
 *
 *     MemberBody:
 *       type: object
 *       required: [userId, groupId]
 *       properties:
 *         userId:  { type: integer, example: 42 }
 *         groupId: { type: integer, example: 3  }
 */

/**
 * @openapi
 * /api/group:
 *   get:
 *     tags: [Groups]
 *     summary: Lấy danh sách tất cả nhóm
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GroupListEnvelope' }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_R }
 */
groupRouter.get(
  '/',
  requirePermission(PERMISSIONS.GROUP_R),
  validate(getGroupsSchema),
  groupController.listGroups,
);

/**
 * @openapi
 * /api/group/{id}:
 *   get:
 *     tags: [Groups]
 *     summary: Lấy chi tiết một nhóm
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID của nhóm
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GroupEnvelope' }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_R }
 *       404: { description: Không tìm thấy nhóm }
 */
groupRouter.get(
  '/:id',
  requirePermission(PERMISSIONS.GROUP_R),
  validate(getGroupByIdSchema),   // ← đổi từ getGroupsSchema
  groupController.getGroup,
);

/**
 * @openapi
 * /api/group:
 *   post:
 *     tags: [Groups]
 *     summary: Tạo nhóm mới
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:        { type: string, minLength: 1, example: "Editor" }
 *               description: { type: string, example: "Nhóm biên tập viên" }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GroupEnvelope' }
 *       400: { description: Tên nhóm đã tồn tại hoặc dữ liệu không hợp lệ }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_C }
 */
groupRouter.post(
  '/',
  requirePermission(PERMISSIONS.GROUP_C),
  validate(createGroupSchema),
  groupController.createGroup,
);

/**
 * @openapi
 * /api/group/{id}:
 *   patch:
 *     tags: [Groups]
 *     summary: Cập nhật thông tin nhóm (partial update)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID của nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:        { type: string, minLength: 1 }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GroupEnvelope' }
 *       400: { description: Dữ liệu không hợp lệ }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_U }
 *       404: { description: Không tìm thấy nhóm }
 */
groupRouter.patch(                          // ← was PUT
  '/:id',
  requirePermission(PERMISSIONS.GROUP_U),
  validate(updateGroupSchema),
  groupController.updateGroup,
);

/**
 * @openapi
 * /api/group/remove-user:
 *   delete:
 *     tags: [Groups]
 *     summary: Xóa người dùng khỏi nhóm
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MemberBody' }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 200 }
 *                 message: { type: string,  example: "Xóa người dùng khỏi nhóm thành công" }
 *                 data:    { type: object, nullable: true, example: null }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_DELETE_USER }
 *       404: { description: Người dùng không thuộc nhóm này }
 */
groupRouter.delete(
  '/remove-user',
  requirePermission(PERMISSIONS.GROUP_DELETE_USER),
  validate(removeUserSchema),
  groupController.removeUserFromGroup,
);

/**
 * @openapi
 * /api/group/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Xóa nhóm
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID của nhóm
 *     responses:
 *       204: { description: Xóa thành công }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_D }
 *       404: { description: Không tìm thấy nhóm }
 */
groupRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.GROUP_D),
  validate(deleteGroupSchema),
  groupController.deleteGroup,
);

/**
 * @openapi
 * /api/group/assign-user:
 *   post:
 *     tags: [Groups]
 *     summary: Thêm người dùng vào nhóm
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MemberBody' }
 *     responses:
 *       201:
 *         description: Thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 201 }
 *                 message: { type: string,  example: "Thêm người dùng vào nhóm thành công" }
 *                 data:    { $ref: '#/components/schemas/MemberBody' }
 *       400: { description: Người dùng đã thuộc nhóm này }
 *       401: { description: Chưa xác thực }
 *       403: { description: Không có quyền GROUP_ADD_USER }
 */
groupRouter.post(
  '/assign-user',
  requirePermission(PERMISSIONS.GROUP_ADD_USER),
  validate(assignUserSchema),             // ← was missing
  groupController.addUserToGroup,
);

export default groupRouter;