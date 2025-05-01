'use client';

import { N3_KANJI, N4_KANJI, N5_KANJI } from '@/data/jlpt-kanji-updated';
import { KanjiData } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/test-imports.module.css';
import KanjiTooltip from '@/components/KanjiTooltip';
import KuroshiroTest from '@/components/KuroshiroTest';
import SentenceAudioPlayer from '@/components/SentenceAudioPlayer';

const formatReadings = (readings: string | string[] | undefined): string[] => {
  if (!readings) return [];
  return Array.isArray(readings) ? readings : [readings];
};

const KanjiCard = ({ kanji }: { kanji: KanjiData }) => (
  <div className={styles.kanjiCard}>
    <div className={styles.kanjiCharacter}>{kanji.kanji}</div>
    <div className={styles.reading}>
      {kanji.onyomi?.length > 0 && (
        <span className={styles.onyomi}>On: {kanji.onyomi.join(', ')}</span>
      )}
      {kanji.onyomi?.length > 0 && kanji.kunyomi?.length > 0 && ' '}
      {kanji.kunyomi?.length > 0 && (
        <span className={styles.kunyomi}>Kun: {kanji.kunyomi.join(', ')}</span>
      )}
    </div>
    <div className={styles.meaning}>
      {Array.isArray(kanji.meaning) ? kanji.meaning.join(', ') : kanji.meaning}
    </div>
  </div>
);

export default function TestImportsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>JLPT Kanji Count Information</h1>
      
      <div className={styles.kanjiGrid}>
        <h2 className={styles.subtitle}>N3 Kanji: {N3_KANJI.length} kanji</h2>
        <p>The N3 level typically has around 370 kanji.</p>
        <div className={styles.kanjiGrid}>
          {N3_KANJI.slice(0, 10).map((kanji, index) => (
            <KanjiCard key={index} kanji={kanji} />
          ))}
        </div>
      </div>

      <div className={styles.kanjiGrid}>
        <h2 className={styles.subtitle}>N4 Kanji: {N4_KANJI.length} kanji</h2>
        <p>The N4 level typically has around 170 kanji.</p>
        <div className={styles.kanjiGrid}>
          {N4_KANJI.slice(0, 10).map((kanji, index) => (
            <KanjiCard key={index} kanji={kanji} />
          ))}
        </div>
      </div>

      <div className={styles.kanjiGrid}>
        <h2 className={styles.subtitle}>N5 Kanji: {N5_KANJI.length} kanji</h2>
        <p>The N5 level typically has around 80 kanji.</p>
        <div className={styles.kanjiGrid}>
          {N5_KANJI.slice(0, 10).map((kanji, index) => (
            <KanjiCard key={index} kanji={kanji} />
          ))}
        </div>
      </div>

      <div className={styles.testSection}>
        <h2>Test Kuroshiro</h2>
        <div className="space-y-4">
          <KuroshiroTest text="母は風邪で寝込んでいます。" />
          <KuroshiroTest text="日本語を勉強しています。" />
          <KuroshiroTest text="新しい車を買いました。" />
        </div>
      </div>

      <div className={styles.testSection}>
        <h2>Voice Test</h2>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Voice Test</h1>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Example Sentences with Chirp HD Voice</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-lg mb-2">
                    <KanjiTooltip text="私は毎日日本語を勉強します。" />
                  </div>
                  <div className="text-gray-600 mb-2">I study Japanese every day.</div>
                  <SentenceAudioPlayer text="私は毎日日本語を勉強します。" />
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-lg mb-2">
                    <KanjiTooltip text="東京に住んでいる友達に会いに行きます。" />
                  </div>
                  <div className="text-gray-600 mb-2">I'm going to meet my friend who lives in Tokyo.</div>
                  <SentenceAudioPlayer text="東京に住んでいる友達に会いに行きます。" />
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-lg mb-2">
                    <KanjiTooltip text="この本は面白いですから、ぜひ読んでください。" />
                  </div>
                  <div className="text-gray-600 mb-2">This book is interesting, so please read it.</div>
                  <SentenceAudioPlayer text="この本は面白いですから、ぜひ読んでください。" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.totalKanji}>
        <h3 className={styles.totalKanjiTitle}>Total JLPT Kanji: {N3_KANJI.length + N4_KANJI.length + N5_KANJI.length}</h3>
        <p className={styles.totalKanjiDescription}>The JLPT Professor application now provides comprehensive kanji lists for N3, N4, and N5 levels.</p>
      </div>
    </div>
  );
}
