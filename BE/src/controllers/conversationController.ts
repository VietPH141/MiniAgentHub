import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import * as conversationService from '../services/conversationService';

const uid = (req: Request): number => req.user!.id;

async function assertOwnership(
  conversationId: number,
  userId: number,
  { requireActive = true }: { requireActive?: boolean } = {}
) {
  const conv = await conversationService.getConversationById(conversationId);

  if (requireActive && conv.deletedAt) {
    throw new ApiError(404, 'Hội thoại không tồn tại hoặc đã bị xóa');
  }
  if (conv.ownerId !== userId) {
    throw new ApiError(403, 'Bạn không có quyền thực hiện thao tác này');
  }
  return conv;
}

export async function listConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    
    const isTrash = req.query.isTrash === 'true'; 

    const data = await conversationService.getConversations(userId, isTrash);
    
    res.json({ code: 200, message: 'Lấy danh sách thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const conv = await assertOwnership(id, uid(req));

    res.json({ code: 200, message: 'Lấy chi tiết hội thoại thành công', data: conv });
  } catch (error) {
    next(error);
  }
}

export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await conversationService.createConversation({
      ownerId: uid(req),
      title: req.body.title ?? null,
      modelConfig: req.body.modelConfig ?? null,
    });

    res.status(201).json({ code: 201, message: 'Tạo hội thoại thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function updateConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await assertOwnership(id, uid(req)); // ensures active + owner

    const data = await conversationService.updateConversation(id, {
      title: req.body.title,
      modelConfig: req.body.modelConfig,
    });

    res.json({ code: 200, message: 'Cập nhật hội thoại thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function restoreConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await assertOwnership(id, uid(req), { requireActive: false });

    const data = await conversationService.restoreConversation(id);
    res.json({ code: 200, message: 'Khôi phục hội thoại thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function softDeleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await assertOwnership(id, uid(req));

    await conversationService.softDeleteConversation(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function hardDeleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await assertOwnership(id, uid(req), { requireActive: false });

    await conversationService.hardDeleteConversation(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}