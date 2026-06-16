import { hashPassword } from '../utils/password';
import * as userRepository from '../repositories/userRepository';
import type { CreateUserDto, UpdateUserDto, CreateUserInput, UpdateUserInput } from '../types/user';

export async function getAllUsers() {
  return userRepository.findAllUsers();
}

export async function getUserById(id: number) {
  return userRepository.findUserById(id);
}

export async function createUser(dto: CreateUserDto) {
  const passwordHash = await hashPassword(dto.password);

  const input: CreateUserInput = {
    email:        dto.email,
    fullName:     dto.fullName   ?? null,
    phoneNumber:  dto.phoneNumber ?? null,
    address:      dto.address    ?? null,
    isActive:     dto.isActive,
    passwordHash,
  };

  return userRepository.createUserEntity(input);
}

export async function updateUser(id: number, dto: UpdateUserDto) {
  const input: UpdateUserInput = {
    email:        dto.email,
    fullName:     dto.fullName,
    phoneNumber:  dto.phoneNumber,
    address:      dto.address,
    theme:        dto.theme,
    language:     dto.language,
    isActive:     dto.isActive,
    passwordHash: dto.password
      ? await hashPassword(dto.password)
      : undefined,
  };

  return userRepository.updateUserEntity(id, input);
}

export async function deleteUser(id: number) {
  return userRepository.deleteUserEntity(id);
}