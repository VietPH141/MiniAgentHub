import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { sendMessageSchema, createConversationSchema } from '../schemas/chatSchema';
import { PERMISSIONS } from '../constants/permissions';

const chatRouter = Router();

// Áp dụng auth middleware cho tất cả routes
chatRouter.use(verifyToken);

// Chat send route
chatRouter.post(
  '/send',
  requirePermission(PERMISSIONS.CHAT),
  validate(sendMessageSchema),
  chatController.sendMessage
);

// Create conversation route
chatRouter.post(
  '/conversation',
  requirePermission(PERMISSIONS.CONV_C),
  validate(createConversationSchema),
  chatController.createConversation
);

export default chatRouter;
