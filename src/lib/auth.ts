import { prisma } from './db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user-id')?.value;
    
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function createUser(email: string, name?: string) {
  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('user-id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('user-id');
}
