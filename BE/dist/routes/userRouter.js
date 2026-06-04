"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const userSchema_1 = require("../schemas/userSchema");
const permissions_1 = require("../constants/permissions");
const userRouter = (0, express_1.Router)();
// Áp dụng auth middleware cho tất cả routes
userRouter.use(authMiddleware_1.verifyToken);
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
userRouter.get('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USER_R), userController.listUsers);
userRouter.get('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USER_R), (0, validateMiddleware_1.validate)(userSchema_1.getUserByIdSchema), userController.getUser);
userRouter.post('/', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USER_C), (0, validateMiddleware_1.validate)(userSchema_1.createUserSchema), userController.createUser);
userRouter.put('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USER_U), (0, validateMiddleware_1.validate)(userSchema_1.updateUserSchema), userController.updateUser);
userRouter.delete('/:id', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.USER_D), (0, validateMiddleware_1.validate)(userSchema_1.deleteUserSchema), userController.deleteUser);
exports.default = userRouter;
