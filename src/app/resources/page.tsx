'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Book, Gamepad, FileText, Layout, X } from 'lucide-react';
import styles from './resources.module.css';

const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
const types = [
  { name: 'Worksheets', icon: FileText },
  { name: 'Games', icon: Gamepad },
  { name: 'Lesson Plans', icon: Book },
  { name: 'Interactive', icon: Layout },
];
const subjects = [
  'Kanji',
  'Vocabulary',
  'Grammar',
  'Reading',
  'Listening',
  'Speaking',
];

export default function Resources() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAll = () => {
    setActiveFilters([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>JLPT Study Resources</h1>
        <span className={styles.resultCount}>1,240 results</span>
      </div>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>
              <span>Level</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.levelList}>
              {levels.map(level => (
                <label key={level} className={styles.levelItem}>
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(level)}
                    onChange={() => activeFilters.includes(level) ? removeFilter(level) : addFilter(level)}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>
              <span>Type</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.filterList}>
              {types.map(type => (
                <label key={type.name} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(type.name)}
                    onChange={() => activeFilters.includes(type.name) ? removeFilter(type.name) : addFilter(type.name)}
                  />
                  {type.name}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>
              <span>Subject</span>
              <ChevronDown size={16} />
            </div>
            <div className={styles.filterList}>
              {subjects.map(subject => (
                <label key={subject} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(subject)}
                    onChange={() => activeFilters.includes(subject) ? removeFilter(subject) : addFilter(subject)}
                  />
                  {subject}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.content}>
          {activeFilters.length > 0 && (
            <div className={styles.activeFilters}>
              {activeFilters.map(filter => (
                <button
                  key={filter}
                  className={styles.filterTag}
                  onClick={() => removeFilter(filter)}
                >
                  {filter}
                  <X size={14} />
                </button>
              ))}
            </div>
          )}

          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select className={styles.sortSelect}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className={styles.grid}>
            <Link href="/resources/kanji-match" className={styles.card}>
              <div className={styles.cardImage}>
                <Gamepad size={32} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Kanji Match Game</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>
                    <Gamepad size={16} />
                    Game
                  </span>
                  <span>N5</span>
                </div>
              </div>
            </Link>

            <Link href="/resources/kanji-flashcards" className={styles.card}>
              <div className={styles.cardImage}>
                <Book size={32} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>N5 Kanji Flashcards</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>
                    <Layout size={16} />
                    Interactive
                  </span>
                  <span>N5</span>
                </div>
              </div>
            </Link>

            <Link href="/resources/grammar-practice" className={styles.card}>
              <div className={styles.cardImage}>
                <FileText size={32} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Basic Grammar Practice</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>
                    <FileText size={16} />
                    Worksheet
                  </span>
                  <span>N5</span>
                </div>
              </div>
            </Link>

            <Link href="/resources/vocabulary-game" className={styles.card}>
              <div className={styles.cardImage}>
                <Gamepad size={32} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Vocabulary Matching Game</h3>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>
                    <Gamepad size={16} />
                    Game
                  </span>
                  <span>N5</span>
                </div>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
