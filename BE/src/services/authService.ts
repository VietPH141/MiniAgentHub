import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../db';
import type { AuthLoginInput } from '../types/auth';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? 'default-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE ?? '30d';
const JWT_SECRET_KEY: Secret = JWT_SECRET;

const jwtSignOptions: SignOptions = {
  expiresIn: JWT_EXPIRE as unknown as SignOptions['expiresIn'],
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derived = pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  return `${salt}$${derived}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, hashed] = passwordHash.split('$');
  if (!salt || !hashed) return false;
  const derived = pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
  const hashedBuffer = Buffer.from(hashed, 'hex');
  const derivedBuffer = Buffer.from(derived, 'hex');
  if (hashedBuffer.length !== derivedBuffer.length) return false;
  return timingSafeEqual(hashedBuffer, derivedBuffer);
}

function generateAccessToken(user: User) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
    },
    JWT_SECRET_KEY,
    jwtSignOptions
  );
}

function generateRefreshToken() {
  return randomBytes(64).toString('hex');
}

export async function loginUser(payload: AuthLoginInput) {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) return null;
  if (!verifyPassword(payload.password, user.passwordHash)) return null;
  if (!user.isActive) return null;

  const refreshToken = generateRefreshToken();
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
    tokenType: 'Bearer' as const,
    expiresIn: JWT_EXPIRE,
  };
}

export async function refreshToken(oldRefreshToken: string) {
  const user = await prisma.user.findFirst({ where: { refreshToken: oldRefreshToken } });
  if (!user) return null;
  if (!user.isActive) return null;

  const refreshToken = generateRefreshToken();
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
    tokenType: 'Bearer' as const,
    expiresIn: JWT_EXPIRE,
  };
}

export async function logoutUser(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}
