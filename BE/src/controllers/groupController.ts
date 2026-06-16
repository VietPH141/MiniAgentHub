import { Request, Response, NextFunction } from 'express';
import * as groupService from '../services/groupService';
import type { CreateGroupInput, UpdateGroupInput } from '../types/group';

export async function listGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await groupService.getGroups();
    res.json({ code: 200, message: 'Lấy danh sách nhóm thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function getGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await groupService.getGroupById(id);
    res.json({ code: 200, message: 'Lấy thông tin nhóm thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function createGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateGroupInput;
    const data = await groupService.createGroup(input);

    res.status(201).json({ code: 201, message: 'Tạo nhóm thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function updateGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const data = await groupService.updateGroup(id, req.body as UpdateGroupInput);

    res.json({ code: 200, message: 'Cập nhật nhóm thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function deleteGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await groupService.deleteGroup(id);
    // Prisma P2025 (not found) → errorMiddleware → 404
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addUserToGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, groupId } = req.body as { userId: number; groupId: number };
    const data = await groupService.addUserToGroup(userId, groupId);
    
    res.status(201).json({ code: 201, message: 'Thêm người dùng vào nhóm thành công', data });
  } catch (error) {
    next(error);
  }
}

export async function removeUserFromGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, groupId } = req.body as { userId: number; groupId: number };
    await groupService.removeUserFromGroup(userId, groupId);

    res.json({ code: 200, message: 'Xóa người dùng khỏi nhóm thành công', data: null });
  } catch (error) {
    next(error);
  }
}