import { Request, Response } from 'express';
import * as authService from '../services/authService';
import type { AuthLoginInput, AuthSignUpInput } from '../types/auth';

export async function signup(req: Request, res: Response) {
  const { email, password, fullName } = req.body as AuthSignUpInput;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await authService.signUpUser({ email, password, fullName });
    return res.status(201).json(result);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });

  const result = await authService.refreshAccessToken(refreshToken);
  if (!result) return res.status(401).json({ error: 'Invalid refresh token' });

  res.json(result);
}

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
