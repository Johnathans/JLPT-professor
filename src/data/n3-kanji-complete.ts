/**
 * JLPT N3 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N3 level
 * Updated on 2025-03-29
 */

import { ExampleSentence, KanjiData } from '@/types/word';
import n3KanjiRaw from './n3-kanji.json';

// Convert the raw JSON data to our KanjiData format
export const n3KanjiComplete: KanjiData[] = n3KanjiRaw.map(k => ({
  kanji: k.kanji,
  onyomi: k.readings_on || [],
  kunyomi: k.readings_kun || [],
  meaning: k.meanings,
  level: 'N3',
  type: 'general',
  usefulness: 5,
  usefulnessDescription: 'Common in intermediate Japanese texts',
  examples: []
}));
