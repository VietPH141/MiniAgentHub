import { Router } from 'express';
import * as userController from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';
import { requirePermission } from '../middlewares/rbacMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { 
  createUserSchema, 
  updateUserSchema, 
  getUserByIdSchema, 
  deleteUserSchema 
} from '../schemas/userSchema';
import { PERMISSIONS } from '../constants/permissions';

const userRouter = Router();

// Áp dụng auth middleware cho tất cả routes
userRouter.use(verifyToken);

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *       500:
 *         description: Internal server error
 */
userRouter.get(
  '/', 
  requirePermission(PERMISSIONS.USER_R),
  userController.listUsers
);

userRouter.get(
  '/:id',
  requirePermission(PERMISSIONS.USER_R),
  validate(getUserByIdSchema),
  userController.getUser
);

userRouter.post(
  '/',
  requirePermission(PERMISSIONS.USER_C),
  validate(createUserSchema),
  userController.createUser
);

userRouter.put(
  '/:id',
  requirePermission(PERMISSIONS.USER_U),
  validate(updateUserSchema),
  userController.updateUser
);

userRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.USER_D),
  validate(deleteUserSchema),
  userController.deleteUser
);

export default userRouter;
