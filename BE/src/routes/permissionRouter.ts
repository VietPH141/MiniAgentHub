import { Router } from 'express';
import * as permissionController from '../controllers/permissionController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { PERMISSIONS } from '../constants/permissions';
import { createPermissionSchema, getPermissionsSchema, updatePermissionSchema, deletePermissionSchema } from '../schemas/permissionSchema';

const permissionRouter = Router();

permissionRouter.use(verifyToken);

permissionRouter.get('/', requirePermission(PERMISSIONS.GROUP_R), validate(getPermissionsSchema), permissionController.listPermissions);
permissionRouter.get('/:id', requirePermission(PERMISSIONS.GROUP_R), validate(getPermissionsSchema), permissionController.getPermission);
permissionRouter.post('/', requirePermission(PERMISSIONS.GROUP_U), validate(createPermissionSchema), permissionController.createPermission);
permissionRouter.put('/:id', requirePermission(PERMISSIONS.GROUP_U), validate(updatePermissionSchema), permissionController.updatePermission);
permissionRouter.delete('/:id', requirePermission(PERMISSIONS.GROUP_D), validate(deletePermissionSchema), permissionController.deletePermission);
permissionRouter.post('/attach', requirePermission(PERMISSIONS.GROUP_U), permissionController.attachPermissionToGroup);

export default permissionRouter;
