import type { CreateUserData, Role, UpdateUserData, User } from '../types/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

async function handleResponse<T>(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || response.statusText || 'Lỗi không xác định';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function getUsers() {
  const response = await fetch(`${API_BASE}/users`);
  return handleResponse<User[]>(response);
}

export async function getRoles() {
  const response = await fetch(`${API_BASE}/roles`);
  return handleResponse<Role[]>(response);
}

export async function createUser(data: CreateUserData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function updateUser(id: string, data: UpdateUserData) {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || response.statusText || 'Lỗi không xác định';
    throw new Error(message);
  }
}
