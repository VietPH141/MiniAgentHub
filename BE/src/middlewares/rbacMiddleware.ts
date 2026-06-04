import { Response, NextFunction } from 'express';
import { prisma } from '../db';
import { PermissionKey } from '../constants/permissions';

export const requirePermission = (requiredKey: PermissionKey) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      // Tìm user cùng tất cả các quyền mà họ có thông qua các Group
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userGroups: {
            include: {
              group: {
                include: {
                  groupPermissions: {
                    include: { permission: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!user || !user.isActive) {
        return res.status(403).json({ error: 'Tài khoản bị khóa hoặc không tồn tại' });
      }

      // Thu thập tất cả permissionKey từ các group mà user tham gia
      const userPermissions = user.userGroups.flatMap((ug: any) =>
        ug.group.groupPermissions.map((gp: any) => gp.permission.permissionKey)
      );

      // KIỂM TRA QUYỀN
      if (userPermissions.includes(requiredKey)) {
        return next(); // Có quyền -> Cho qua (Vượt mọi cấp bậc)
      }

      return res.status(403).json({ 
        error: `Bạn thiếu quyền: ${requiredKey} để thực hiện hành động này` 
      });
    } catch (error) {
      console.error('Lỗi RBAC:', error);
      res.status(500).json({ error: 'Lỗi hệ thống khi kiểm tra quyền' });
    }
  };
};