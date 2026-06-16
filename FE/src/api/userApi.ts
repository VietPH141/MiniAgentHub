import type { CreateUserData, Role, UpdateUserData, User } from '../types/user';
import { getApiBase, getAuthHeaders, handleResponse } from './client';

const API_BASE = getApiBase();

export async function getUsers() {
  const response = await fetch(`${API_BASE}/user`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<User[]>(response);
}

export async function getRoles() {
  const response = await fetch(`${API_BASE}/role`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Role[]>(response);
}

export async function createUser(data: CreateUserData) {
  const response = await fetch(`${API_BASE}/user`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function updateUser(id: string, data: UpdateUserData) {
  const response = await fetch(`${API_BASE}/user/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE}/user/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || response.statusText || 'Lỗi không xác định';
    throw new Error(message);
  }
}
