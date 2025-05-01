import styles from '@/styles/common-words.module.css';

// Add type safety for the JSON data
type CommonWordsData = {
  [key: string]: Array<{
    word: string;
    reading: string;
    meaning: string;
    jlpt: string | null;
  }>;
};

// Import with type assertion
const n5CommonWords = require('@/data/common-words/n5-common-words.json') as CommonWordsData;
const n4CommonWords = require('@/data/common-words/n4-common-words.json') as CommonWordsData;
const n3CommonWords = require('@/data/common-words/n3-common-words.json') as CommonWordsData;

interface CommonWord {
  word: string;
  reading: string;
  meaning: string;
  jlpt: string | null;
}

interface CommonWordsProps {
  kanji: string;
  level?: 'n5' | 'n4' | 'n3' | 'n2' | 'n1';
}

export default function CommonWords({ kanji, level = 'n5' }: CommonWordsProps) {
  // Get words from the appropriate level data
  let words: CommonWord[] = [];
  if (level === 'n5') {
    words = n5CommonWords[kanji] || [];
  } else if (level === 'n4') {
    words = n4CommonWords[kanji] || [];
  } else if (level === 'n3') {
    words = n3CommonWords[kanji] || [];
  }

  // Add debug logging
  console.log('Kanji:', kanji);
  console.log('Level:', level);
  console.log('Words found:', words);

  if (words.length === 0) {
    console.log('No words found for kanji:', kanji);
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Common Words Using 「{kanji}」</h3>
      <div className={styles.wordGrid}>
        {words.map((word, index) => (
          <div key={index} className={styles.wordPill}>
            <div className={styles.japanese}>
              <span className={styles.word}>{word.word}</span>
              <span className={styles.reading}>
                {word.reading}
              </span>
            </div>
            <div className={styles.meaning}>
              {word.meaning}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
