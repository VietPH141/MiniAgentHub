import { Request, Response, NextFunction } from 'express';
import * as conversationService from '../services/conversationService';
import type { GetConversationsInput, CreateConversationInput, UpdateConversationInput } from '../types/conversation';

export async function listUserConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const ownerId = Number(req.params.ownerId);

    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (Number.isNaN(ownerId) || ownerId !== currentUserId) {
      return res.status(403).json({ error: 'Bạn chỉ được xem cuộc hội thoại của chính mình' });
    }

    const conversations = await conversationService.getConversations({
      ownerId,
      deletedAt: null,
    } as GetConversationsInput);
    res.json(conversations);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, modelConfig } = req.body;

    const newConversation = await conversationService.createConversation({
      ownerId: userId,
      title: typeof title === 'string' ? title : 'New conversation',
      modelConfig: typeof modelConfig === 'string' ? modelConfig : null,
      deletedAt: null,
    } as CreateConversationInput);
    res.status(201).json(newConversation);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function updateConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const id = Number(req.params.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid conversation id' });
    }

    const existingConversation = await conversationService.getConversations({ ownerId: currentUserId, deletedAt: null } as any);
    if (!existingConversation.some((item: any) => item.id === id)) {
      return res.status(403).json({ error: 'Bạn không có quyền sửa cuộc hội thoại này' });
    }

    const { title, modelConfig, deletedAt } = req.body;
    if (title === undefined && modelConfig === undefined && deletedAt === undefined) {
      return res.status(400).json({ error: 'At least one field must be provided' });
    }

    const updatedConversation = await conversationService.updateConversation(id, {
      title,
      modelConfig,
      deletedAt,
    } as UpdateConversationInput);
    res.json(updatedConversation);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const currentUserId = Number((req as any).user?.id);
    const id = Number(req.params.id);
    if (!currentUserId || Number.isNaN(currentUserId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid conversation id' });
    }

    const existingConversation = await conversationService.getConversations({ ownerId: currentUserId, deletedAt: null } as any);
    if (!existingConversation.some((item: any) => item.id === id)) {
      return res.status(403).json({ error: 'Bạn không có quyền xóa cuộc hội thoại này' });
    }

    await conversationService.updateConversation(id, { deletedAt: new Date() } as UpdateConversationInput);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
}
