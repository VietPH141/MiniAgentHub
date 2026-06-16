import { getApiBase, getAuthHeaders, handleResponse } from './client';
import type { Group, CreateGroupInput } from '../types/group';

const API_BASE = getApiBase();

export async function getGroups() {
  const response = await fetch(`${API_BASE}/group`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Group[]>(response);
}

export async function createGroup(data: CreateGroupInput) {
  const response = await fetch(`${API_BASE}/group`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Group>(response);
}
