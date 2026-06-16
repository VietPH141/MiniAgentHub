export interface AuthSignUpInput {
  email: string;
  password: string;
  fullName?: string | null;
}

export interface AuthLoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: number;
    email: string;
    fullName: string | null;
  };
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload {
  sub: string;
}

export interface AuthUser {
  id: number;
  email: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}