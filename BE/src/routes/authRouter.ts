import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { signupSchema, loginSchema, refreshSchema } from '../schemas/authSchema';

const authRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         tokenType:
 *           type: string
 *           example: "Bearer"
 *         expiresIn:
 *           type: string
 *           example: "15m"
 *         user:
 *           type: object
 *           properties:
 *             id: { type: integer }
 *             email: { type: string }
 *             fullName: { type: string }
 */

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản mới
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
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Email đã tồn tại
 */
authRouter.post(
    '/signup', 
    validate(signupSchema), 
    authController.signup);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 */
authRouter.post(
    '/login', 
    validate(loginSchema), 
    authController.login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Làm mới Access Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: Cấp token mới thành công
 */
authRouter.post(
    '/refresh', 
    validate(refreshSchema), 
    authController.refresh);

export default authRouter;