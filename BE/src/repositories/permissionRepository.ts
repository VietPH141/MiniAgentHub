import { prisma } from '../config/prisma';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function findAllPermissions() {
  return prisma.permission.findMany({ orderBy: { id: 'asc' } });
}

export async function findPermissionById(id: number) {
  return prisma.permission.findUnique({ where: { id } });
}

export async function createPermission(data: CreatePermissionInput) {
  return prisma.permission.create({ data });
}

export async function updatePermission(id: number, data: UpdatePermissionInput) {
  return prisma.permission.update({ where: { id }, data });
}

export async function deletePermission(id: number) {
  return prisma.permission.delete({ where: { id } });
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.create({ data: { groupId, permissionId } });
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.delete({ where: { groupId_permissionId: { groupId, permissionId } } });
}
