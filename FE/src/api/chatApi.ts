import { getApiBase, getAuthHeaders } from './client';

const API_BASE = getApiBase();

export const createConversation = async (title = 'New conversation') => {
  const response = await fetch(`${API_BASE}/chat/conversation`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'Không thể tạo cuộc hội thoại');
  }

  return response.json();
};

export const sendChatRequest = async (conversationId: number, content: string) => {
  const response = await fetch(`${API_BASE}/chat/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ conversationId, content }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'Không thể gửi tin nhắn');
  }

  return response;
};