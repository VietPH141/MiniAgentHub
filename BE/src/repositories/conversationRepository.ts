import { prisma } from '../db';
import type { CreateConversationInput, UpdateConversationInput } from '../types/conversation';

export async function findConversations(ownerId: number, isDeleted: boolean) {
  return prisma.conversation.findMany({
    where: {
      ownerId,
      deletedAt: isDeleted ? { not: null } : null,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function findConversationById(id: number) {
  return prisma.conversation.findUnique({
    where: { id },
  });
}

export async function createConversation(data: CreateConversationInput) {
  return prisma.conversation.create({
    data: {
      ownerId: data.ownerId,
      title: data.title,
      modelConfig: data.modelConfig,
      deletedAt: null, // Luôn null khi tạo mới
    },
  });
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
  return prisma.conversation.update({
    where: { id },
    data: {
      title: data.title,
      modelConfig: data.modelConfig,
    },
  });
}

export async function softDeleteConversation(id: number) {
  return prisma.conversation.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreConversation(id: number) {
  return prisma.conversation.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function hardDeleteConversation(id: number) {
  return prisma.conversation.delete({
    where: { id },
  });
}