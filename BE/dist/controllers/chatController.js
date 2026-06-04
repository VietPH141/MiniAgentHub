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
exports.sendMessage = sendMessage;
exports.createConversation = createConversation;
const aiService = __importStar(require("../services/aiService"));
const db_1 = require("../db");
async function sendMessage(req, res) {
    const { conversationId, content } = req.body;
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'content is required and must be a string' });
    }
    const conversationIdNumber = Number(conversationId);
    if (!conversationId || Number.isNaN(conversationIdNumber)) {
        return res.status(400).json({ error: 'conversationId is required and must be a numeric id' });
    }
    try {
        const conversation = await db_1.prisma.conversation.findUnique({ where: { id: conversationIdNumber } });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found. Create a conversation first.' });
        }
        await db_1.prisma.message.create({
            data: {
                conversationId: conversationIdNumber,
                role: "USER",
                content,
            }
        });
        const aiFullContent = await aiService.getFlowiseStream(content, res);
        if (aiFullContent) {
            await db_1.prisma.message.create({
                data: {
                    conversationId: conversationIdNumber,
                    role: "ASSISTANT",
                    content: aiFullContent,
                }
            });
        }
    }
    catch (error) {
        console.error("Chat Controller Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
async function createConversation(req, res) {
    const { title } = req.body;
    try {
        const user = await db_1.prisma.user.findFirst();
        if (!user) {
            return res.status(400).json({ error: 'No user exists. Create a user before creating a conversation.' });
        }
        const conversation = await db_1.prisma.conversation.create({
            data: {
                ownerId: user.id,
                title: typeof title === 'string' ? title : 'Test conversation',
            },
        });
        res.status(201).json(conversation);
    }
    catch (error) {
        console.error("Create Conversation Error:", error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
}
