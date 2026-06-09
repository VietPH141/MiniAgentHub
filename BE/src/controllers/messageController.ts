import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import * as messageService from '../services/messageService';
import type { GetMessageInput, CreateMessageInput, UpdateMessageInput } from '../types/message';

export async function listConversationMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const conversationId = Number(req.params.conversationId);

    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (Number.isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversationId' });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, ownerId: currentUserId, deletedAt: null },
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Bạn không có quyền xem cuộc hội thoại này' });
    }

    const messages = await messageService.getMessage({
      conversationId,
      deletedAt: null,
    } as GetMessageInput);
    res.json(messages);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const { conversationId, role, content, responseTime } = req.body;

    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (conversationId === undefined || !content || typeof content !== 'string') {
      return res.status(400).json({ error: 'conversationId and content are required' });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: Number(conversationId), ownerId: currentUserId, deletedAt: null },
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Bạn không có quyền gửi tin nhắn vào cuộc hội thoại này' });
    }

    const newMessage = await messageService.createMessage({
      conversationId,
      role,
      content,
      responseTime,
      deletedAt: null,
    } as CreateMessageInput);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updateMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const id = Number(req.params.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message id' });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
      include: { conversation: true },
    });
    if (!existingMessage || existingMessage.conversation.ownerId !== currentUserId) {
      return res.status(403).json({ error: 'Bạn không có quyền sửa tin nhắn này' });
    }

    const { role, content, responseTime, deletedAt } = req.body;
    if (role === undefined && content === undefined && responseTime === undefined && deletedAt === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const updatedMessage = await messageService.updateMessage(id, {
      role,
      content,
      responseTime,
      deletedAt,
    } as UpdateMessageInput);
    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const id = Number(req.params.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid message id' });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
      include: { conversation: true },
    });
    if (!existingMessage || existingMessage.conversation.ownerId !== currentUserId) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa tin nhắn này' });
    }

    const deletedMessage = await messageService.updateMessage(id, { deletedAt: new Date() } as UpdateMessageInput);
    res.json(deletedMessage);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
