import { Router } from 'express';
import * as conversationController from '../controllers/conversationController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  getConversationsSchema,
  createConversationSchema,
  updateConversationSchema,
  deleteConversationSchema,
} from '../schemas/conversationSchema';
import { PERMISSIONS } from '../constants/permissions';

const conversationRouter = Router();

conversationRouter.use(verifyToken);

conversationRouter.get('/:ownerId',
  requirePermission(PERMISSIONS.CONV_R),
  validate(getConversationsSchema),
  conversationController.listUserConversations
);

conversationRouter.post('/',
  requirePermission(PERMISSIONS.CONV_C),
  validate(createConversationSchema),
  conversationController.createConversation
);

conversationRouter.patch('/:id',
  requirePermission(PERMISSIONS.CONV_U),
  validate(updateConversationSchema),
  conversationController.updateConversation
);

conversationRouter.delete('/:id',
  requirePermission(PERMISSIONS.CONV_D),
  validate(deleteConversationSchema),
  conversationController.deleteConversation
);

export default conversationRouter;
