import * as permissionRepository from '../repositories/permissionRepository';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function getPermissions() {
  return permissionRepository.findAllPermissions();
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return permissionRepository.attachPermissionToGroup(groupId, permissionId);
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return permissionRepository.detachPermissionFromGroup(groupId, permissionId);
}
