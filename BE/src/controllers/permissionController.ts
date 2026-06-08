import { Request, Response, NextFunction } from 'express';
import * as permissionService from '../services/permissionService';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function listPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const permissions = await permissionService.getPermissions();
    res.json(permissions);
  } catch (error) {
    next(error);
  }
}

export async function getPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const permission = await permissionService.getPermissionById(id);
    if (!permission) return res.status(404).json({ error: 'Permission not found' });
    res.json(permission);
  } catch (error) {
    next(error);
  }
}

export async function createPermission(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.body as CreatePermissionInput;
    const permission = await permissionService.createPermission(data);
    res.status(201).json(permission);
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(400).json({ error: 'Permission key already exists' });
    next(error);
  }
}

export async function updatePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const permission = await permissionService.updatePermission(id, req.body as UpdatePermissionInput);
    res.json(permission);
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Permission not found' });
    next(error);
  }
}

export async function deletePermission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await permissionService.deletePermission(id);
    res.status(204).send();
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Permission not found' });
    next(error);
  }
}

export async function attachPermissionToGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupId, permissionId } = req.body;
    const result = await permissionService.attachPermissionToGroup(Number(groupId), Number(permissionId));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
