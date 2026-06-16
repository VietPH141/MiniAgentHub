import { Language, Theme } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  password: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  isActive?: boolean;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  theme?: Theme;
  language?: Language;
  isActive?: boolean;
}

export type CreateUserInput = Omit<CreateUserDto, 'password'> & {
  passwordHash: string;
};

export type UpdateUserInput = Omit<UpdateUserDto, 'password'> & {
  passwordHash?: string;
};