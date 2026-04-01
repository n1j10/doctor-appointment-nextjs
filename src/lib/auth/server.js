import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
  verifySessionToken,
} from '@/lib/auth/session';

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;
  return verifySessionToken(token);
}



export async function getCurrentUser() {
  const payload = await getSessionPayload();
  const userId = payload?.sub;

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

export async function createSessionResponse(response, user) {
  const token = await createSessionToken(user);
  response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  return response;
}

export function clearSessionResponse(response) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
