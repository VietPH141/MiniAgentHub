import * as messageRepository from '../repositories/messageRepository';
import type { GetMessageInput, CreateMessageInput, UpdateMessageInput} from '../types/message';

export async function getMessage(data: GetMessageInput) {
    return messageRepository.getMessage(data);
}

export async function createMessage(data: CreateMessageInput) {
    return messageRepository.createMessage(data);
}

export async function updateMessage(id: number, data: UpdateMessageInput) {
    return messageRepository.updateMessage(id, data);
}