import * as conversationRepository from '../repositories/conversationRepository';
import type {GetConversationsInput, CreateConversationInput, UpdateConversationInput} from '../types/conversation';

export async function getConversations(data: GetConversationsInput) {
    return conversationRepository.findConversations(data);
}

export async function createConversation(data: CreateConversationInput) {
    return conversationRepository.createConversation(data);
}

export async function updateConversation(id: number, data: UpdateConversationInput) {
    return conversationRepository.updateConversation(id, data);
}