import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/password';
import * as userRepository from '../repositories/userRepository';
import { ApiError } from '../utils/apiError';
import type {
  AuthLoginInput,
  AuthSignUpInput,
  AuthResponse,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../types/auth';
import type { CreateUserInput } from '../types/user'; // Omit<CreateUserDto,'password'> & { passwordHash }

const JWT_SECRET: Secret = process.env.JWT_SECRET  || 'default-secret';
const JWT_EXPIRE          = process.env.JWT_EXPIRE  || '15m';
const REFRESH_SECRET      = process.env.REFRESH_SECRET || 'refresh-secret-key';
const REFRESH_EXPIRE      = process.env.REFRESH_EXPIRE || '7d';

// ─── Token generation ─────────────────────────────────────────────────────────

function generateTokens(user: { id: number; email: string }) {
  const accessPayload: AccessTokenPayload  = { sub: user.id.toString(), email: user.email };
  const refreshPayload: RefreshTokenPayload = { sub: user.id.toString() };

  return {
    accessToken: jwt.sign(accessPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE as SignOptions['expiresIn'],
    }),
    refreshToken: jwt.sign(refreshPayload, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRE as SignOptions['expiresIn'],
    }),
  };
}

// ─── Auth operations ──────────────────────────────────────────────────────────

export async function signUpUser(payload: AuthSignUpInput): Promise<AuthResponse> {
  const passwordHash = await hashPassword(payload.password);

  // Explicitly construct CreateUserInput (Repository boundary type).
  // This is where `password` disappears and `passwordHash` appears —
  // the transformation is visible and type-checked, not implicit.
  const repoInput: CreateUserInput = {
    email:     payload.email,
    fullName:  payload.fullName ?? null,
    passwordHash,
    // `password` is intentionally absent — CreateUserInput doesn't have it
  };

  const user = await userRepository.createUserEntity(repoInput);
  return buildAuthResponse(user, generateTokens(user));
}

export async function loginUser(payload: AuthLoginInput): Promise<AuthResponse> {
  const user = await userRepository.findUserByEmail(payload.email);

  if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
    throw new ApiError(401, 'Email hoặc mật khẩu không đúng');
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Tài khoản đã bị khóa');
  }

  return buildAuthResponse(user, generateTokens(user));
}

export async function refreshAccessToken(
  token: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
  const user = await userRepository.findUserById(Number(payload.sub));
  // findUserById uses findUniqueOrThrow — P2025 → 404 via errorMiddleware

  if (!user.isActive) throw new ApiError(403, 'Tài khoản đã bị khóa');
  return generateTokens(user);
}

// ─── Private ─────────────────────────────────────────────────────────────────

function buildAuthResponse(
  user: { id: number; email: string; fullName: string | null },
  tokens: { accessToken: string; refreshToken: string }
): AuthResponse {
  return {
    ...tokens,
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRE,
    user: { id: user.id, email: user.email, fullName: user.fullName },
  };
}