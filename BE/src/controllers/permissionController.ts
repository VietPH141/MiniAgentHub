import { Request, Response, NextFunction } from 'express';
import * as permissionService from '../services/permissionService';
// import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function listPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const permissions = await permissionService.getPermissions();
    res.json(permissions);
  } catch (error) {
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
