'use client';

import { useState } from 'react';
import { N5_KANJI } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/kanji-list.module.css';
import heroColors from '@/styles/hero-colors.module.css';
import Link from 'next/link';
import JlptLevelBadge from '@/components/JlptLevelBadge';

const ITEMS_PER_PAGE = 20;

export default function N5KanjiListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredKanji = N5_KANJI.filter(kanji => {
    const onyomiStr = kanji.onyomi?.join(' ').toLowerCase() || '';
    const kunyomiStr = kanji.kunyomi?.join(' ').toLowerCase() || '';
    const readings = `${onyomiStr} ${kunyomiStr}`;
    const meanings = Array.isArray(kanji.meaning) ? kanji.meaning.join(' ') : kanji.meaning;
    return kanji.kanji.includes(searchQuery) ||
           readings.includes(searchQuery.toLowerCase()) ||
           meanings.toLowerCase().includes(searchQuery.toLowerCase())
  });

  const totalPages = Math.ceil(filteredKanji.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedKanji = filteredKanji.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalKanji = N5_KANJI.length;

  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={`${styles.heroContent} container`}>
          <div className={styles.heroLeft}>
            <div className={styles.heroLeftContent}>
              <h1 className={`${styles.title} ${heroColors.title}`}>JLPT N5 Kanji</h1>
              <p className={styles.subtitle}>
                Master the foundational Japanese kanji required for the JLPT N5 level. 
                This comprehensive list covers essential characters for basic daily reading and writing.
              </p>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={`${styles.statValue} ${heroColors.statValue}`}>{totalKanji}</span>
                  <span className={styles.statLabel}>Total Kanji</span>
                </div>
                <div className={styles.statItem}>
                  <span className={`${styles.statValue} ${heroColors.statValue}`}>N5</span>
                  <span className={styles.statLabel}>JLPT Level</span>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <Link href="/n5-kanji-list/flashcards" className={styles.flashcardButton}>
                  <svg className={styles.flashcardIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Start Flashcard Learning
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.kanjiGrid}>
              {N5_KANJI.slice(0, 9).map((kanji) => (
                <Link 
                  href={`/n5-kanji-list/${encodeURIComponent(kanji.kanji)}`} 
                  key={kanji.kanji}
                  className={styles.kanjiGridItem}
                >
                  <span className={`${styles.kanjiCharacter} ${heroColors.kanjiGridCharacter}`}>{kanji.kanji}</span>
                  <span className={styles.meaning}>
                    {typeof kanji.meaning === 'string' ? 
                      (kanji.meaning as string).split(',')[0].trim() :
                      Array.isArray(kanji.meaning) && kanji.meaning.length > 0 ?
                        (kanji.meaning[0] as string).trim() :
                        ''
                    }
                  </span>
                </Link>
              ))}
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
                <td className={`${styles.tableCell} ${styles.kanaCell}`}>
                  {kanji.onyomi?.length > 0 && (
                    <span className="onyomi">On: {kanji.onyomi.join(', ')}</span>
                  )}
                  {kanji.onyomi?.length > 0 && kanji.kunyomi?.length > 0 && ' '}
                  {kanji.kunyomi?.length > 0 && (
                    <span className="kunyomi">Kun: {kanji.kunyomi.join(', ')}</span>
                  )}
                </td>
                <td className={`${styles.tableCell} ${styles.meaningCell}`}>
                  {typeof kanji.meaning === 'string' ? 
                    kanji.meaning :
                    Array.isArray(kanji.meaning) ? 
                      kanji.meaning.join(', ') :
                      ''
                  }
                </td>
                <td className={`${styles.tableCell} ${styles.typeCell}`}>
                  <JlptLevelBadge word={{
                    ...kanji,
                    level: 'N5'
                  }} />
                </td>
                <td className={`${styles.tableCell} ${styles.actionCell}`}>
                  <Link
                    href={`/n5-kanji-list/${kanji.kanji}`}
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
