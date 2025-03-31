'use client';

import { useState, useEffect } from 'react';
import { getJlptLevel } from '@/services/jisho-service';
import { getJlptLevelForKanji } from '@/data/jlpt-kanji';
import { n5WordsComplete as N5_WORDS } from '@/data/n5-words-complete';
import { n4WordsComplete as N4_WORDS } from '@/data/n4-words-complete';
import styles from '@/styles/word-detail.module.css';
import { KanjiData } from '@/data/jlpt-kanji-complete';

interface JlptLevelBadgeProps {
  word: string | KanjiData;
}

export default function JlptLevelBadge({ word }: JlptLevelBadgeProps) {
  const [level, setLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJlptLevel() {
      if (!word) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Check if word is a KanjiData object
        if (typeof word === 'object' && word.level) {
          setLevel(`jlpt-${word.level.toLowerCase()}`);
          setLoading(false);
          return;
        }
        
        // Convert to string for the rest of the processing
        const wordStr = typeof word === 'string' ? word : word.kanji;
        
        // First check if we have the word in our local data
        const n5Word = N5_WORDS.find(w => w.kanji === wordStr || w.kana === wordStr);
        if (n5Word) {
          setLevel(`jlpt-n5`);
          setLoading(false);
          return;
        }
        
        const n4Word = N4_WORDS.find(w => w.kanji === wordStr || w.kana === wordStr);
        if (n4Word) {
          setLevel(`jlpt-n4`);
          setLoading(false);
          return;
        }
        
        // If it's a single kanji, check our local kanji data
        if (wordStr.length === 1) {
          const kanjiLevel = getJlptLevelForKanji(wordStr);
          if (kanjiLevel) {
            setLevel(`jlpt-${kanjiLevel.toLowerCase()}`);
            setLoading(false);
            return;
          }
        }
        
        // Try to get JLPT level from API
        const jlptLevel = await getJlptLevel(wordStr);
        
        if (jlptLevel) {
          setLevel(jlptLevel);
        } else {
          // For multi-kanji words, try to determine level based on individual kanji
          if (wordStr.length > 1) {
            let highestLevel = 5; // Start with N5 (lowest)
            let allKanjiHaveLevel = true;
            
            for (const char of wordStr) {
              // Skip non-kanji characters
              if (!/[\u4e00-\u9faf]/.test(char)) continue;
              
              const charLevel = getJlptLevelForKanji(char);
              if (!charLevel) {
                allKanjiHaveLevel = false;
                break;
              }
              
              const levelNum = parseInt(charLevel.substring(1));
              if (levelNum < highestLevel) {
                highestLevel = levelNum;
              }
            }
            
            if (allKanjiHaveLevel) {
              setLevel(`jlpt-n${highestLevel}`);
              setLoading(false);
              return;
            }
          }
          
          setLevel(null);
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching JLPT level:', err);
        
        // On error, check local data as fallback
        const wordStr = typeof word === 'string' ? word : word.kanji;
        if (wordStr.length === 1) {
          const kanjiLevel = getJlptLevelForKanji(wordStr);
          if (kanjiLevel) {
            setLevel(`jlpt-${kanjiLevel.toLowerCase()}`);
            setError(null);
            setLoading(false);
            return;
          }
        }
        
        setError(err.message || 'Error fetching JLPT level');
        setLoading(false);
      }
    }

    fetchJlptLevel();
  }, [word]);

  if (loading) {
    return <div className={styles.jlptLevelBadge}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.jlptLevelBadge}>Error: {error}</div>;
  }

  if (!level) {
    return <div className={`${styles.jlptLevelBadge} ${styles.wordDetailContainer} ${styles.jlptUnknown}`}>Unknown</div>;
  }

  return (
    <div className={`${styles.jlptLevelBadge} ${styles.wordDetailContainer} ${styles[level]}`}>
      {level.toUpperCase().replace('JLPT-', '')}
    </div>
  );
}
