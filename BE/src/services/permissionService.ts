import * as permissionRepository from '../repositories/permissionRepository';
import { ApiError } from '../utils/apiError';
import { prisma } from '../config/prisma';

export async function getPermissions() {
  return permissionRepository.findAllPermissions();
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return permissionRepository.attachPermissionToGroup(groupId, permissionId);
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return permissionRepository.detachPermissionFromGroup(groupId, permissionId);
}

export interface SyncResult {
  added: number;
  removed: number;
  unchanged: number;
}

interface PermissionIdRow {
  id: number;
}

export async function syncGroupPermissions(
  groupId: number,
  incomingIds: number[]
): Promise<SyncResult> {
  await prisma.group.findUniqueOrThrow({ where: { id: groupId } });

  const currentIds = await permissionRepository.findPermissionIdsByGroup(groupId);

  const currentSet  = new Set<number>(currentIds);
  const incomingSet = new Set<number>(incomingIds);

  const toAdd     = incomingIds.filter((id: number) => !currentSet.has(id));
  const toRemove  = currentIds.filter((id: number) => !incomingSet.has(id));
  const unchanged = currentIds.filter((id: number) => incomingSet.has(id)).length;

  if (toAdd.length === 0 && toRemove.length === 0) {
    return { added: 0, removed: 0, unchanged };
  }

  if (toAdd.length > 0) {
    const existing: PermissionIdRow[] = await prisma.permission.findMany({
      where: { id: { in: toAdd } },
      select: { id: true },
    });

    if (existing.length !== toAdd.length) {
      const existingSet = new Set<number>(existing.map((p: PermissionIdRow) => p.id));
      const unknownIds  = toAdd.filter((id: number) => !existingSet.has(id));
      throw new ApiError(400, `permissionIds không hợp lệ: [${unknownIds.join(', ')}]`);
    }
  }

  const { added, removed } = await permissionRepository.syncGroupPermissions({
    groupId,
    toAdd,
    toRemove,
  });

  return { added, removed, unchanged };
}