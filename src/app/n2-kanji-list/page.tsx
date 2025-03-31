'use client';

import { useState } from 'react';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/kanji-list.module.css';
import Link from 'next/link';
import JlptLevelBadge from '@/components/JlptLevelBadge';

const ITEMS_PER_PAGE = 20;

export default function N2KanjiListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredKanji = N2_KANJI.filter(kanji => 
    kanji.kanji.includes(searchQuery) ||
    kanji.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kanji.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKanji.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedKanji = filteredKanji.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalKanji = N2_KANJI.length;

  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N2 Kanji</h1>
          <p className={styles.subtitle}>
            Master the advanced Japanese kanji required for the JLPT N2 level. 
            This level covers characters needed for reading newspapers and general texts.
          </p>
          <div className={styles.actionButtons}>
            <Link href="/n2-kanji-list/flashcards" className={styles.flashcardButton}>
              <svg className={styles.flashcardIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Start Flashcard Learning
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalKanji}</span>
              <span className={styles.statLabel}>Total Kanji</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>N2</span>
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
          placeholder="Search by kanji, reading, or meaning..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Kanji</th>
              <th>Reading</th>
              <th>Meaning</th>
              <th>Level</th>
              <th className={styles.actionCell}>Details</th>
            </tr>
          </thead>
          <tbody>
            {displayedKanji.map((kanji, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.kanjiCell}`}>
                  {kanji.kanji}
                </td>
                <td className={`${styles.tableCell} ${styles.kanaCell}`}
                  dangerouslySetInnerHTML={{ __html: kanji.reading }}
                />
                <td className={`${styles.tableCell} ${styles.meaningCell}`}>
                  {kanji.meaning}
                </td>
                <td className={`${styles.tableCell} ${styles.typeCell}`}>
                  <JlptLevelBadge word={kanji} />
                </td>
                <td className={`${styles.tableCell} ${styles.actionCell}`}>
                  <Link
                    href={`/n2-kanji-list/${kanji.kanji}`}
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
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredKanji.length)} of {filteredKanji.length} kanji
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
