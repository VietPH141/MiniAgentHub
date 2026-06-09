import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { sendMessageSchema, createConversationSchema } from '../schemas/chatSchema';
import { PERMISSIONS } from '../constants/permissions';

const chatRouter = Router();

chatRouter.use(verifyToken);

/**
 * @openapi
 * /api/chat/send:
 *   post:
 *     tags: [Chat]
 *     summary: Gửi tin nhắn và nhận phản hồi AI Stream (CHAT)
 *     description: API này sử dụng Server-Sent Events (SSE) để trả về dữ liệu stream từ LLM.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [conversationId, content]
 *             properties:
 *               conversationId: { type: integer }
 *               content: { type: string, example: "Xin chào AI" }
 *     responses:
 *       200: {description: Stream data bắt đầu (text/event-stream) }
 *       401: { description: Chưa đăng nhập }
 *       404: { description: Không tìm thấy hội thoại }
 */

chatRouter.post(
  '/send',
  requirePermission(PERMISSIONS.CHAT),
  validate(sendMessageSchema),
  chatController.sendMessage
);

/**
 * @openapi
 * /api/chat/conversation:
 *   post:
 *     tags: [Chat]
 *     summary: Tạo nhanh hội thoại mới để bắt đầu chat (CONV_C)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Cuộc hội thoại mới" }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Conversation' }
 */
chatRouter.post(
  '/conversation',
  requirePermission(PERMISSIONS.CONV_C),
  validate(createConversationSchema),
  chatController.createConversation
);

export default chatRouter;
