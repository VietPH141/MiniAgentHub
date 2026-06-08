import * as conversationRepository from '../repositories/conversationRepository';
import type { CreateConversationInput, UpdateConversationInput } from '../types/conversation';
import { ApiError } from '../utils/apiError';

export async function getConversations(ownerId: number, isTrash: boolean) {
  return conversationRepository.findConversations(ownerId, isTrash);
}

export async function getConversationById(id: number) {
  return conversationRepository.findConversationById(id);
}

export async function createConversation(data: CreateConversationInput) {
  return conversationRepository.createConversation(data);
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
  return conversationRepository.updateConversation(id, data);
}

export async function restoreConversation(id: number) {
  return conversationRepository.restoreConversation(id);
}

export async function deleteConversation(id: number, permanent: boolean) {
  if (permanent) {
    return conversationRepository.hardDeleteConversation(id);
  }
  return conversationRepository.softDeleteConversation(id);
}