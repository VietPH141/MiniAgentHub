import { prisma } from '../db';
import type { CreateGroupInput, UpdateGroupInput } from '../types/group';

export async function findAllGroups() {
  return prisma.group.findMany({
    orderBy: { id: 'asc' },
    include: { userGroups: true, groupPermissions: true },
  });
}

export async function findGroupById(id: number) {
  return prisma.group.findUnique({
    where: { id },
    include: { userGroups: true, groupPermissions: true },
  });
}

export async function createGroup(data: CreateGroupInput) {
  return prisma.group.create({ data });
}

export async function updateGroup(id: number, data: UpdateGroupInput) {
  return prisma.group.update({ where: { id }, data });
}

export async function deleteGroup(id: number) {
  return prisma.group.delete({ where: { id } });
}

export async function addUserToGroup(userId: number, groupId: number) {
  return prisma.userGroup.create({ data: { userId, groupId } });
}

export async function removeUserFromGroup(userId: number, groupId: number) {
  return prisma.userGroup.delete({ where: { userId_groupId: { userId, groupId } } });
}
