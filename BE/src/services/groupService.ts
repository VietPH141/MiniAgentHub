import * as groupRepository from '../repositories/groupRepository';
import type { CreateGroupInput, UpdateGroupInput } from '../types/group';

export async function getGroups() {
  return groupRepository.findAllGroups();
}

export async function getGroupById(id: number) {
  return groupRepository.findGroupById(id);
}

export async function createGroup(data: CreateGroupInput) {
  return groupRepository.createGroup(data);
}

export async function updateGroup(id: number, data: UpdateGroupInput) {
  return groupRepository.updateGroup(id, data);
}

export async function deleteGroup(id: number) {
  return groupRepository.deleteGroup(id);
}

export async function addUserToGroup(userId: number, groupId: number) {
  return groupRepository.addUserToGroup(userId, groupId);
}

export async function removeUserFromGroup(userId: number, groupId: number) {
  return groupRepository.removeUserFromGroup(userId, groupId);
}
