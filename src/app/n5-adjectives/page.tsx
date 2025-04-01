'use client';

import styles from '@/styles/word-list.module.css';
import Link from 'next/link';
import { n5Adjectives } from '@/data/n5-adjectives';
import { generateWordSlug } from '@/utils/url';

export default function N5AdjectivesPage() {
  return (
    <div className={`${styles.container} ${styles.wordListContainer}`}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N5 Adjectives</h1>
          <p className={styles.subtitle}>
            Master the essential Japanese adjectives required for the JLPT N5 level. 
            These adjectives will help you describe objects, people, and situations in basic Japanese.
            You&apos;ll learn essential descriptive words that are frequently used in everyday conversations.
          </p>
          <p className={styles.intro}>Let&apos;s master N5 adjectives!</p>
          <div className={styles.actionButtons}>
            <Link href="/n5-adjectives/flashcards" className={styles.flashcardButton}>
              <svg className={styles.flashcardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Start Flashcard Learning
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.wordListWrapper}>
        <div className={styles.wordListHeader}>
          <h2 className={styles.wordListTitle}>N5 Adjectives List</h2>
          <p className={styles.wordListDescription}>
            Browse through our collection of N5 adjectives. Click on any adjective to see detailed information including conjugations and example sentences.
          </p>
        </div>

        <div className={styles.wordGrid}>
          {n5Adjectives.map((word) => (
            <Link 
              href={`/n5-adjectives/${generateWordSlug(word)}`} 
              key={word.id} 
              className={styles.wordCard}
            >
              <div className={styles.wordCharacter}>{word.kanji}</div>
              <div className={styles.wordReading}>{word.kana}</div>
              <div className={styles.wordMeaning}>{word.meaning}</div>
            </Link>
          ))}
        </div>

        <div className={styles.comingSoon}>
          <h2>More Adjectives Coming Soon</h2>
          <p>We&apos;re currently expanding our N5 adjectives list. Check back soon for more content!</p>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
