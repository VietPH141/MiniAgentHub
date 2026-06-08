import { Router } from 'express';
import * as groupController from '../controllers/groupController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { createGroupSchema, getGroupsSchema, updateGroupSchema, deleteGroupSchema } from '../schemas/groupSchema';

const groupRouter = Router();

groupRouter.use(verifyToken);

groupRouter.get('/', requirePermission(PERMISSIONS.GROUP_R), validate(getGroupsSchema), groupController.listGroups);
groupRouter.get('/:id', requirePermission(PERMISSIONS.GROUP_R), validate(getGroupsSchema), groupController.getGroup);
groupRouter.post('/', requirePermission(PERMISSIONS.GROUP_C), validate(createGroupSchema), groupController.createGroup);
groupRouter.put('/:id', requirePermission(PERMISSIONS.GROUP_U), validate(updateGroupSchema), groupController.updateGroup);
groupRouter.delete('/:id', requirePermission(PERMISSIONS.GROUP_D), validate(deleteGroupSchema), groupController.deleteGroup);
groupRouter.post('/assign-user', requirePermission(PERMISSIONS.GROUP_ADD_USER), groupController.addUserToGroup);

export default groupRouter;
