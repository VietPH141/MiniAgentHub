import { prisma } from '../config/prisma';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function findAllPermissions() {
  return prisma.permission.findMany({ orderBy: { id: 'asc' } });
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.create({ data: { groupId, permissionId } });
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.delete({ where: { groupId_permissionId: { groupId, permissionId } } });
}
