'use client';

import { useEffect, useState, use } from 'react';
import { n5Verbs } from '@/data/n5-verbs';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/word-detail.module.css';
import { generateWordSlug } from '@/utils/url';

type Props = {
  params: Promise<{ slug: string }>;
}

export default function VerbDetailPage({ params }: Props) {
  // Unwrap the params promise at the component level
  const resolvedParams = use(params);
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);

  useEffect(() => {
    // Find the word that matches this slug
    const foundWord = n5Verbs.find(w => generateWordSlug(w) === resolvedParams.slug);

    if (foundWord) {
      setWord(foundWord);
      
      // Find related words (other N5 verbs)
      const related = n5Verbs
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
          <Link href="/n5-verbs" className={styles.backLink}>
            ← Back to N5 Verbs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n5-verbs" className={styles.backLink}>
          ← Back to N5 Verbs
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
              <span className={styles.wordDetailValue}>Verb</span>
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
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Group:</span>
              <span className={styles.wordDetailValue}>
                {word.kana.endsWith('る') ? 'Group 2 (-ru)' : 
                 word.kana.endsWith('く') ? 'Group 1 (-ku)' :
                 word.kana.endsWith('ぐ') ? 'Group 1 (-gu)' :
                 word.kana.endsWith('す') ? 'Group 1 (-su)' :
                 word.kana.endsWith('つ') ? 'Group 1 (-tsu)' :
                 word.kana.endsWith('ぬ') ? 'Group 1 (-nu)' :
                 word.kana.endsWith('ぶ') ? 'Group 1 (-bu)' :
                 word.kana.endsWith('む') ? 'Group 1 (-mu)' :
                 word.kana.endsWith('う') ? 'Group 1 (-u)' :
                 'Irregular'}
              </span>
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
              <span className={styles.wordDetailLabel}>Polite Form (-masu):</span>
              <span className={styles.wordDetailValue}>
                {word.kana.slice(0, -1)}ます
              </span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Negative Form (-nai):</span>
              <span className={styles.wordDetailValue}>
                {word.kana.slice(0, -1)}ない
              </span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Past Form (-ta):</span>
              <span className={styles.wordDetailValue}>
                {word.kana.slice(0, -1)}た
              </span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Te-form:</span>
              <span className={styles.wordDetailValue}>
                {word.kana.slice(0, -1)}て
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
            {word.examples.length === 0 && (
              <div className="alert alert-info" role="alert">
                No examples found for &quot;{word.kanji}&quot;
              </div>
            )}
          </div>
        )}

        <div className={styles.wordDetailSection}>
          <h2>Usage Notes</h2>
          <p>
            This is a basic Japanese verb that you'll encounter frequently in everyday conversations.
            Here are some key points about using "{word.kana}":
          </p>
          <ul className={styles.studyTipsList}>
            <li>Use the polite form (-masu) when speaking formally or to superiors</li>
            <li>Use the plain form in casual conversations or when writing</li>
            <li>The te-form is used to connect multiple actions or make requests</li>
            <li>The negative form (-nai) is used to express "not doing" the action</li>
          </ul>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Study Tips</h2>
          <ul className={styles.studyTipsList}>
            <li>Practice conjugating this verb in different forms (polite, past, negative)</li>
            <li>Create example sentences using different verb forms</li>
            <li>Try to use this verb in your daily Japanese conversations</li>
            {word.kanji && <li>Practice writing the kanji if the verb uses it</li>}
          </ul>
        </div>

        {relatedWords.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Related N5 Verbs</h2>
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n5-verbs/${generateWordSlug(relatedWord)}`}
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
          <h2 className={styles.practiceTitle}>Practice N5 Verbs</h2>
          <p className={styles.practiceDescription}>
            Reinforce your knowledge of N5 verbs through interactive exercises.
          </p>
          <div className={styles.practiceButtonContainer}>
            <Link href="/n5-verbs/flashcards" className={styles.practiceButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Practice with Flashcards
            </Link>
            <Link href="/n5-verbs" className={styles.secondaryPracticeButton}>
              Explore More N5 Verbs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
