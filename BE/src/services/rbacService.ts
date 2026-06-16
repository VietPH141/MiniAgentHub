import { prisma } from '../config/prisma';
import { Prisma } from '@prisma/client';
import { PermissionKey } from '../constants/permissions';

const userWithPermissionsArgs = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    isActive: true,
    userGroups: {
      select: {
        group: {
          select: {
            groupPermissions: {
              select: {
                permission: {
                  select: { permissionKey: true },
                },
              },
            },
          },
        },
      },
    },
  },
});

type UserWithPermissions = Prisma.UserGetPayload<typeof userWithPermissionsArgs>;
type UserGroupWithPermissions = UserWithPermissions['userGroups'][number];
type GroupPermissionWithKey   = UserGroupWithPermissions['group']['groupPermissions'][number];

function flattenPermissions(user: UserWithPermissions): PermissionKey[] {
  const keys = user.userGroups.flatMap((ug: UserGroupWithPermissions) =>
    ug.group.groupPermissions.map(
      (gp: GroupPermissionWithKey) => gp.permission.permissionKey as PermissionKey
    )
  );
  return [...new Set(keys)]; // deduplicate
}

export async function getFlattenedPermissions(userId: number): Promise<PermissionKey[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    ...userWithPermissionsArgs,
  });

  if (!user) return [];
  return flattenPermissions(user);
}

export async function getUserPermissions(userId: number): Promise<PermissionKey[]> {
  return getFlattenedPermissions(userId);
}

export async function hasPermission(
  userId: number,
  requiredKey: PermissionKey
): Promise<boolean> {
  const permissions = await getFlattenedPermissions(userId);
  return permissions.includes(requiredKey);
}

export async function hasAnyPermission(
  userId: number,
  requiredKeys: PermissionKey[]
): Promise<boolean> {
  const permissions = await getFlattenedPermissions(userId);
  return requiredKeys.some(key => permissions.includes(key));
}

export async function hasAllPermissions(
  userId: number,
  requiredKeys: PermissionKey[]
): Promise<boolean> {
  const permissions = await getFlattenedPermissions(userId);
  return requiredKeys.every(key => permissions.includes(key));
}