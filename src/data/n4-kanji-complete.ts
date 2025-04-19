/**
 * JLPT N4 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N4 level
 * Updated on 2025-03-29
 */

import { KanjiData } from '@/types/word';
import n4KanjiRaw from './n4-kanji.json';

// Convert the raw JSON data to our KanjiData format
export const n4KanjiComplete: KanjiData[] = n4KanjiRaw.map(k => ({
  kanji: k.kanji,
  onyomi: k.readings_on || [],
  kunyomi: k.readings_kun || [],
  meaning: k.meanings,
  level: 'N4',
  type: 'general',
  usefulness: 6,
  usefulnessDescription: 'Common in pre-intermediate Japanese texts',
  examples: []
}));
