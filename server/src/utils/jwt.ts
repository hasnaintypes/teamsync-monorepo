import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';
import { Response } from 'express';

export interface JWTPayload {
  id: string;
  email: string;
  role?: string;
}

export const generateJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.SESSION_SECRET, { 
    expiresIn: '24h',
    issuer: 'team-sync-app',
    audience: 'team-sync-users'
  });
};

export const verifyJWT = (token: string): JWTPayload => {
  return jwt.verify(token, config.SESSION_SECRET, {
    issuer: 'team-sync-app',
    audience: 'team-sync-users'
  }) as JWTPayload;
};

export const setAuthCookies = (res: Response, user: JWTPayload): void => {
  const token = generateJWT(user);
  
  // Set JWT cookie as fallback
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/'
  });

  // Set a non-httpOnly cookie for frontend access (encrypted payload only)
  res.cookie('auth_user', JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role
  }), {
    httpOnly: false,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });
};

export const clearAuthCookies = (res: Response): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  } as const;

  res.clearCookie('auth_token', cookieOptions);
  res.clearCookie('auth_user', { ...cookieOptions, httpOnly: false });
};
