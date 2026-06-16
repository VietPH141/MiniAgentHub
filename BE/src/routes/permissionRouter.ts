import { Router } from 'express';
import * as permissionController from '../controllers/permissionController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { getPermissionsSchema, syncGroupPermissionsSchema } from '../schemas/permissionSchema';

const permissionRouter = Router();

permissionRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:            { type: integer, example: 1 }
 *         permissionKey: { type: string,  example: "USER_C" }
 *         entity:        { type: string,  example: "User" }
 *         description:   { type: string,  example: "Quyền tạo người dùng" }
 *     SyncPermissionsResult:
 *       type: object
 *       properties:
 *         added:     { type: integer, example: 3 }
 *         removed:   { type: integer, example: 1 }
 *         unchanged: { type: integer, example: 5 }
 */

/**
 * @openapi
 * /api/permission:
 *   get:
 *     tags: [Permissions]
 *     summary: Lấy danh sách tất cả quyền (GROUP_R)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 200 }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Permission' }
 *       401: { description: Chưa đăng nhập }
 *       403: { description: Không có quyền GROUP_R }
 */
permissionRouter.get(
  '/',
  requirePermission(PERMISSIONS.GROUP_R),
  validate(getPermissionsSchema),
  permissionController.listPermissions
);

/**
 * @openapi
 * /api/permission/attach:
 *   post:
 *     tags: [Permissions]
 *     summary: Gán một quyền vào nhóm (GROUP_U)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, permissionId]
 *             properties:
 *               groupId:      { type: integer, example: 2 }
 *               permissionId: { type: integer, example: 5 }
 *     responses:
 *       201: { description: Gán quyền thành công }
 *       401: { description: Chưa đăng nhập }
 *       403: { description: Không có quyền GROUP_U }
 */
permissionRouter.post(
  '/attach',
  requirePermission(PERMISSIONS.GROUP_U),
  permissionController.attachPermissionToGroup
);

/**
 * @openapi
 * /api/permission/groups/{id}/permissions:
 *   put:
 *     tags: [Permissions]
 *     summary: Đồng bộ toàn bộ quyền của một nhóm — Smart Sync (GROUP_U)
 *     description: |
 *       So sánh danh sách `permissionIds` mới với trạng thái hiện tại trong DB.
 *       Chỉ thực hiện **thêm** các ID còn thiếu và **xóa** các ID không còn trong danh sách mới.
 *       Truyền mảng rỗng `[]` để xóa toàn bộ quyền khỏi nhóm.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của nhóm cần đồng bộ quyền
 *         schema:
 *           type: integer
 *           example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permissionIds]
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 description: Danh sách ID quyền mới (mảng rỗng = xóa hết)
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 example: [1, 5, 8, 12]
 *     responses:
 *       200:
 *         description: Đồng bộ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 200 }
 *                 message: { type: string,  example: "Đồng bộ quyền thành công: +3 thêm, -1 xóa, 5 giữ nguyên" }
 *                 data:    { $ref: '#/components/schemas/SyncPermissionsResult' }
 *       400:
 *         description: permissionIds chứa ID không tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 400 }
 *                 message: { type: string,  example: "permissionIds không hợp lệ: [99, 100]" }
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 401 }
 *                 message: { type: string,  example: "Bạn chưa đăng nhập" }
 *       403:
 *         description: Không có quyền GROUP_U
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 403 }
 *                 message: { type: string,  example: "Bạn thiếu quyền: GROUP_U để thực hiện hành động này" }
 *       404:
 *         description: Group không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:    { type: integer, example: 404 }
 *                 message: { type: string,  example: "Không tìm thấy dữ liệu" }
 */
permissionRouter.put(
  '/groups/:id/permissions',
  requirePermission(PERMISSIONS.GROUP_U),
  validate(syncGroupPermissionsSchema),
  permissionController.syncGroupPermissions
);

export default permissionRouter;