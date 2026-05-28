import type { AuthResponse } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

async function handleResponse<T>(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || response.statusText || 'Lỗi không xác định';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function signup(email: string, password: string, fullName?: string) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export function saveToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function removeToken() {
  localStorage.removeItem('accessToken');
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}
