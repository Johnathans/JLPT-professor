'use client';

import styles from '@/styles/kanji-list.module.css';
import Link from 'next/link';
import { n1WordsComplete } from '@/data/n1-words-complete';
import { generateWordSlug } from '@/utils/url';

export default function N1KanjiListPage() {
  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N1 Kanji</h1>
          <p className={styles.subtitle}>
            Master the most advanced Japanese kanji required for the JLPT N1 level. 
            This level covers complex characters used in specialized and literary texts.
          </p>
          <div className={styles.actionButtons}>
            <Link href="/n1-kanji-list/flashcards" className={styles.flashcardButton}>
              <svg className={styles.flashcardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Start Flashcard Learning
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.kanjiListWrapper}>
        <div className={styles.kanjiListHeader}>
          <h2 className={styles.kanjiListTitle}>N1 Kanji List</h2>
          <p className={styles.kanjiListDescription}>
            Browse through our collection of N1 kanji. Click on any kanji to see detailed information.
          </p>
        </div>

        <div className={styles.kanjiGrid}>
          {n1WordsComplete.map((word) => (
            <Link 
              href={`/n1-kanji-list/${generateWordSlug(word)}`} 
              key={word.id} 
              className={styles.kanjiCard}
            >
              <div className={styles.kanjiCharacter}>{word.kanji}</div>
              <div className={styles.kanjiReading}>{word.kana}</div>
              <div className={styles.kanjiMeaning}>{word.meaning}</div>
            </Link>
          ))}
        </div>

        <div className={styles.comingSoon}>
          <h2>More Kanji Coming Soon</h2>
          <p>We&apos;re currently expanding our N1 kanji list. Check back soon for more content!</p>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
