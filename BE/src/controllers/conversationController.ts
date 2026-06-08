import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import * as conversationService from '../services/conversationService';

// Định nghĩa Interface để ép kiểu cho req.query sau khi đã validate/transform
interface ConversationQuery {
  isTrash?: boolean;
  permanent?: boolean;
}

export async function listConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    
    // Ép kiểu req.query về interface chúng ta mong muốn
    const query = req.query as unknown as ConversationQuery;
    const isTrash = query.isTrash === true; 

    const data = await conversationService.getConversations(userId, isTrash);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const result = await conversationService.createConversation({
      ...req.body,
      ownerId: userId
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const id = Number(req.params.id);

    const existing = await conversationService.getConversationById(id);
    if (!existing || existing.deletedAt) throw new ApiError(404, 'Hội thoại không tồn tại hoặc đã bị xóa tạm');
    if (existing.ownerId !== userId) throw new ApiError(403, 'Không có quyền');

    const result = await conversationService.updateConversation(id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function restoreConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const id = Number(req.params.id);

    const existing = await conversationService.getConversationById(id);
    if (!existing) throw new ApiError(404, 'Không tìm thấy hội thoại');
    if (existing.ownerId !== userId) throw new ApiError(403, 'Không có quyền');

    const result = await conversationService.restoreConversation(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const id = Number(req.params.id);

    // Ép kiểu tương tự cho permanent
    const query = req.query as unknown as ConversationQuery;
    const permanent = query.permanent === true;

    const existing = await conversationService.getConversationById(id);
    if (!existing) throw new ApiError(404, 'Hội thoại không tồn tại');
    if (existing.ownerId !== userId) throw new ApiError(403, 'Không có quyền');

    await conversationService.deleteConversation(id, permanent);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}