import { randomBytes, pbkdf2Sync } from 'crypto';
import * as userRepository from '../repositories/userRepository';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return `${salt}$${derived}`;
}

export async function getAllUsers() {
  return userRepository.findAllUsers();
}

export async function getUserById(id: number) {
  return userRepository.findUserById(id);
}

export async function createUser(data: CreateUserInput) {
  const passwordHash = hashPassword(data.password);
  return userRepository.createUserEntity({ ...data, passwordHash });
}

export async function updateUser(id: number, payload: UpdateUserInput) {
  if (payload.password) payload.password = hashPassword(payload.password);
  return userRepository.updateUserEntity(id, payload);
}

export async function deleteUser(id: number) {
  return userRepository.deleteUserEntity(id);
}