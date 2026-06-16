import { getApiBase, getAuthHeaders, handleResponse } from './client';

const API_BASE = getApiBase();

export async function getConversations(isTrash = false) {
  const response = await fetch(`${API_BASE}/conversation?isTrash=${isTrash}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<any[]>(response);
}

export async function deleteConversation(id: number, permanent = false) {
  const response = await fetch(`${API_BASE}/conversation/${id}?permanent=${permanent}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}