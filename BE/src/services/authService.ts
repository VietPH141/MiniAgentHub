import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../db';
import type { AuthLoginInput, AuthSignUpInput, AuthResponse , AccessTokenPayload , RefreshTokenPayload } from '../types/auth';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';

const JWT_SECRET_KEY: Secret = JWT_SECRET;

const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';
const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE || '7d';

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

function generateTokens(user: { id: number; email: string }) {
  const accessPayload: AccessTokenPayload = {
    sub: user.id.toString(),
    email: user.email,
  };

  const refreshPayload: RefreshTokenPayload = {
    sub: user.id.toString(),
  };

  const accessToken = jwt.sign(
    accessPayload,
    JWT_SECRET_KEY,
    jwtSignOptions
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_EXPIRE as SignOptions['expiresIn'],
    }
  );

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(token: string) {
  try {
    const payload = jwt.verify(
      token,
      REFRESH_SECRET
    ) as RefreshTokenPayload;

    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) return null;

    return generateTokens(user);
  } catch (e) {
    return null;
  }
}

export async function signUpUser(payload: AuthSignUpInput): Promise<AuthResponse> {
  const passwordHash = hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      passwordHash,
      fullName: payload.fullName ?? null,
    },
  });

  const tokens = generateTokens(user);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRE,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  };
}

export async function loginUser(payload: AuthLoginInput): Promise<AuthResponse | null> {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) return null;
  if (!verifyPassword(payload.password, user.passwordHash)) return null;
  if (!user.isActive) return null;

  const { accessToken, refreshToken } = generateTokens(user);
  return {
    accessToken,
    refreshToken, // Trả về thêm refresh token
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRE,
    user: { id: user.id, email: user.email, fullName: user.fullName },
  };
}
