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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *         fullName:
 *           type: string
 *           example: "Nguyen Van A"
 *         phoneNumber:
 *           type: string
 *           example: "0987654321"
 *         address:
 *           type: string
 *           example: "Hà Nội, Việt Nam"
 *         isActive:
 *           type: boolean
 *           example: true
 *         theme:
 *           type: string
 *           enum: [LIGHT, DARK]
 *         language:
 *           type: string
 *           enum: [VI, EN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UserResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags: [Users]
 *     summary: Lấy danh sách người dùng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về mảng user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Không có quyền (USER_R)
 */
userRouter.get(
  '/', 
  requirePermission(PERMISSIONS.USER_R),
  userController.listUsers
);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thông tin chi tiết người dùng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 */
userRouter.get(
  '/:id',
  requirePermission(PERMISSIONS.USER_R),
  validate(getUserByIdSchema),
  userController.getUser
);

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags: [Users]
 *     summary: Tạo người dùng mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               fullName: { type: string }
 *               phoneNumber: { type: string }
 *               isActive: { type: boolean, default: true }
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Email đã tồn tại hoặc dữ liệu không hợp lệ
 */
userRouter.post(
  '/',
  requirePermission(PERMISSIONS.USER_C),
  validate(createUserSchema),
  userController.createUser
);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật thông tin người dùng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 */
userRouter.put(
  '/:id',
  requirePermission(PERMISSIONS.USER_U),
  validate(updateUserSchema),
  userController.updateUser
);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Xóa người dùng
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa thành công (Không trả về body)
 *       404:
 *         description: Không tìm thấy người dùng
 */
userRouter.delete(
  '/:id',
  requirePermission(PERMISSIONS.USER_D),
  validate(deleteUserSchema),
  userController.deleteUser
);

export default userRouter;