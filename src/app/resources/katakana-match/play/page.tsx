'use client';

import { useState, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../katakana-match.module.css';
import KatakanaMatchGame, { KATAKANA_SETS } from './KatakanaMatchGame';

function KatakanaMatchGameWithParams() {
  const searchParams = useSearchParams();
  const characters = searchParams.get('characters')?.split(',') || ['ア'];

  // Convert characters to groups
  const groups = Array.from(new Set(characters.map(char => {
    // Find which group this character belongs to
    for (const [group, chars] of Object.entries(KATAKANA_SETS)) {
      if (chars.some(c => c.katakana === char)) {
        return group;
      }
    }
    return 'a'; // Default to 'a' group if not found
  })));

  const [score, setScore] = useState(0);

  return (
    <KatakanaMatchGame 
      groups={groups}
      characterCount={characters.length}
      onScoreUpdate={setScore}
    />
  );
}

export default function KatakanaMatchPlayPage() {
  return (
    <div className={styles.container}>
      <Link href="/resources/katakana-match" className={styles.backLink}>
        <ArrowLeft size={20} />
        Back to Settings
      </Link>
      <Suspense fallback={<div>Loading game...</div>}>
        <KatakanaMatchGameWithParams />
      </Suspense>
    </div>
  );
}
