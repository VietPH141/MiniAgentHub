import { Request, Response } from 'express';
import * as authService from '../services/authService';
import type { AuthLoginInput } from '../types/auth';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as AuthLoginInput;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const result = await authService.loginUser({ email, password });
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json(result);
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(400).json({ error: 'refreshToken is required' });
  }

  const result = await authService.refreshToken(refreshToken);
  if (!result) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  res.json(result);
}

export async function logout(req: Request, res: Response) {
  const { userId } = req.body;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId is required' });
  }

  await authService.logoutUser(userId);
  res.status(204).end();
}
