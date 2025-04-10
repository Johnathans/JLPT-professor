'use client';

import { useEffect, useState, use } from 'react';
import { n1WordsComplete } from '@/data/n1-words-complete';
import { Word } from '@/types/word';
import Link from 'next/link';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import styles from '@/styles/kanji-list.module.css';
import { generateWordSlug } from '@/utils/url';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function WordDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);

  useEffect(() => {
    // Decode the slug
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    
    // Find the word that matches this slug
    const foundWord = n1WordsComplete.find(w => {
      const parts = [];
      if (w.kanji && w.kanji.trim() !== '') {
        parts.push(w.kanji);
      }
      parts.push(w.kana);
      
      // Simple check if the slug starts with these parts
      return decodedSlug.startsWith(parts.join('-'));
    });

    if (foundWord) {
      const wordDetail: Partial<Word> = {
        id: resolvedParams.slug,
        kanji: foundWord.kanji,
        kana: foundWord.kana,
        romaji: foundWord.kana, // Use kana as romaji for now
        meaning: foundWord.meaning,
        type: 'kanji',
        examples: [
          {
            japanese: `これは${foundWord.kanji}です。`,
            romaji: `Kore wa ${foundWord.kanji} desu.`,
            english: `This is ${foundWord.meaning.split(',')[0]}.`
          },
          {
            japanese: `私は${foundWord.kanji}が好きです。`,
            romaji: `Watashi wa ${foundWord.kanji} ga suki desu.`,
            english: `I like ${foundWord.meaning.split(',')[0]}.`
          }
        ],
      };
      setWord(wordDetail as Word);
      
      // Find related words (words that share the same kanji)
      if (foundWord.kanji) {
        const related = n1WordsComplete
          .filter(w => 
            w !== foundWord && 
            w.kanji && 
            (w.kanji.includes(foundWord.kanji || '') || (foundWord.kanji || '').includes(w.kanji))
          )
          .slice(0, 4); // Limit to 4 related words
        
        // Ensure related words have all required fields for Word type
        const typedRelatedWords = related.map(w => ({
          id: w.kanji || w.kana,
          kanji: w.kanji,
          kana: w.kana,
          romaji: w.kana, // Use kana as romaji
          meaning: w.meaning,
          type: 'kanji'
        })) as Word[];
        
        setRelatedWords(typedRelatedWords);
      }
    } else {
      setError('Word not found');
    }
    
    setLoading(false);
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading kanji details...</p>
        </div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>Error</h2>
          <p>{error || 'Word not found'}</p>
          <Link href="/n1-kanji-list" className={styles.backLink}>
            ← Back to N1 Kanji List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n1-kanji-list" className={styles.backLink}>
          ← Back to N1 Kanji List
        </Link>
        <h1 className={styles.wordDetailTitle}>
          {word.kanji && <span className={styles.kanjiHeading}>{word.kanji}</span>}
          <span className={styles.kanaHeading}>{word.kana}</span>
        </h1>
        <p className={styles.wordDetailMeaning}>{word.meaning}</p>
      </div>

      <div className={styles.wordDetailCard}>
        <div className={styles.wordDetailSection}>
          <h2>Details</h2>
          <div className={styles.wordDetailGrid}>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Type:</span>
              <span className={styles.wordDetailValue}>{word.type}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>JLPT Level:</span>
              <span className={styles.wordDetailValue}>N1</span>
            </div>
            {word.kanji && (
              <div className={styles.wordDetailItem}>
                <span className={styles.wordDetailLabel}>Kanji:</span>
                <span className={styles.wordDetailValue}>{word.kanji}</span>
              </div>
            )}
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Reading:</span>
              <span className={styles.wordDetailValue}>{word.kana}</span>
            </div>
          </div>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Example Sentences</h2>
          {word.examples && word.examples.length > 0 ? (
            <ul className={styles.exampleList}>
              {word.examples.map((example, index) => (
                <li key={index} className={styles.exampleItem}>
                  <div className={styles.exampleJapanese}>{example.japanese}</div>
                  <div className={styles.exampleRomaji}>{example.romaji}</div>
                  <div className={styles.exampleEnglish}>{example.english}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No example sentences available.</p>
          )}
        </div>

        {word.kanji && (
          <div className={styles.wordDetailSection}>
            <h2>Kanji Breakdown</h2>
            <p>
              The kanji "{word.kanji}" is commonly used in JLPT N1 vocabulary. 
              Understanding its components and stroke order will help you master it.
            </p>
            
            <div className={styles.strokeOrderSection}>
              <h3 className={styles.strokeOrderTitle}>Stroke Order</h3>
              <div className={styles.strokeOrderDisplay}>
                <StrokeOrderDisplay kanji={word.kanji || ''} />
              </div>
            </div>
          </div>
        )}

        <div className={styles.wordDetailSection}>
          <h2>Study Tips</h2>
          <p>
            Practice writing this {word.kanji ? 'kanji' : 'word'} multiple times to memorize it.
            Try creating your own sentences using this word to reinforce your learning.
            Use flashcards to test your recall of this word regularly.
          </p>
        </div>
      </div>

      {relatedWords.length > 0 && (
        <div className={styles.wordDetailCard}>
          <div className={styles.relatedWordsSection}>
            <h2>Related Words</h2>
            <p>These words share kanji characters with "{word.kanji || word.kana}":</p>
            
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index} 
                  href={`/n1-kanji-list/${generateWordSlug(relatedWord)}`}
                  className={styles.relatedWordCard}
                >
                  <div className={styles.relatedWordKanji}>{relatedWord.kanji}</div>
                  <div className={styles.relatedWordKana}>{relatedWord.kana}</div>
                  <div className={styles.relatedWordMeaning}>{relatedWord.meaning}</div>
                </Link>
              ))}
            </div>
            {relatedWords.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No compounds found for "{word.kanji}" in the N1 vocabulary list
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className={styles.practiceSection}>
        <h2 className={styles.practiceTitle}>Practice This Kanji</h2>
        <p className={styles.practiceDescription}>
          Reinforce your learning with our interactive practice tools.
        </p>
        <div className={styles.practiceButtonContainer}>
          <Link href="/n1-kanji-list/flashcards" className={styles.practiceButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
            </svg>
            Practice with Flashcards
          </Link>
          <Link href="/n1-kanji-list" className={`${styles.practiceButton} ${styles.secondaryPracticeButton}`}>
            Explore More N1 Kanji
          </Link>
        </div>
      </div>
    </div>
  );
}
