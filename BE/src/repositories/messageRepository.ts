import { prisma } from '../config/prisma';
import type { GetMessageInput, CreateMessageInput, UpdateMessageInput } from '../types/message';

export async function getMessage(data: GetMessageInput) {
    return prisma.message.findMany({
        where: {
            conversationId: data.conversationId,
            deletedAt: data.deletedAt,
        },
        orderBy: { createdAt: 'asc' },
    });
}

export async function createMessage (data: CreateMessageInput) {
    return prisma.message.create({
        data: {
            conversationId: data.conversationId,
            role: data.role ?? 'USER',
            content: data.content,
            responseTime: data.responseTime,
            deletedAt: data.deletedAt,
        },
    });
}

export async function updateMessage(id: number, data: UpdateMessageInput) {
    const payload: any = {};
    if (data.role) payload.role = data.role;
    if (data.content !== undefined) payload.content = data.content;
    if (data.responseTime !== undefined) payload.responseTime = data.responseTime;
    if (data.deletedAt !== undefined) payload.deletedAt = data.deletedAt;

    return prisma.message.update({
        where: { id },
        data: payload,
    });
}
