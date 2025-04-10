'use client';

import { useState, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../hiragana-match.module.css';
import HiraganaMatchGame from './HiraganaMatchGame';

function HiraganaMatchGameWithParams() {
  const searchParams = useSearchParams();
  const characters = searchParams.get('characters')?.split(',') || ['あ'];
  const [score, setScore] = useState(0);

  // Convert characters to groups
  const groups = Array.from(new Set(characters.map(char => {
    // Find which group this character belongs to
    if (char.match(/^[あいうえお]$/)) return 'a';
    if (char.match(/^[かきくけこ]$/)) return 'ka';
    if (char.match(/^[さしすせそ]$/)) return 'sa';
    if (char.match(/^[たちつてと]$/)) return 'ta';
    if (char.match(/^[なにぬねの]$/)) return 'na';
    if (char.match(/^[はひふへほ]$/)) return 'ha';
    if (char.match(/^[まみむめも]$/)) return 'ma';
    if (char.match(/^[やゆよ]$/)) return 'ya';
    if (char.match(/^[らりるれろ]$/)) return 'ra';
    if (char.match(/^[わをん]$/)) return 'wa';
    return 'a'; // Default to 'a' group if not found
  })));

  return (
    <HiraganaMatchGame 
      groups={groups}
      characterCount={characters.length}
      onScoreUpdate={setScore}
    />
  );
}

export default function HiraganaMatchPlayPage() {
  return (
    <div className={styles.container}>
      <Link href="/resources/hiragana-match" className={styles.backLink}>
        <ArrowLeft size={20} />
        Back to Settings
      </Link>
      <Suspense fallback={<div>Loading game...</div>}>
        <HiraganaMatchGameWithParams />
      </Suspense>
    </div>
  );
}
