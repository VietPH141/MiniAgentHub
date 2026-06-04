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

messageRouter.get('/:conversationId',
  requirePermission(PERMISSIONS.CONV_R),
  validate(getMessageSchema),
  messageController.listConversationMessage
);

messageRouter.post('/',
  requirePermission(PERMISSIONS.CONV_C),
  validate(createMessageSchema),
  messageController.createMessage
);

messageRouter.patch('/:id',
  requirePermission(PERMISSIONS.CONV_U),
  validate(updateMessageSchema),
  messageController.updateMessage
);

messageRouter.delete('/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(deleteMessageSchema),
  messageController.deleteMessage
);

export default messageRouter;
