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
const chatController = __importStar(require("../controllers/chatController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const rbacMiddleware_1 = require("../middlewares/rbacMiddleware");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const chatSchema_1 = require("../schemas/chatSchema");
const permissions_1 = require("../constants/permissions");
const chatRouter = (0, express_1.Router)();
// Áp dụng auth middleware cho tất cả routes
chatRouter.use(authMiddleware_1.verifyToken);
// Chat send route
chatRouter.post('/send', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.CHAT), (0, validateMiddleware_1.validate)(chatSchema_1.sendMessageSchema), chatController.sendMessage);
// Create conversation route
chatRouter.post('/conversation', (0, rbacMiddleware_1.requirePermission)(permissions_1.PERMISSIONS.CONV_C), (0, validateMiddleware_1.validate)(chatSchema_1.createConversationSchema), chatController.createConversation);
exports.default = chatRouter;
