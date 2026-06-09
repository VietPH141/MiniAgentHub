import { prisma } from '../config/prisma';
import { PermissionKey } from '../constants/permissions';

export async function getUserPermissions(userId: number): Promise<PermissionKey[]> {
  try {
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

    if (!user) return [];

    const permissions = user.userGroups.flatMap((ug: any) =>
      ug.group.groupPermissions.map((gp: any) => gp.permission.permissionKey as PermissionKey)
    ) as PermissionKey[];

    return [...new Set(permissions)]; // Remove duplicates
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
}

export async function hasPermission(userId: number, requiredKey: PermissionKey): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return permissions.includes(requiredKey);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

export async function hasAnyPermission(userId: number, requiredKeys: PermissionKey[]): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return requiredKeys.some(key => permissions.includes(key));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

export async function hasAllPermissions(userId: number, requiredKeys: PermissionKey[]): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(userId);
    return requiredKeys.every(key => permissions.includes(key));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}
