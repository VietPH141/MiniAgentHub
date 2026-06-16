import { Request, Response, NextFunction } from 'express';
import { PermissionKey } from '../constants/permissions';

export const requirePermission = (requiredKey: PermissionKey) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ code: 401, message: 'Chưa xác thực' });
    }

    if (user.permissions.includes(requiredKey)) {
      return next();
    }

    return res.status(403).json({
      code: 403,
      message: `Bạn thiếu quyền: ${requiredKey} để thực hiện hành động này`,
    });
  };
};