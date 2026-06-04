import { prisma} from '../db';
import type {GetConversationsInput, CreateConversationInput, UpdateConversationInput} from '../types/conversation';

export async function findConversations(data: GetConversationsInput) {
    return prisma.conversation.findMany({
        where: {
            ownerId: data.ownerId,
            deletedAt: data.deletedAt,
        },
        orderBy: { updatedAt: 'desc' },
    });
}

export async function createConversation (data: CreateConversationInput) {
    return prisma.conversation.create({
        data: {
            ownerId: data.ownerId,
            title: data.title,
            modelConfig: data.modelConfig,
            deletedAt: data.deletedAt,
        },
    });
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
    return prisma.conversation.update({
        where: { id },
        data,
    });
}