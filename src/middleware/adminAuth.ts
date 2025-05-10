import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const ADMIN_EMAIL = 'smithjohnathanr@gmail.com';

export async function adminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.email !== ADMIN_EMAIL) {
    return {
      authorized: false,
      redirect: '/login'
    };
  }

  return {
    authorized: true
  };
}
