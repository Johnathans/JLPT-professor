"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ADMIN_EMAIL = 'smithjohnathanr@gmail.com';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace('/');
      }
    };

    checkAuth();
  }, [router, supabase]);

  return <>{children}</>;
}
