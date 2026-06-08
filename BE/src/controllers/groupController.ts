import { Request, Response, NextFunction } from 'express';
import * as groupService from '../services/groupService';
import type { CreateGroupInput, UpdateGroupInput } from '../types/group';

export async function listGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const groups = await groupService.getGroups();
    res.json(groups);
  } catch (error) {
    next(error);
  }
}

export async function getGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const group = await groupService.getGroupById(id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (error) {
    next(error);
  }
}

export async function createGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreateGroupInput;
    const group = await groupService.createGroup(data);
    res.status(201).json(group);
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(400).json({ error: 'Group name already exists' });
    next(error);
  }
}

export async function updateGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const group = await groupService.updateGroup(id, req.body as UpdateGroupInput);
    res.json(group);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Group not found' });
    next(error);
  }
}

export async function deleteGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await groupService.deleteGroup(id);
    res.status(204).send();
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Group not found' });
    next(error);
  }
}

export async function addUserToGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, groupId } = req.body;
    const result = await groupService.addUserToGroup(Number(userId), Number(groupId));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
