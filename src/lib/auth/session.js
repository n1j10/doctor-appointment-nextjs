import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'bookwell_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;





export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function createSessionToken(user) {
  return new SignJWT({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}


function getSessionSecret() {
  return process.env.SESSION_SECRET || 'change-me-in-production-session-secret';
}

function getSecretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}
