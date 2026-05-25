import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, fullName, roleId, isActive } = req.body;
  if (!email || !password || !roleId) {
    return res.status(400).json({ error: 'email, password and roleId are required' });
  }

  const payload: CreateUserInput = {
    email,
    password,
    fullName: fullName ?? null,
    roleId,
    isActive,
  };

  try {
    const newUser = await userService.createUser(payload);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: formatErrorMessage(error) || 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { email, password, fullName, roleId, isActive } = req.body;

  const payload: UpdateUserInput = {
    email,
    password,
    fullName: fullName ?? undefined,
    roleId,
    isActive,
  };

  try {
    const updated = await userService.updateUser(id, payload);
    res.json(updated);
  } catch (error: any) {
    console.error(error);
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: formatErrorMessage(error) || 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await userService.deleteUser(id);
    res.status(204).end();
  } catch (error: any) {
    console.error(error);
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: formatErrorMessage(error) || 'Failed to delete user' });
  }
}
