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
 * /api/conversation:
 *   get:
 *     tags: [Conversations]
 *     summary: Lấy danh sách hội thoại (hoặc thùng rác)
 *     parameters:
 *       - in: query
 *         name: isTrash
 *         schema: { type: boolean }
 *         description: Nếu true sẽ lấy danh sách các hội thoại đã xóa tạm
 *     responses:
 *       200:
 *         description: Thành công
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
 *     summary: Cập nhật hội thoại (Không ảnh hưởng đến deletedAt)
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
 *     summary: Xóa hội thoại (Xóa tạm hoặc Xóa vĩnh viễn)
 *     parameters:
 *       - in: query
 *         name: permanent
 *         schema: { type: boolean }
 *         description: Nếu true sẽ xóa khỏi DB, mặc định là false (xóa tạm)
 */
conversationRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(schema.deleteConversationSchema),
  conversationController.deleteConversation
);

export default conversationRouter;