import { Word } from '@/types/word';
import { KanjiData, CompoundWord } from '@/types/kanji';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import { N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji-complete';

/**
 * Find compound words containing a specific kanji from our vocabulary data
 */
export function findCompoundWords(kanji: string): CompoundWord[] {
  const compounds: CompoundWord[] = [];
  
  // Search through N5 vocabulary first
  n5VocabularyCombined.forEach(word => {
    if (word.kanji && word.kanji.includes(kanji)) {
      compounds.push({
        word: word.kanji,
        reading: word.kana,
        meaning: word.meaning,
        level: 'N5'
      });
    }
  });

  return compounds;
}

/**
 * Generate plausible but incorrect compound words for a kanji
 */
export function generateFakeCompounds(kanji: string, count: number = 2): CompoundWord[] {
  // Get all kanji from the same level and one level higher
  const kanjiLevel = [...N5_KANJI, ...N4_KANJI].map(k => k.kanji)
    .filter(k => k !== kanji);
  
  const fakeCompounds: CompoundWord[] = [];
  
  // Create compounds by combining with random kanji
  for (let i = 0; i < count; i++) {
    const randomKanji = kanjiLevel[Math.floor(Math.random() * kanjiLevel.length)];
    fakeCompounds.push({
      word: Math.random() < 0.5 ? kanji + randomKanji : randomKanji + kanji,
      reading: 'にほんご', // Default reading
      meaning: 'Incorrect compound',
      level: 'N5'
    });
  }
  
  return fakeCompounds;
}

/**
 * Convert a KanjiData into a KanjiQuestion with compounds
 */
export function createKanjiQuestion(kanjiData: KanjiData) {
  const realCompounds = findCompoundWords(kanjiData.kanji);
  const fakeCompounds = generateFakeCompounds(kanjiData.kanji, 2);
  
  // Mark real compounds as correct and fake ones as incorrect
  const compounds = [
    ...realCompounds.map(c => ({ ...c, correct: true })),
    ...fakeCompounds.map(c => ({ ...c, correct: false }))
  ].sort(() => Math.random() - 0.5) // Shuffle
   .slice(0, 4); // Limit to 4 choices
  
  return {
    ...kanjiData,
    compounds
  };
}
