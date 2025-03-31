'use client';

import { useEffect, useState, use } from 'react';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';
import Link from 'next/link';
import styles from '@/styles/kanji-list.module.css';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';

// Define a KanjiDetail interface that matches the structure we need for the page
interface KanjiDetail {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
  examples?: {
    japanese: string;
    english: string;
  }[];
}

export default function KanjiDetailPage({ params }: { params: { slug: string } }) {
  // Unwrap the params promise at the component level
  const resolvedParams = use(params);
  
  const [kanji, setKanji] = useState<KanjiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedKanji, setRelatedKanji] = useState<KanjiDetail[]>([]);

  useEffect(() => {
    // Decode the slug
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    
    // Find the kanji that matches this slug
    const foundKanji = n4KanjiComplete.find(k => k.kanji === decodedSlug);

    if (foundKanji) {
      // Convert to KanjiDetail format
      const kanjiDetail: KanjiDetail = {
        kanji: foundKanji.kanji,
        reading: foundKanji.reading,
        meaning: foundKanji.meaning,
        level: foundKanji.level
      };
      
      setKanji(kanjiDetail);
      
      // Find related kanji (other N4 kanji)
      const related = n4KanjiComplete
        .filter(k => k.kanji !== foundKanji.kanji)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 4); // Limit to 4 related kanji
      
      setRelatedKanji(related);
    } else {
      setError('Kanji not found');
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

  if (error || !kanji) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>Error</h2>
          <p>{error || 'Kanji not found'}</p>
          <Link href="/n4-kanji-list" className={styles.backLink}>
            ← Back to N4 Kanji List
          </Link>
        </div>
      </div>
    );
  }

  // Mock example sentences
  const examples = kanji.examples || [
    {
      japanese: `これは${kanji.kanji}です。`,
      english: `This is ${kanji.meaning.split(',')[0]}.`
    },
    {
      japanese: `私は${kanji.kanji}が好きです。`,
      english: `I like ${kanji.meaning.split(',')[0]}.`
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n4-kanji-list" className={styles.backLink}>
          ← Back to N4 Kanji List
        </Link>
        <h1 className={styles.wordDetailTitle}>
          <span className={styles.kanjiHeading}>{kanji.kanji}</span>
          <span className={styles.kanaHeading} dangerouslySetInnerHTML={{ __html: kanji.reading }}></span>
        </h1>
        <p className={styles.wordDetailMeaning}>{kanji.meaning}</p>
      </div>

      <div className={styles.wordDetailCard}>
        <div className={styles.wordDetailSection}>
          <h2>Details</h2>
          <div className={styles.wordDetailGrid}>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Type:</span>
              <span className={styles.wordDetailValue}>Kanji</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>JLPT Level:</span>
              <span className={styles.wordDetailValue}>{kanji.level}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Kanji:</span>
              <span className={styles.wordDetailValue}>{kanji.kanji}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Reading:</span>
              <span className={styles.wordDetailValue} dangerouslySetInnerHTML={{ __html: kanji.reading }}></span>
            </div>
          </div>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Example Sentences</h2>
          <ul className={styles.exampleList}>
            {examples.map((example, index) => (
              <li key={index} className={styles.exampleItem}>
                <div className={styles.exampleJapanese}>{example.japanese}</div>
                <div className={styles.exampleEnglish}>{example.english}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Kanji Breakdown</h2>
          <p>
            The kanji "{kanji.kanji}" is commonly used in JLPT N4 vocabulary. 
            Understanding its components and stroke order will help you master it.
          </p>
          <div className={styles.strokeOrderSection}>
            <StrokeOrderDisplay kanji={kanji.kanji} />
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

        {relatedKanji.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Other N4 Kanji</h2>
            <div className={styles.relatedWordsList}>
              {relatedKanji.map((relatedKanji, index) => (
                <Link 
                  key={index}
                  href={`/n4-kanji-list/${relatedKanji.kanji}`}
                  className={styles.relatedWordCard}
                >
                  <div className={styles.relatedWordKanji}>{relatedKanji.kanji}</div>
                  <div className={styles.relatedWordKana} dangerouslySetInnerHTML={{ __html: relatedKanji.reading }}></div>
                  <div className={styles.relatedWordMeaning}>{relatedKanji.meaning}</div>
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
            <Link href="/n4-kanji-list/flashcards" className={styles.practiceButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Practice with Flashcards
            </Link>
            <Link href="/n4-kanji-list" className={styles.secondaryPracticeButton}>
              Explore More N4 Kanji
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}