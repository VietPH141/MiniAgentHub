import { prisma } from '../config/prisma';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

export async function findAllUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, fullName: true, phoneNumber: true, address: true, theme: true, language: true, isActive: true, createdAt: true, updatedAt: true },
  });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true, phoneNumber: true, address: true, theme: true, language: true, isActive: true, userGroups: true, createdAt: true, updatedAt: true },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUserEntity(data: CreateUserInput & { passwordHash: string }) {
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      isActive: data.isActive,
    },
  });
}

export async function updateUserEntity(id: number, data: UpdateUserInput) {
  const payload: any = {};
  if (data.email) payload.email = data.email;
  if (data.fullName !== undefined) payload.fullName = data.fullName;
  if (typeof data.isActive === 'boolean') payload.isActive = data.isActive;
  if (data.password) payload.passwordHash = data.password;

  return prisma.user.update({
    where: { id },
    data: payload,
  });
}

export async function deleteUserEntity(id: number) {
  return prisma.user.delete({ where: { id } });
}