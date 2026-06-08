import * as permissionRepository from '../repositories/permissionRepository';
import type { CreatePermissionInput, UpdatePermissionInput } from '../types/permission';

export async function getPermissions() {
  return permissionRepository.findAllPermissions();
}

export async function getPermissionById(id: number) {
  return permissionRepository.findPermissionById(id);
}

export async function createPermission(data: CreatePermissionInput) {
  return permissionRepository.createPermission(data);
}

export async function updatePermission(id: number, data: UpdatePermissionInput) {
  return permissionRepository.updatePermission(id, data);
}

export async function deletePermission(id: number) {
  return permissionRepository.deletePermission(id);
}

export async function attachPermissionToGroup(groupId: number, permissionId: number) {
  return permissionRepository.attachPermissionToGroup(groupId, permissionId);
}

export async function detachPermissionFromGroup(groupId: number, permissionId: number) {
  return permissionRepository.detachPermissionFromGroup(groupId, permissionId);
}
