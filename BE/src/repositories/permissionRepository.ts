import { prisma } from '../config/prisma';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function findAllPermissions() {
  return prisma.permission.findMany({ orderBy: { id: 'asc' } });
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.create({ data: { groupId, permissionId } });
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return prisma.groupPermission.delete({
    where: { groupId_permissionId: { groupId, permissionId } },
  });
}

interface GroupPermissionRow {
  permissionId: number;
}

export async function findPermissionIdsByGroup(groupId: number): Promise<number[]> {
  const rows: GroupPermissionRow[] = await prisma.groupPermission.findMany({
    where: { groupId },
    select: { permissionId: true },
  });
  return rows.map((r: GroupPermissionRow) => r.permissionId);
}

export interface SyncGroupPermissionsInput {
  groupId: number;
  toAdd: number[];
  toRemove: number[];
}

export async function syncGroupPermissions({
  groupId,
  toAdd,
  toRemove,
}: SyncGroupPermissionsInput): Promise<{ added: number; removed: number }> {
  const [deleteResult, createResult] = await prisma.$transaction([
    prisma.groupPermission.deleteMany({
      where: { groupId, permissionId: { in: toRemove } },
    }),
    prisma.groupPermission.createMany({
      data: toAdd.map((permissionId: number) => ({ groupId, permissionId })),
      skipDuplicates: true,
    }),
  ]);

  return { added: createResult.count, removed: deleteResult.count };
}