'use client';

import { useEffect, useState, use } from 'react';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/kanji-list.module.css';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import KanjiAudioPlayer from '@/components/KanjiAudioPlayer';
import n4KanjiRaw from '@/data/n4-kanji-standardized.json';

type Props = {
  params: { slug: string }
}

export default function WordDetailPage({ params }: Props) {
  // Unwrap the params promise at the component level
  const resolvedParams = use(params);
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);
  const [rawKanjiData, setRawKanjiData] = useState<any>(null);

  useEffect(() => {
    const decodedSlug = decodeURIComponent(resolvedParams.slug);
    
    const foundKanji = n4KanjiComplete.find(k => k.kanji === decodedSlug);
    const rawKanji = n4KanjiRaw.n4_kanji.find(k => k.kanji === decodedSlug);

    if (foundKanji && rawKanji) {
      setRawKanjiData(rawKanji);
      
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
      
      const related = n4KanjiComplete
        .filter(k => k.kanji !== foundKanji.kanji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
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
          <Link href="/n4-kanji-list" className={styles.backLink}>
            ← Back to N4 Kanji List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n4-kanji-list" className={styles.backLink}>
          ← Back to N4 Kanji List
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
              <span className={styles.wordDetailValue}>N4</span>
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

        {rawKanjiData && (
          <div className={styles.wordDetailSection}>
            <KanjiAudioPlayer
              kanji={word.kanji}
              onyomi={rawKanjiData.onyomi}
              kunyomi={rawKanjiData.kunyomi.map((k: string) => k.replace(/\(.*?\)/g, ''))}
            />
          </div>
        )}

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
            The kanji "{word.kanji}" is commonly used in JLPT N4 vocabulary. 
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
            <h2>Other N4 Kanji</h2>
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n4-kanji-list/${relatedWord.kanji}`}
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
      </div>
    </div>
  );
}