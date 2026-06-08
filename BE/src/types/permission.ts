export interface CreatePermissionInput {
  permissionKey: string;
  entity?: string | null;
  description?: string | null;
}

export interface UpdatePermissionInput {
  permissionKey?: string;
  entity?: string | null;
  description?: string | null;
}
