"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = void 0;
const db_1 = require("../db");
const requirePermission = (requiredKey) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            // Tìm user cùng tất cả các quyền mà họ có thông qua các Group
            const user = await db_1.prisma.user.findUnique({
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
            const userPermissions = user.userGroups.flatMap((ug) => ug.group.groupPermissions.map((gp) => gp.permission.permissionKey));
            // KIỂM TRA QUYỀN
            if (userPermissions.includes(requiredKey)) {
                return next(); // Có quyền -> Cho qua (Vượt mọi cấp bậc)
            }
            return res.status(403).json({
                error: `Bạn thiếu quyền: ${requiredKey} để thực hiện hành động này`
            });
        }
        catch (error) {
            console.error('Lỗi RBAC:', error);
            res.status(500).json({ error: 'Lỗi hệ thống khi kiểm tra quyền' });
        }
    };
};
exports.requirePermission = requirePermission;
