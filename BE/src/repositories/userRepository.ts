import { prisma } from '../config/prisma';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  address: true,
  theme: true,
  language: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function findAllUsers() {
  return prisma.user.findMany({ select: USER_PUBLIC_SELECT });
}

export async function findUserById(id: number) {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      ...USER_PUBLIC_SELECT,
      userGroups: {
        select: { group: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function findUserByEmail(email: string) {

  return prisma.user.findUnique({ where: { email } });
}

export async function createUserEntity(data: CreateUserInput) {

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      isActive: data.isActive ?? true,
    },
    select: USER_PUBLIC_SELECT,
  });
}

export async function updateUserEntity(id: number, data: UpdateUserInput) {
  const payload: Partial<typeof data> = {};

  if (data.email       !== undefined) payload.email       = data.email;
  if (data.fullName    !== undefined) payload.fullName    = data.fullName;
  if (data.phoneNumber !== undefined) payload.phoneNumber = data.phoneNumber;
  if (data.address     !== undefined) payload.address     = data.address;
  if (data.theme       !== undefined) payload.theme       = data.theme;
  if (data.language    !== undefined) payload.language    = data.language;
  if (data.isActive    !== undefined) payload.isActive    = data.isActive;
  if (data.passwordHash !== undefined) payload.passwordHash = data.passwordHash;

  return prisma.user.update({
    where: { id },
    data: payload,
    select: USER_PUBLIC_SELECT,
  });
}

export async function deleteUserEntity(id: number) {
  return prisma.user.delete({ where: { id } });
}