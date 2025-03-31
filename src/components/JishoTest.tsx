'use client';

import { useState, useEffect } from 'react';
import { getJlptWords } from '@/services/jisho-service';
import styles from '@/styles/kanji-list.module.css';
import JlptLevelBadge from './JlptLevelBadge';

interface JishoTestProps {
  level?: string;
  word?: string;
}

export default function JishoTest({ level = 'n5', word = '日本' }: JishoTestProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch JLPT words
        const response = await getJlptWords(level, 5); // Get 5 words for testing
        setWords(response.data); // Updated to match the new function's response format
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error in JishoTest:', err);
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    }

    fetchData();
  }, [level]);

  if (loading) {
    return <div className={styles.loading}>Loading JLPT data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Jisho API Test</h2>
      
      <div className={styles.section}>
        <h3>JLPT Level for "{word}"</h3>
        <JlptLevelBadge word={word} />
      </div>
      
      <div className={styles.section}>
        <h3>Sample JLPT {level.toUpperCase()} Words</h3>
        <ul className={styles.wordList}>
          {words.map((entry, index) => (
            <li key={index} className={styles.wordItem}>
              <div className={styles.word}>
                <span className={styles.kanji}>{entry.japanese[0].word || entry.japanese[0].reading}</span>
                {entry.japanese[0].word && (
                  <span className={styles.reading}>{entry.japanese[0].reading}</span>
                )}
              </div>
              <div className={styles.meaning}>
                {entry.senses[0].english_definitions.join(', ')}
              </div>
              <div className={styles.jlptLevel}>
                {entry.jlpt && entry.jlpt.length > 0 ? (
                  <JlptLevelBadge word={entry.japanese[0].word || entry.japanese[0].reading} />
                ) : (
                  <span>No JLPT data</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
