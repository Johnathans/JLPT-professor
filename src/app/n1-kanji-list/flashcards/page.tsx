'use client';

import { useState } from 'react';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';

export default function FlashcardsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.reviewContainer}>
        <h1 className={styles.title}>N1 Flashcards Coming Soon</h1>
        <div className={styles.comingSoonContent}>
          <svg className={styles.comingSoonIcon} width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
            <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 12V12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className={styles.comingSoonText}>
            We're currently preparing our comprehensive N1 kanji flashcard deck.
            <br />
            Check back soon for an immersive learning experience!
          </p>
          <p className={styles.intro}>Let&apos;s master N1 kanji!</p>
        </div>
        <div className={styles.reviewActions}>
          <Link href="/n1-kanji-list" className={styles.secondaryButton}>
            Back to N1 Kanji List
          </Link>
        </div>
      </div>
    </div>
  );
}
