import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import type { AuthLoginInput, AuthSignUpInput } from '../types/auth';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: AuthSignUpInput = {
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName ?? null,
    };
    const result = await authService.signUpUser(payload);
    res.status(201).json({ code: 201, message: 'Đăng ký thành công', data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const payload: AuthLoginInput = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await authService.loginUser(payload);
    res.json({ code: 200, message: 'Đăng nhập thành công', data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.refreshAccessToken(req.body.refreshToken);
    res.json({ code: 200, message: 'Token đã được làm mới', data: result });
  } catch (error) {
    next(error);
  }
}