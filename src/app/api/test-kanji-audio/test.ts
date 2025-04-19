import { n5_kanji } from '@/data/n5-kanji-new.json';

// Test data for the first kanji (日)
export const testKanji = n5_kanji[0];

// Example usage:
/*
fetch('/api/test-kanji-audio', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    kanji: testKanji.kanji,
    reading: testKanji.onyomi[0], // "nichi"
    type: 'onyomi'
  })
});
*/
