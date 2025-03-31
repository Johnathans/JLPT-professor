'use client';

import { Word } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/n5/page.module.css';

interface WordTableProps {
  words: Word[];
  level: string;
}

export default function WordTable({ words, level }: WordTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  
  const filteredWords = words.filter(word => 
    word.word.toLowerCase().includes(search.toLowerCase()) || 
    word.reading.toLowerCase().includes(search.toLowerCase()) || 
    word.meanings.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedWords = filteredWords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <th className={styles.actionCell}>Details</th>
            </tr>
          </thead>
          <tbody>
            {displayedWords.map((word) => (
              <tr key={word.id} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.kanjiCell}`}>
                  {word.word || '—'}
                </td>
                <td className={`${styles.tableCell} ${styles.kanaCell}`}>
                  {word.reading}
                </td>
                <td className={`${styles.tableCell} ${styles.meaningCell}`}>
                  {word.meanings.join(', ')}
                </td>
                <td className={`${styles.tableCell} ${styles.actionCell}`}>
                  <Link
                    href={`/word/${word.id}`}
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
      
      {filteredWords.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No words found matching your search.</p>
        </div>
      )}

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
