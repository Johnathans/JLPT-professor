/**
 * Update App to Use New Kanji Data
 * 
 * This script updates the application to use the new comprehensive kanji data
 * from the davidluzgouveia/kanji-data repository.
 */

const fs = require('fs');
const path = require('path');

// Paths
const dataDir = path.join(__dirname, '..', 'data');
const jlptKanjiPath = path.join(dataDir, 'jlpt-kanji.ts');
const jlptKanjiCompletePath = path.join(dataDir, 'jlpt-kanji-complete.ts');

// Function to update the jlpt-kanji.ts file
function updateJlptKanjiFile() {
  console.log('Updating jlpt-kanji.ts file...');
  
  // Read the new kanji data
  const newKanjiData = fs.readFileSync(jlptKanjiCompletePath, 'utf8');
  
  // Write to the jlpt-kanji.ts file
  fs.writeFileSync(jlptKanjiPath, newKanjiData, 'utf8');
  
  console.log('Successfully updated jlpt-kanji.ts file with new kanji data');
}

// Function to check if n4-kanji-list directory exists and create it if not
function ensureN4KanjiListDirectory() {
  const n4KanjiListDir = path.join(__dirname, '..', 'app', 'n4-kanji-list');
  
  if (!fs.existsSync(n4KanjiListDir)) {
    console.log('Creating n4-kanji-list directory...');
    fs.mkdirSync(n4KanjiListDir, { recursive: true });
    console.log('Successfully created n4-kanji-list directory');
  }
}

// Function to create a dynamic route for kanji detail pages
function createKanjiDetailPage() {
  const kanjiDetailDir = path.join(__dirname, '..', 'app', 'n4-kanji-list', '[slug]');
  
  if (!fs.existsSync(kanjiDetailDir)) {
    console.log('Creating kanji detail directory...');
    fs.mkdirSync(kanjiDetailDir, { recursive: true });
  }
  
  const pageContent = `'use client';

import { useParams } from 'next/navigation';
import { N4_KANJI } from '@/data/jlpt-kanji-complete';
import styles from '@/styles/word-detail.module.css';
import Link from 'next/link';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import JlptLevelBadge from '@/components/JlptLevelBadge';
import { BackButton } from '@/components/BackButton';

export default function KanjiDetailPage() {
  const { slug } = useParams();
  
  const kanjiData = N4_KANJI.find(k => k.kanji === slug);
  
  if (!kanjiData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <BackButton href="/n4-kanji-list" />
          <h1>Kanji not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <BackButton href="/n4-kanji-list" />
        <div className={styles.wordDisplay}>
          <h1 className={styles.word}>{kanjiData.kanji}</h1>
          <p className={styles.reading}>{kanjiData.reading}</p>
        </div>
        <p className={styles.meaning}>{kanjiData.meaning}</p>
        <div className={styles.badges}>
          <JlptLevelBadge level={kanjiData.level} />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Stroke Order</h2>
        <div className={styles.strokeOrderContainer}>
          <StrokeOrderDisplay kanji={kanjiData.kanji} />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Study Tips</h2>
        <div className={styles.studyTips}>
          <p>Practice writing this kanji multiple times to memorize the stroke order.</p>
          <p>Look for this kanji in compound words to better understand its usage.</p>
        </div>
      </div>
    </div>
  );
}`;

  const pagePath = path.join(kanjiDetailDir, 'page.tsx');
  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log('Successfully created kanji detail page');
}

// Function to update the n4-kanji-list page
function updateN4KanjiListPage() {
  const pagePath = path.join(__dirname, '..', 'app', 'n4-kanji-list', 'page.tsx');
  
  const pageContent = `'use client';

import { useState } from 'react';
import { N4_KANJI } from '@/data/jlpt-kanji-complete';
import styles from '@/styles/kanji-list.module.css';
import Link from 'next/link';
import JlptLevelBadge from '@/components/JlptLevelBadge';

const ITEMS_PER_PAGE = 20;

export default function N4KanjiListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredKanji = N4_KANJI.filter(kanji => 
    kanji.kanji.includes(searchQuery) ||
    kanji.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kanji.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKanji.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedKanji = filteredKanji.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalKanji = N4_KANJI.length;

  return (
    <div className={styles.container}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>JLPT N4 Kanji</h1>
          <p className={styles.subtitle}>
            Master the intermediate Japanese kanji required for the JLPT N4 level. 
            This comprehensive list includes {totalKanji} kanji characters.
          </p>
          <div className={styles.actionButtons}>
            <Link href="/n4-kanji-list/flashcards" className={styles.flashcardButton}>
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
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search kanji, reading, or meaning..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.kanjiTable}>
            <thead>
              <tr>
                <th>Kanji</th>
                <th>Reading</th>
                <th>Meaning</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {displayedKanji.map((kanji) => (
                <tr key={kanji.kanji} className={styles.kanjiRow}>
                  <td className={styles.kanjiCell}>
                    <Link href={\`/n4-kanji-list/\${kanji.kanji}\`} className={styles.kanjiLink}>
                      {kanji.kanji}
                    </Link>
                  </td>
                  <td>{kanji.reading}</td>
                  <td>{kanji.meaning}</td>
                  <td>
                    <JlptLevelBadge level={kanji.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}`;

  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log('Successfully updated n4-kanji-list page');
}

// Main function
async function main() {
  try {
    // Update jlpt-kanji.ts file
    updateJlptKanjiFile();
    
    // Ensure n4-kanji-list directory exists
    ensureN4KanjiListDirectory();
    
    // Create kanji detail page
    createKanjiDetailPage();
    
    // Update n4-kanji-list page
    updateN4KanjiListPage();
    
    console.log('Successfully updated application to use new kanji data');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
