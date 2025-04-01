'use client';

import { useEffect, useState } from 'react';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/kanji-list.module.css';
import { generateWordSlug } from '@/utils/url';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';

type Props = {
  params: { slug: string }
}

export default function WordDetailPage({ params }: Props) {
  // Unwrap the params promise at the component level
  const resolvedParams = params;
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);

  useEffect(() => {
    // Decode the slug
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    
    // Find the word that matches this slug
    const foundKanji = n5KanjiComplete.find(k => k.kanji === decodedSlug);

    if (foundKanji) {
      // Convert to Word format
      const wordDetail: Word = {
        kanji: foundKanji.kanji,
        kana: foundKanji.reading,
        meaning: foundKanji.meaning,
        type: 'kanji',
        examples: [
          {
            japanese: `これは${foundKanji.kanji}です。`,
            english: `This is ${foundKanji.meaning.split(',')[0]}.`
          },
          {
            japanese: `私は${foundKanji.kanji}が好きです。`,
            english: `I like ${foundKanji.meaning.split(',')[0]}.`
          }
        ]
      };
      
      setWord(wordDetail);
      
      // Find related words (other N5 kanji)
      const related = n5KanjiComplete
        .filter(k => k.kanji !== foundKanji.kanji)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 4); // Limit to 4 related kanji
      
      setRelatedWords(related.map(k => ({
        kanji: k.kanji,
        kana: k.reading,
        meaning: k.meaning,
        type: 'kanji'
      })));
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
          <Link href="/n5-kanji-list" className={styles.backLink}>
            ← Back to N5 Kanji List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n5-kanji-list" className={styles.backLink}>
          ← Back to N5 Kanji List
        </Link>
        <h1 className={styles.wordDetailTitle}>
          <span className={styles.kanjiHeading}>{word.kanji}</span>
          <span className={styles.kanaHeading} dangerouslySetInnerHTML={{ __html: word.kana }}></span>
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
              <span className={styles.wordDetailValue}>N5</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Kanji:</span>
              <span className={styles.wordDetailValue}>{word.kanji}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Reading:</span>
              <span className={styles.wordDetailValue} dangerouslySetInnerHTML={{ __html: word.kana }}></span>
            </div>
          </div>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Example Sentences</h2>
          {word.examples.length > 0 ? (
            <ul className={styles.exampleList}>
              {word.examples.map((example, index) => (
                <li key={index} className={styles.exampleItem}>
                  <div className={styles.exampleJapanese}>{example.japanese}</div>
                  <div className={styles.exampleEnglish}>{example.english}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info" role="alert">
              No examples found for "{word.kanji}"
            </div>
          )}
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Kanji Breakdown</h2>
          <p>
            The kanji "{word.kanji}" is commonly used in JLPT N5 vocabulary. 
            Understanding its components and stroke order will help you master it.
          </p>
          <div className={styles.strokeOrderSection}>
            <StrokeOrderDisplay kanji={word.kanji} />
          </div>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Study Tips</h2>
          <p>
            To memorize this kanji effectively:
          </p>
          <ul className={styles.studyTipsList}>
            <li>Practice writing it multiple times, paying attention to stroke order</li>
            <li>Create flashcards with the kanji on one side and its readings and meanings on the other</li>
            <li>Look for this kanji in real Japanese text to reinforce your memory</li>
            <li>Create mnemonics that connect the kanji's shape to its meaning</li>
          </ul>
        </div>

        {relatedWords.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Other N5 Kanji</h2>
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n5-kanji-list/${relatedWord.kanji}`}
                  className={styles.relatedWordCard}
                >
                  <div className={styles.relatedWordKanji}>{relatedWord.kanji}</div>
                  <div className={styles.relatedWordKana} dangerouslySetInnerHTML={{ __html: relatedWord.kana }}></div>
                  <div className={styles.relatedWordMeaning}>{relatedWord.meaning}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className={styles.practiceSection}>
          <h2 className={styles.practiceTitle}>Practice This Kanji</h2>
          <p className={styles.practiceDescription}>
            Reinforce your knowledge of this kanji through interactive exercises.
          </p>
          <div className={styles.practiceButtonContainer}>
            <Link href="/n5-kanji-list/flashcards" className={styles.practiceButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Practice with Flashcards
            </Link>
            <Link href="/n5-kanji-list" className={styles.secondaryPracticeButton}>
              Explore More N5 Kanji
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
