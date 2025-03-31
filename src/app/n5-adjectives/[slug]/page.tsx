'use client';

import { useEffect, useState } from 'react';
import { n5Adjectives } from '@/data/n5-adjectives';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/word-detail.module.css';
import { generateWordSlug } from '@/utils/url';

type Props = {
  params: { slug: string }
}

export default function AdjectiveDetailPage({ params }: Props) {
  const resolvedParams = params;
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);

  useEffect(() => {
    // Find the word that matches this slug
    const foundWord = n5Adjectives.find(w => generateWordSlug(w) === resolvedParams.slug);

    if (foundWord) {
      setWord(foundWord);
      
      // Find related words (other N5 adjectives)
      const related = n5Adjectives
        .filter(w => w.id !== foundWord.id)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 4); // Limit to 4 related words
      
      setRelatedWords(related);
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
          <p>Loading word details...</p>
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
          <Link href="/n5-adjectives" className={styles.backLink}>
            ← Back to N5 Adjectives
          </Link>
        </div>
      </div>
    );
  }

  // Determine if it's an i-adjective or na-adjective
  const isIAdjective = word.kana.endsWith('い');
  const adjectiveType = isIAdjective ? 'i-adjective' : 'na-adjective';

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n5-adjectives" className={styles.backLink}>
          ← Back to N5 Adjectives
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
              <span className={styles.wordDetailValue}>Adjective ({adjectiveType})</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>JLPT Level:</span>
              <span className={styles.wordDetailValue}>N5</span>
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
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Romaji:</span>
              <span className={styles.wordDetailValue}>{word.romaji}</span>
            </div>
          </div>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Conjugation</h2>
          <div className={styles.wordDetailGrid}>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Plain Form (Dictionary):</span>
              <span className={styles.wordDetailValue}>{word.kana}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Negative Form:</span>
              <span className={styles.wordDetailValue}>
                {isIAdjective ? 
                  `${word.kana.slice(0, -1)}くない` : 
                  `${word.kana}じゃない`}
              </span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Past Form:</span>
              <span className={styles.wordDetailValue}>
                {isIAdjective ? 
                  `${word.kana.slice(0, -1)}かった` : 
                  `${word.kana}だった`}
              </span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Te-form:</span>
              <span className={styles.wordDetailValue}>
                {isIAdjective ? 
                  `${word.kana.slice(0, -1)}くて` : 
                  `${word.kana}で`}
              </span>
            </div>
          </div>
        </div>

        {word.examples && word.examples.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Example Sentences</h2>
            <ul className={styles.exampleList}>
              {word.examples.map((example, index) => (
                <li key={index} className={styles.exampleItem}>
                  <div className={styles.exampleJapanese}>{example.japanese}</div>
                  <div className={styles.exampleEnglish}>{example.english}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.wordDetailSection}>
          <h2>Usage Notes</h2>
          <p>
            This is a {adjectiveType} that you'll encounter frequently in everyday conversations.
            Here are some key points about using "{word.kana}":
          </p>
          <ul className={styles.studyTipsList}>
            {isIAdjective ? (
              <>
                <li>Ends in い and conjugates like other i-adjectives</li>
                <li>Can directly modify nouns without any particles</li>
                <li>Changes to くない for negative form</li>
                <li>Changes to かった for past tense</li>
              </>
            ) : (
              <>
                <li>Requires な when modifying nouns</li>
                <li>Uses だ/です for present tense</li>
                <li>Uses じゃない/ではない for negative</li>
                <li>Uses だった/でした for past tense</li>
              </>
            )}
          </ul>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Study Tips</h2>
          <ul className={styles.studyTipsList}>
            <li>Practice conjugating this adjective in different forms (negative, past, te-form)</li>
            <li>Create example sentences describing things using this adjective</li>
            <li>Try to use this adjective in your daily Japanese conversations</li>
            {word.kanji && <li>Practice writing the kanji if the adjective uses it</li>}
          </ul>
        </div>

        {relatedWords.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Related N5 Adjectives</h2>
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n5-adjectives/${generateWordSlug(relatedWord)}`}
                  className={styles.relatedWordCard}
                >
                  <div className={styles.relatedWordKanji}>{relatedWord.kanji}</div>
                  <div className={styles.relatedWordKana}>{relatedWord.kana}</div>
                  <div className={styles.relatedWordMeaning}>{relatedWord.meaning}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className={styles.practiceSection}>
          <h2 className={styles.practiceTitle}>Practice N5 Adjectives</h2>
          <p className={styles.practiceDescription}>
            Reinforce your knowledge of N5 adjectives through interactive exercises.
          </p>
          <div className={styles.practiceButtonContainer}>
            <Link href="/n5-adjectives/flashcards" className={styles.practiceButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Practice with Flashcards
            </Link>
            <Link href="/n5-adjectives" className={styles.secondaryPracticeButton}>
              Explore More N5 Adjectives
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
