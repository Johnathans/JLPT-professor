'use client';

import { N3_KANJI, N4_KANJI, N5_KANJI } from '@/data/jlpt-kanji-updated';
import { KanjiData } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/test-imports.module.css';

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

      <div className={styles.totalKanji}>
        <h3 className={styles.totalKanjiTitle}>Total JLPT Kanji: {N3_KANJI.length + N4_KANJI.length + N5_KANJI.length}</h3>
        <p className={styles.totalKanjiDescription}>The JLPT Professor application now provides comprehensive kanji lists for N3, N4, and N5 levels.</p>
      </div>
    </div>
  );
}
