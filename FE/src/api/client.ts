const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export function getApiBase() {
  return API_BASE;
}

export function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function handleResponse<T>(response: Response) {
  if (response.status === 204) return {} as T; // Xử lý cho delete
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error || response.statusText || 'Lỗi không xác định';
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}
