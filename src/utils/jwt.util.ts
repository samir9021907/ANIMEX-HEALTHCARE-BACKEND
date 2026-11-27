import crypto from 'crypto';
import { ENV } from '../config/env.config';

export const generateToken = (payload: object): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 3600 })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ENV.JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token: string): any => {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', ENV.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};
