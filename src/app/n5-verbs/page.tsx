'use client';

import styles from '@/styles/word-list.module.css';
import Link from 'next/link';
import { n5Verbs } from '@/data/n5-verbs';
import { generateWordSlug } from '@/utils/url';

export default function N5VerbsPage() {
  return (
    <div className={`${styles.container} ${styles.wordListContainer}`}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N5 Verbs</h1>
          <p className={styles.intro}>Let's master N5 verbs!</p>
          <p className={styles.subtitle}>
            Master the essential Japanese verbs required for the JLPT N5 level. 
            These are the basic verbs you'll need for everyday communication.
          </p>
          <div className={styles.actionButtons}>
            <Link href="/n5-verbs/flashcards" className={styles.flashcardButton}>
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
          <h2 className={styles.wordListTitle}>N5 Verbs List</h2>
          <p className={styles.wordListDescription}>
            Browse through our collection of N5 verbs. Click on any verb to see detailed information including conjugations and example sentences.
          </p>
        </div>

        <div className={styles.wordGrid}>
          {n5Verbs.map((word) => (
            <Link 
              href={`/n5-verbs/${generateWordSlug(word)}`} 
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
          <h2>More Verbs Coming Soon</h2>
          <p>We're currently expanding our N5 verb list. Check back soon for more content!</p>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
