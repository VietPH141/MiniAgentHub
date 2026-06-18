import { Router } from 'express';
import * as controller from '../controllers/conversationController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import * as schema from '../schemas/conversationSchema';
import { PERMISSIONS } from '../constants/permissions';

const conversationRouter = Router();

conversationRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         id:          { type: integer,  example: 10 }
 *         ownerId:     { type: integer,  example: 1 }
 *         title:       { type: string,   example: "Tư vấn lập trình Node.js" }
 *         modelConfig: { type: string,   example: "gpt-4o" }
 *         chatId:      { type: string,   format: uuid, description: "Flowise chat thread ID" }
 *         sessionId:   { type: string,   format: uuid, description: "Flowise session / memory scope ID" }
 *         createdAt:   { type: string,   format: date-time }
 *         updatedAt:   { type: string,   format: date-time }
 *         deletedAt:   { type: string,   format: date-time, nullable: true }
 */

/**
 * @openapi
 * /api/conversation:
 *   get:
 *     tags: [Conversations]
 *     summary: Lấy danh sách hội thoại
 *     parameters:
 *       - in: query
 *         name: isTrash
 *         schema: { type: boolean }
 *         description: true → thùng rác, false (default) → đang hoạt động
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
 *                 data:    { type: array, items: { $ref: '#/components/schemas/Conversation' } }
 */
conversationRouter.get(
  '/',
  requirePermission(PERMISSIONS.CONV_R),
  validate(schema.getConversationsSchema),
  controller.listConversations
);

/**
 * @openapi
 * /api/conversation/{id}:
 *   get:
 *     tags: [Conversations]
 *     summary: Lấy chi tiết một hội thoại
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Thành công }
 *       403: { description: Không có quyền }
 *       404: { description: Không tìm thấy }
 */
conversationRouter.get(
  '/:id',
  requirePermission(PERMISSIONS.CONV_R),
  validate(schema.conversationIdSchema),
  controller.getConversation
);

/**
 * @openapi
 * /api/conversation:
 *   post:
 *     tags: [Conversations]
 *     summary: Tạo hội thoại mới (tự sinh Flowise chatId & sessionId)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string, maxLength: 200 }
 *               modelConfig: { type: string }
 *     responses:
 *       201: { description: Tạo thành công }
 */
conversationRouter.post(
  '/',
  requirePermission(PERMISSIONS.CONV_C),
  validate(schema.createConversationSchema),
  controller.createConversation
);

/**
 * @openapi
 * /api/conversation/{id}:
 *   patch:
 *     tags: [Conversations]
 *     summary: Cập nhật tiêu đề hoặc modelConfig
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               modelConfig: { type: string }
 *     responses:
 *       200: { description: Cập nhật thành công }
 *       403: { description: Không phải chủ sở hữu }
 *       404: { description: Không tìm thấy hoặc đã bị xóa }
 */
conversationRouter.patch(
  '/:id',
  requirePermission(PERMISSIONS.CONV_U),
  validate(schema.updateConversationSchema),
  controller.updateConversation
);

/**
 * @openapi
 * /api/conversation/{id}/restore:
 *   post:
 *     tags: [Conversations]
 *     summary: Khôi phục hội thoại từ thùng rác
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Khôi phục thành công }
 */
conversationRouter.post(
  '/:id/restore',
  requirePermission(PERMISSIONS.CONV_U),
  validate(schema.conversationIdSchema),
  controller.restoreConversation
);

/**
 * @openapi
 * /api/conversation/{id}:
 *   delete:
 *     tags: [Conversations]
 *     summary: Xóa mềm hội thoại (chuyển vào thùng rác)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Đã xóa vào thùng rác }
 */
conversationRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(schema.deleteConversationSchema),
  controller.softDeleteConversation
);

/**
 * @openapi
 * /api/conversation/{id}/permanent:
 *   delete:
 *     tags: [Conversations]
 *     summary: Xóa vĩnh viễn hội thoại khỏi cơ sở dữ liệu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Đã xóa vĩnh viễn }
 */
conversationRouter.delete(
  '/:id/permanent',
  requirePermission(PERMISSIONS.CONV_D),
  validate(schema.conversationIdSchema),
  controller.hardDeleteConversation
);

export default conversationRouter;