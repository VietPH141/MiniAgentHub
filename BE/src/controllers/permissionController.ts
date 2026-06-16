import { Request, Response, NextFunction } from 'express';
import * as permissionService from '../services/permissionService';

export async function listPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const permissions = await permissionService.getPermissions();
    res.json({ code: 200, message: 'Lấy danh sách quyền thành công', data: permissions });
  } catch (error) {
    next(error);
  }
}

export async function attachPermissionToGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupId, permissionId } = req.body;
    const result = await permissionService.attachPermissionToGroup(
      Number(groupId),
      Number(permissionId)
    );
    res.status(201).json({ code: 201, message: 'Gán quyền thành công', data: result });
  } catch (error) {
    next(error);
  }
}

export async function syncGroupPermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const groupId       = Number(req.params.id);
    const permissionIds = req.body.permissionIds as number[];

    const result = await permissionService.syncGroupPermissions(groupId, permissionIds);

    res.json({
      code: 200,
      message: `Đồng bộ quyền thành công: +${result.added} thêm, -${result.removed} xóa, ${result.unchanged} giữ nguyên`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}