'use client';

import { useEffect, useState, use } from 'react';
import { N3_KANJI } from '@/data/jlpt-kanji-updated';
import { Word, ExampleSentence } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/kanji-list.module.css';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import KanjiAudioPlayer from '@/components/KanjiAudioPlayer';
import n3KanjiRaw from '@/data/n3-kanji-standardized.json';

type Props = {
  params: Promise<{ slug: string }>;
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
    
    const foundKanji = N3_KANJI.find(k => k.kanji === decodedSlug);
    const rawKanji = n3KanjiRaw.n3_kanji.find(k => k.kanji === decodedSlug);

    if (foundKanji && rawKanji) {
      setRawKanjiData(rawKanji);
      
      // Create reading text from onyomi and kunyomi
      const onyomiText = foundKanji.onyomi?.length > 0 ? `On: ${foundKanji.onyomi.join(', ')}` : '';
      const kunyomiText = foundKanji.kunyomi?.length > 0 ? `Kun: ${foundKanji.kunyomi.join(', ')}` : '';
      const readingText = [onyomiText, kunyomiText].filter(Boolean).join(' ');

      // Get primary meaning
      const primaryMeaning = Array.isArray(foundKanji.meaning) 
        ? foundKanji.meaning[0] 
        : typeof foundKanji.meaning === 'string' 
          ? foundKanji.meaning.split(',')[0].trim()
          : '';
      
      // Convert examples to ExampleSentence format
      const formattedExamples: ExampleSentence[] = foundKanji.examples 
        ? foundKanji.examples.map(example => ({
            japanese: typeof example === 'string' ? example : example.japanese,
            romaji: '',
            english: typeof example === 'string' ? '' : example.english
          }))
        : [];
      
      const wordDetail: Word = {
        id: resolvedParams.slug,
        kanji: foundKanji.kanji,
        kana: readingText,
        romaji: readingText,
        meaning: Array.isArray(foundKanji.meaning) ? foundKanji.meaning.join(', ') : foundKanji.meaning,
        type: 'kanji',
        examples: formattedExamples
      };

      setWord(wordDetail);
      setLoading(false);
      setError(null);

      // Find related kanji based on similar meanings or readings
      const relatedKanji = N3_KANJI
        .filter(k => k.kanji !== foundKanji.kanji)
        .filter(k => {
          const kMeaning = Array.isArray(k.meaning) ? k.meaning.join(' ') : k.meaning;
          const fMeaning = Array.isArray(foundKanji.meaning) ? foundKanji.meaning.join(' ') : foundKanji.meaning;
          
          // Check for shared readings
          const sharedOnyomi = k.onyomi?.some(reading => foundKanji.onyomi?.includes(reading));
          const sharedKunyomi = k.kunyomi?.some(reading => foundKanji.kunyomi?.includes(reading));
          
          // Check for similar meanings
          const similarMeaning = kMeaning.toLowerCase().includes(primaryMeaning.toLowerCase()) ||
                               fMeaning.toLowerCase().includes(Array.isArray(k.meaning) ? k.meaning[0].toLowerCase() : k.meaning.toLowerCase());
          
          return sharedOnyomi || sharedKunyomi || similarMeaning;
        })
        .slice(0, 5)
        .map(k => {
          const kMeaning = Array.isArray(k.meaning) ? k.meaning[0] : k.meaning.split(',')[0].trim();
          const kOnyomi = k.onyomi?.length > 0 ? `On: ${k.onyomi.join(', ')}` : '';
          const kKunyomi = k.kunyomi?.length > 0 ? `Kun: ${k.kunyomi.join(', ')}` : '';
          const kReadingText = [kOnyomi, kKunyomi].filter(Boolean).join(' ');
          
          return {
            id: k.kanji,
            kanji: k.kanji,
            kana: kReadingText,
            romaji: kReadingText,
            meaning: kMeaning,
            type: 'kanji'
          } as Word;
        });

      setRelatedWords(relatedKanji);
    } else {
      setWord(null);
      setLoading(false);
      setError('Kanji not found');
    }
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading kanji details...</p>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{error || 'Failed to load kanji details'}</p>
        <Link href="/n3-kanji-list" className={styles.backLink}>
          Back to Kanji List
        </Link>
      </div>
    );
  }

  const foundKanji = N3_KANJI.find(k => k.kanji === word.kanji);

  return (
    <div className={styles.kanjiDetailContainer}>
      <div className={styles.kanjiHeader}>
        <Link href="/n3-kanji-list" className={styles.backLink}>
          ← Back to Kanji List
        </Link>
        <h1 className={styles.kanjiTitle}>{word.kanji}</h1>
        <div className={styles.kanjiMeaning}>{word.meaning}</div>
        <div className={styles.kanjiReadings}>{word.kana}</div>
      </div>

      <div className={styles.kanjiContent}>
        {word.kanji && (
          <div className={styles.strokeOrder}>
            <h2>Stroke Order</h2>
            <StrokeOrderDisplay kanji={word.kanji} />
          </div>
        )}

        {word.kanji && foundKanji && (
          <div className={styles.audioSection}>
            <h2>Audio</h2>
            <KanjiAudioPlayer 
              kanji={word.kanji}
              onyomi={foundKanji.onyomi || []}
              kunyomi={foundKanji.kunyomi || []}
            />
          </div>
        )}

        {word.examples && word.examples.length > 0 && (
          <div className={styles.exampleSection}>
            <h2>Example Usage</h2>
            <div className={styles.examples}>
              {word.examples.map((example, index) => (
                <div key={index} className={styles.example}>
                  <div className={styles.japanese}>{example.japanese}</div>
                  <div className={styles.romaji}>{example.romaji}</div>
                  <div className={styles.english}>{example.english}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {relatedWords.length > 0 && (
          <div className={styles.relatedSection}>
            <h2>Related Kanji</h2>
            <div className={styles.relatedGrid}>
              {relatedWords.map((related) => (
                <Link
                  key={related.id}
                  href={`/n3-kanji-list/${related.kanji}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedKanji}>{related.kanji}</div>
                  <div className={styles.relatedInfo}>
                    <div className={styles.relatedMeaning}>{related.meaning}</div>
                    <div className={styles.relatedReading}>{related.kana}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
