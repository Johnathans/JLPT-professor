'use client';

import { useState } from 'react';
import Link from 'next/link';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import { generateWordSlug } from '@/utils/url';
import styles from '@/styles/kanji-list.module.css';
import JlptLevelBadge from '@/components/JlptLevelBadge';

const ITEMS_PER_PAGE = 20;

export default function N5VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWords = n5VocabularyCombined.filter(word => 
    word.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.kana.includes(searchQuery) ||
    word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedWords = filteredWords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalWords = n5VocabularyCombined.length;

  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N5 Vocabulary</h1>
          <p className={styles.subtitle}>
            Master the essential Japanese vocabulary required for the JLPT N5 level. 
            This comprehensive list covers basic words and phrases for daily communication.
          </p>
          <div className={styles.actionButtons}>
            <Link href="/n5-vocabulary/flashcards" className={styles.flashcardButton}>
              <svg className={styles.flashcardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Start Flashcard Learning
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalWords}</span>
              <span className={styles.statLabel}>Total Words</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>N5</span>
              <span className={styles.statLabel}>JLPT Level</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by romaji, kana, or meaning..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Romaji</th>
              <th>Kana</th>
              <th>Meaning</th>
              <th>Level</th>
              <th className={styles.actionCell}>Details</th>
            </tr>
          </thead>
          <tbody>
            {displayedWords.map((word, index) => (
              <tr key={word.id} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.romajiCell}`}>
                  {word.romaji}
                </td>
                <td className={`${styles.tableCell} ${styles.kanaCell}`}>
                  {word.kana}
                </td>
                <td className={`${styles.tableCell} ${styles.meaningCell}`}>
                  {word.meaning}
                </td>
                <td className={`${styles.tableCell} ${styles.typeCell}`}>
                  <JlptLevelBadge word={{ ...word, level: 'N5' }} />
                </td>
                <td className={`${styles.tableCell} ${styles.actionCell}`}>
                  <Link
                    href={`/n5-vocabulary/${generateWordSlug(word)}`}
                    className={styles.detailsLink}
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.pageInfo}>
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredWords.length)} of {filteredWords.length} words
        </div>
        <div className={styles.pageControls}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
