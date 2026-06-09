import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  getMessageSchema,
  createMessageSchema,
  updateMessageSchema,
  deleteMessageSchema,
} from '../schemas/messageSchema';

import { PERMISSIONS } from '../constants/permissions';

const messageRouter = Router();

messageRouter.use(verifyToken);

/**
 * @openapi
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         conversationId: { type: integer }
 *         role: { type: string, enum: [USER, ASSISTANT, SYSTEM] }
 *         content: { type: string }
 *         responseTime: { type: number, nullable: true }
 *         createdAt: { type: string, format: date-time }
 */

/**
 * @openapi
 * /api/message/{conversationId}:
 *   get:
 *     tags: [Messages]
 *     summary: Lấy tin nhắn theo hội thoại (CONV_R)
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Message' } }
 *       403: { description: Không có quyền xem hội thoại này }
 */
messageRouter.get(
  '/:conversationId',
  requirePermission(PERMISSIONS.CONV_R),
  validate(getMessageSchema),
  messageController.listConversationMessage
);

/**
 * @openapi
 * /api/message:
 *   post:
 *     tags: [Messages]
 *     summary: Tạo tin nhắn mới thủ công (CONV_C)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, content]
 *             properties:
 *               conversationId: { type: integer }
 *               role: { type: string, enum: [USER, ASSISTANT, SYSTEM] }
 *               content: { type: string }
 *     responses:
 *       201: { description: Tạo thành công }
 */
messageRouter.post(
  '/',
  requirePermission(PERMISSIONS.CONV_C),
  validate(createMessageSchema),
  messageController.createMessage
);

/**
 * @openapi
 * /api/message/{id}:
 *   patch:
 *     tags: [Messages]
 *     summary: Cập nhật tin nhắn (CONV_U)
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
 *               content: { type: string }
 *     responses:
 *       200: { description: Thành công }
 */
messageRouter.patch(
  '/:id',
  requirePermission(PERMISSIONS.CONV_U),
  validate(updateMessageSchema),
  messageController.updateMessage
);

/**
 * @openapi
 * /api/message/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Xóa tạm tin nhắn (CONV_D)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Đã chuyển vào trạng thái xóa }
 */
messageRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(deleteMessageSchema),
  messageController.deleteMessage
);

export default messageRouter;
