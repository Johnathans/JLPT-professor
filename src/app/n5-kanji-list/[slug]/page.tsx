'use client';

import { useEffect, useState, use } from 'react';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/kanji-list.module.css';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import KanjiAudioPlayer from '@/components/KanjiAudioPlayer';
import SentenceAudioPlayer from '@/components/SentenceAudioPlayer';
import SignupCTA from '@/components/SignupCTA';
import n5KanjiRaw from '@/data/n5-kanji-new.json';
import { KanjiData } from '@/types/kanji';
import { getExampleSentences } from '@/services/dictionary';
import JlptLevelBadge from '@/components/JlptLevelBadge';
import KanjiTooltip from '@/components/KanjiTooltip';
import CommonWords from '@/components/CommonWords';

type Props = {
  params: Promise<{ slug: string }>
}

export default function WordDetailPage({ params }: Props) {
  // Unwrap the params promise at the component level
  const resolvedParams = use(params);
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);
  const [rawKanjiData, setRawKanjiData] = useState<any>(null);
  const [examples, setExamples] = useState<Array<{ japanese: string; english: string; }>>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function loadData() {
      // Decode the slug
      const decodedSlug = decodeURIComponent(resolvedParams.slug);
      
      // Start fetching example sentences early
      const sentencesPromise = getExampleSentences(decodedSlug);
      
      // Find the word that matches this slug
      const foundKanji = n5KanjiComplete.find(k => k.kanji === decodedSlug);
      const rawKanji = n5KanjiRaw.n5_kanji.find(k => k.kanji === decodedSlug);

      if (foundKanji && rawKanji) {
        setRawKanjiData(rawKanji);
        
        // Convert to Word format
        const wordDetail: Word = {
          id: decodedSlug,
          kanji: foundKanji.kanji,
          kana: (foundKanji as any).reading || '',
          romaji: (foundKanji as any).reading || '',
          meaning: typeof foundKanji.meaning === 'string' ? 
            foundKanji.meaning : 
            Array.isArray(foundKanji.meaning) ? 
              foundKanji.meaning.join(', ') : 
              '',
          type: 'kanji'
        };
        
        setWord(wordDetail);
        
        // Find related words (other N5 kanji)
        const related = n5KanjiComplete
          .filter(k => k.kanji !== foundKanji.kanji)
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 4); // Limit to 4 related kanji
        
        setRelatedWords(related.map(k => ({
          id: k.kanji,
          kanji: k.kanji,
          kana: (k as any).reading || '',
          romaji: (k as any).reading || '',
          meaning: typeof k.meaning === 'string' ? 
            k.meaning : 
            Array.isArray(k.meaning) ? 
              k.meaning.join(', ') : 
              '',
          type: 'kanji'
        })));
        
        // Wait for example sentences to finish loading
        try {
          const sentences = await sentencesPromise;
          console.log('Fetched sentences:', sentences);
          setExamples(sentences);
        } catch (error) {
          console.error('Failed to fetch example sentences:', error);
          setExamples([{
            japanese: `${decodedSlug}の例文が見つかりませんでした。`,
            english: 'No example sentences found for this kanji.'
          }]);
        }
      } else {
        setError('Word not found');
      }
      
      setLoading(false);
    }

    loadData();
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
    <div className={styles.pageContainer}>
      <Link href="/n5-kanji-list" className={styles.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to N5 Kanji List
      </Link>

      <div className={styles.heroSection}>
        <div className={styles.leftColumn}>
          <div className={styles.kanjiCard}>
            <span className={styles.kanji}>{word.kanji}</span>
            <p className={styles.meaning}>{word.meaning}</p>
            
            {word && rawKanjiData && (
              <div className={styles.readingsContainer}>
                {rawKanjiData?.onyomi && rawKanjiData.onyomi.length > 0 && (
                  <div className={styles.readingBox}>
                    <div className={styles.readingLabel}>On'yomi</div>
                    <div className={styles.readingContent}>
                      <span>{rawKanjiData.onyomi.join('・')}</span>
                      {word.kanji && <KanjiAudioPlayer kanji={word.kanji} onyomi={rawKanjiData.onyomi} kunyomi={[]} />}
                    </div>
                  </div>
                )}
                {rawKanjiData?.kunyomi && rawKanjiData.kunyomi.length > 0 && (
                  <div className={styles.readingBox}>
                    <div className={styles.readingLabel}>Kun'yomi</div>
                    <div className={styles.readingContent}>
                      <span>{rawKanjiData.kunyomi.join('・')}</span>
                      {word.kanji && <KanjiAudioPlayer kanji={word.kanji} onyomi={[]} kunyomi={rawKanjiData.kunyomi} />}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.strokeOrder}>
            {word?.kanji && <StrokeOrderDisplay kanji={word.kanji} />}
            <div className={styles.details}>
              <div className={styles.detail}>
                <span>Type:</span>
                <span>{word.type}</span>
              </div>
              <div className={styles.detail}>
                <span>JLPT Level:</span>
                <span><JlptLevelBadge word={{
                  kanji: word.kanji || '',
                  level: 'N5',
                  onyomi: rawKanjiData?.onyomi || [],
                  kunyomi: rawKanjiData?.kunyomi || [],
                  meaning: [word.meaning],
                  type: 'kanji'
                }} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <section>
          <h2 className="text-2xl font-bold mb-4">Example Sentences</h2>
          <div className={styles.examples}>
            {examples && examples.length > 0 ? (
              examples.map((example, index) => (
                <div key={index} className={styles.exampleItem}>
                  <div className={styles.exampleContent}>
                    <div>
                      <div className={styles.exampleJapanese}>
                        <KanjiTooltip text={example.japanese} />
                      </div>
                      <div className={styles.exampleEnglish}>{example.english}</div>
                    </div>
                    <SentenceAudioPlayer text={example.japanese} />
                  </div>
                </div>
              ))
            ) : (
              <p>No example sentences available.</p>
            )}
          </div>
        </section>

        <section className="mt-8">
          {word.kanji && <CommonWords kanji={word.kanji} level="n5" />}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related Kanji</h2>
          {relatedWords.length > 0 ? (
            <div className={styles.relatedKanji}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n5-kanji-list/${relatedWord.kanji}`}
                  className={styles.relatedCard}
                >
                  <div className={styles.relatedKanjiChar}>{relatedWord.kanji}</div>
                  <div className={styles.relatedReading} dangerouslySetInnerHTML={{ __html: relatedWord.kana }}></div>
                  <div className={styles.relatedMeaning}>{relatedWord.meaning}</div>
                </Link>
              ))}
            </div>
          ) : (
            <p>Coming soon...</p>
          )}
        </section>
      </div>

      <SignupCTA />
    </div>
  );
}
