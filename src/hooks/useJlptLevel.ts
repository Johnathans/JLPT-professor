import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { JlptLevel } from '@/types/jlpt';

export function useJlptLevel() {
  const [level, setLevel] = useState<JlptLevel>('N5');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getJlptLevel() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.jlpt_level) {
        setLevel(user.user_metadata.jlpt_level);
      }
    }
    getJlptLevel();
  }, [supabase]);

  return { level };
}
