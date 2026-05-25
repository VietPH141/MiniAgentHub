import { randomBytes, pbkdf2Sync } from 'crypto';
import { prisma } from '../db';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return `${salt}$${derived}`;
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      isFirstLogin: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      isFirstLogin: true,
      role: true,
      groups: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(data: CreateUserInput) {
  const passwordHash = hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName ?? null,
      isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      role: { connect: { id: data.roleId } },
    },
    include: { role: true },
  });
}

export async function updateUser(id: string, payload: UpdateUserInput) {
  const data: any = {};

  if (payload.email) data.email = payload.email;
  if (payload.fullName !== undefined) data.fullName = payload.fullName;
  if (typeof payload.isActive === 'boolean') data.isActive = payload.isActive;
  if (payload.password) data.passwordHash = hashPassword(payload.password);
  if (payload.roleId) data.role = { connect: { id: payload.roleId } };

  return prisma.user.update({
    where: { id },
    data,
    include: { role: true },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
