import { randomUUID } from 'crypto'; // Node built-in — no extra dep
import * as conversationRepository from '../repositories/conversationRepository';
import { ApiError } from '../utils/apiError';
import type { CreateConversationInput, UpdateConversationInput } from '../types/conversation';

export async function getConversations(ownerId: number, isTrash: boolean) {
  return conversationRepository.findConversations(ownerId, isTrash);
}

export async function getConversationById(id: number) {
  const conv = await conversationRepository.findConversationById(id);
  if (!conv) throw new ApiError(404, 'Hội thoại không tồn tại');
  return conv;
}

export async function createConversation(data: CreateConversationInput) {
  return conversationRepository.createConversation({
    ...data,
    chatId: randomUUID(),
    sessionId: randomUUID(),
  });
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
  return conversationRepository.updateConversation(id, data);
}

export async function softDeleteConversation(id: number) {
  return conversationRepository.softDeleteConversation(id);
}

export async function restoreConversation(id: number) {
  return conversationRepository.restoreConversation(id);
}

export async function hardDeleteConversation(id: number) {
  return conversationRepository.hardDeleteConversation(id);
}