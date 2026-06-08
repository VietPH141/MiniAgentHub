export interface GetConversationsInput {
    ownerId: number;
    deletedAt: Date | null;
}

export interface CreateConversationInput {
    ownerId: number;
    title: string;
    modelConfig?: string | null;
    deletedAt: Date | null;
}

export interface UpdateConversationInput {
    title?: string;
    modelConfig?: string | null;
    deletedAt?: Date | null;
}

export interface DeleteConversationInput {
    id: number;
    permanent?: boolean; 
}