'use client';

import { useState } from 'react';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';
import styles from './n2-kanji-list.module.css';
import Link from 'next/link';
import JlptLevelBadge from '@/components/JlptLevelBadge';
import { List, Grid, ChevronDown } from 'lucide-react';
import type { KanjiData } from '@/types/word';

const ITEMS_PER_PAGE = 20;

const NOTES_DATA = [
  {
    id: 'basic',
    title: 'Advanced Level',
    content: 'N2 represents an advanced level of the JLPT and includes complex kanji used in academic and professional contexts. These characters are essential for reading newspapers, business documents, and advanced literature.'
  },
  {
    id: 'usage',
    title: 'Business and Academic',
    content: 'These kanji appear frequently in business correspondence, academic papers, and formal writing. They enable you to communicate effectively in professional settings and understand complex texts.'
  },
  {
    id: 'tips',
    title: 'Study Tips',
    content: 'Focus on understanding both individual kanji meanings and common compound words. Practice reading authentic materials like business news and academic articles to reinforce your learning.'
  },
  {
    id: 'review',
    title: 'Regular Review',
    content: 'Use the grid view for quick recognition practice and the list view for detailed study. Pay attention to both onyomi and kunyomi readings as they are crucial at this level.'
  }
];

export default function N2KanjiListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [openNoteId, setOpenNoteId] = useState<string | null>('basic');

  const filteredKanji = N2_KANJI.filter(kanji => {
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
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredKanji.length);
  const displayedKanji = filteredKanji.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>JLPT N2 Kanji</h1>
      <p className={styles.description}>
        Master the advanced Japanese kanji required for the JLPT N2 level.
        This comprehensive list covers characters essential for business and academic contexts.
      </p>

      <div className={styles.controls}>
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

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={20} />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className={styles.gridContainer}>
          {displayedKanji.map((kanji, index) => (
            <div key={index} className={styles.cardWrapper}>
              <div className={styles.card}>
                <div className={styles.cardFront}>
                  <div className={styles.cardLevel}>N2</div>
                  <div className={styles.cardKanji}>{kanji.kanji}</div>
                  <div className={styles.cardMeaning}>
                    {typeof kanji.meaning === 'string' ? 
                      kanji.meaning.split(',').slice(0, 2).join(', ') :
                      Array.isArray(kanji.meaning) ? 
                        kanji.meaning.slice(0, 2).join(', ') :
                        ''
                    }
                  </div>
                </div>
                <div className={styles.cardBack}>
                  <div className={styles.cardReadings}>
                    {kanji.onyomi?.length > 0 && (
                      <div className={styles.cardReading}>
                        <span className={styles.readingLabel}>On:</span>
                        <span>{kanji.onyomi.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {kanji.kunyomi?.length > 0 && (
                      <div className={styles.cardReading}>
                        <span className={styles.readingLabel}>Kun:</span>
                        <span>{kanji.kunyomi.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/n2-kanji-list/${kanji.kanji}`}
                    className={styles.cardLink}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                      <span className="onyomi">On: {kanji.onyomi.slice(0, 2).join(', ')}</span>
                    )}
                    {kanji.onyomi?.length > 0 && kanji.kunyomi?.length > 0 && ' '}
                    {kanji.kunyomi?.length > 0 && (
                      <span className="kunyomi">Kun: {kanji.kunyomi.slice(0, 2).join(', ')}</span>
                    )}
                  </td>
                  <td className={`${styles.tableCell} ${styles.meaningCell}`}>
                    {typeof kanji.meaning === 'string' ? 
                      kanji.meaning.split(',').slice(0, 2).join(', ') :
                      Array.isArray(kanji.meaning) ? 
                        kanji.meaning.slice(0, 2).join(', ') :
                        ''
                    }
                  </td>
                  <td className={`${styles.tableCell} ${styles.typeCell}`}>
                    <JlptLevelBadge word={{
                      ...kanji,
                      level: 'N2'
                    }} />
                  </td>
                  <td className={`${styles.tableCell} ${styles.actionCell}`}>
                    <Link
                      href={`/n2-kanji-list/${kanji.kanji}`}
                      className={styles.detailsLink}
                    >
                      View
                      <span className={styles.arrow}> →</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.pagination}>
        <div className={styles.pageInfo}>
          Showing {startIndex + 1}-{endIndex} of {filteredKanji.length} kanji
        </div>
        <div className={styles.pageControls}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={endIndex >= filteredKanji.length}
          >
            Next
          </button>
        </div>
      </div>

      <div className={styles.notesSection}>
        <h2 className={styles.notesTitle}>About N2 Kanji</h2>
        <ul className={styles.notesList}>
          {NOTES_DATA.map((note) => (
            <li key={note.id} className={styles.noteItem}>
              <button
                className={styles.noteButton}
                onClick={() => setOpenNoteId(openNoteId === note.id ? null : note.id)}
              >
                <h3 className={styles.noteHeading}>{note.title}</h3>
                <ChevronDown 
                  className={`${styles.chevron} ${openNoteId === note.id ? styles.open : ''}`}
                  size={20}
                />
              </button>
              <div className={`${styles.noteContent} ${openNoteId === note.id ? styles.open : ''}`}>
                <p className={styles.noteText}>{note.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
