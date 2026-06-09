import { Router } from 'express';
import * as conversationController from '../controllers/conversationController';
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
 *         id: { type: integer, example: 10 }
 *         ownerId: { type: integer, example: 1 }
 *         title: { type: string, example: "Tư vấn lập trình Nodejs" }
 *         modelConfig: { type: string, example: "gpt-4" }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         deletedAt: { type: string, format: date-time, nullable: true }
 */

/**
 * @openapi
 * /api/conversation:
 *   get:
 *     tags: [Conversations]
 *     summary: Lấy danh sách hội thoại
 *     description: Có thể lấy danh sách hiện tại hoặc trong thùng rác thông qua query isTrash
 *     parameters:
 *       - in: query
 *         name: isTrash
 *         schema: { type: boolean }
 *         example: false
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Conversation' } }
 */
conversationRouter.get(
  '/',
  requirePermission(PERMISSIONS.CONV_R),
  validate(schema.getConversationsSchema),
  conversationController.listConversations
);

/**
 * @openapi
 * /api/conversation:
 *   post:
 *     tags: [Conversations]
 *     summary: Tạo hội thoại mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               modelConfig: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
conversationRouter.post(
  '/',
  requirePermission(PERMISSIONS.CONV_C),
  validate(schema.createConversationSchema),
  conversationController.createConversation
);

/**
 * @openapi
 * /api/conversation/{id}:
 *   patch:
 *     tags: [Conversations]
 *     summary: Cập nhật hội thoại
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
 *               title: { type: string }
 *     responses:
 *       200: { description: Cập nhật thành công }
 */
conversationRouter.patch(
  '/:id',
  requirePermission(PERMISSIONS.CONV_U),
  validate(schema.updateConversationSchema),
  conversationController.updateConversation
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
  conversationController.restoreConversation
);

/**
 * @openapi
 * /api/conversation/{id}:
 *   delete:
 *     tags: [Conversations]
 *     summary: Xóa hội thoại
 *     description: Mặc định là xóa tạm (vào thùng rác). Dùng permanent=true để xóa vĩnh viễn.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: permanent
 *         schema: { type: boolean }
 *     responses:
 *       204: { description: Xóa thành công }
 */
conversationRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(schema.deleteConversationSchema),
  conversationController.deleteConversation
);

export default conversationRouter;