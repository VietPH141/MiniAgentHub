export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface GetMessageInput {
    conversationId: number;
    deletedAt: Date | null;
}

export interface CreateMessageInput {
    conversationId: number;
    role?: MessageRole;
    content: string;
    responseTime?: number | null;
    deletedAt?: Date | null;
}

export interface UpdateMessageInput {
    role?: MessageRole;
    content?: string;
    responseTime?: number | null;
    deletedAt?: Date | null;
}
