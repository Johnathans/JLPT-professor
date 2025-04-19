'use client';

import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../kanji-match.module.css';

// Loading component while the game loads
function LoadingGame() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/resources/kanji-match" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Game Menu
        </Link>
      </div>
      <div className={styles.gameContent}>
        <div className={styles.question}>
          <h2 className={styles.meaning}>Loading game...</h2>
        </div>
      </div>
    </div>
  );
}

// Move the game component to a separate file to avoid SSR
const KanjiMatchGame = dynamic(
  () => import('./KanjiMatchGame'),
  { 
    ssr: false,
    loading: () => <LoadingGame />
  }
);

export default function KanjiMatchPlayPage() {
  return <KanjiMatchGame />;
}
