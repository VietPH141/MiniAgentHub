export interface CreateConversationInput {
  ownerId: number;
  title?: string | null;
  modelConfig?: string | null;
}

export interface UpdateConversationInput {
  title?: string | null;
  modelConfig?: string | null;
}

export interface ConversationResponse {
  id: number;
  ownerId: number;
  title: string | null;
  modelConfig: string | null;
  chatId: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}