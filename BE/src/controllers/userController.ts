import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import type { CreateUserDto, UpdateUserDto } from '../types/user'; // ← Dto, not Input

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAllUsers();
    res.json({ code: 200, message: 'Thành công', data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    res.json({ code: 200, message: 'Thành công', data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto: CreateUserDto = {
      email:       req.body.email,
      password:    req.body.password,
      fullName:    req.body.fullName  ?? null,
      phoneNumber: req.body.phoneNumber ?? null,
      address:     req.body.address   ?? null,
      isActive:    req.body.isActive,
    };
    const newUser = await userService.createUser(dto);
    res.status(201).json({ code: 201, message: 'Tạo người dùng thành công', data: newUser });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto: UpdateUserDto = {
      email:       req.body.email,
      password:    req.body.password,
      fullName:    req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      address:     req.body.address,
      theme:       req.body.theme,
      language:    req.body.language,
      isActive:    req.body.isActive,
    };
    const updated = await userService.updateUser(Number(req.params.id), dto);
    res.json({ code: 200, message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ code: 200, message: 'Xóa người dùng thành công', data: null });
  } catch (error) {
    next(error);
  }
}