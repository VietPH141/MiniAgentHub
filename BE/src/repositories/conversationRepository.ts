import { prisma } from '../config/prisma';
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

export async function createConversation(
  data: CreateConversationInput & { chatId: string; sessionId: string }
) {
  return prisma.conversation.create({
    data: {
      ownerId: data.ownerId,
      title: data.title ?? null,
      modelConfig: data.modelConfig ?? null,
      chatId: data.chatId,
      sessionId: data.sessionId,
      deletedAt: null, // always null on creation
    },
  });
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
  return prisma.conversation.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.modelConfig !== undefined && { modelConfig: data.modelConfig }),
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