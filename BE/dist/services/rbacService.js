"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPermissions = getUserPermissions;
exports.hasPermission = hasPermission;
exports.hasAnyPermission = hasAnyPermission;
exports.hasAllPermissions = hasAllPermissions;
const db_1 = require("../db");
async function getUserPermissions(userId) {
    try {
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
        if (!user)
            return [];
        const permissions = user.userGroups.flatMap((ug) => ug.group.groupPermissions.map((gp) => gp.permission.permissionKey));
        return [...new Set(permissions)]; // Remove duplicates
    }
    catch (error) {
        console.error('Error fetching user permissions:', error);
        throw error;
    }
}
async function hasPermission(userId, requiredKey) {
    try {
        const permissions = await getUserPermissions(userId);
        return permissions.includes(requiredKey);
    }
    catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
}
async function hasAnyPermission(userId, requiredKeys) {
    try {
        const permissions = await getUserPermissions(userId);
        return requiredKeys.some(key => permissions.includes(key));
    }
    catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
}
async function hasAllPermissions(userId, requiredKeys) {
    try {
        const permissions = await getUserPermissions(userId);
        return requiredKeys.every(key => permissions.includes(key));
    }
    catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
}
