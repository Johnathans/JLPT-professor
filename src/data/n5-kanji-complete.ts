/**
 * JLPT N5 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N5 level
 * Updated on 2025-03-29
 */

import { N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji';
import { ExampleSentence, KanjiData } from '@/types/word';
import n5KanjiRaw from './n5-kanji.json';

// Convert the raw JSON data to our KanjiData format
export const n5KanjiComplete: KanjiData[] = n5KanjiRaw.map(k => ({
  kanji: k.kanji,
  onyomi: k.readings_on || [],
  kunyomi: k.readings_kun || [],
  meaning: k.meanings,
  level: 'N5',
  type: 'general',
  usefulness: (() => {
    // Basic kanji used in daily life get higher scores
    if (['日', '一', '人', '大', '本', '中', '上', '下', '生', '時'].includes(k.kanji)) {
      return 10;
    }
    // Common kanji get medium scores
    if (['山', '川', '田', '木', '火', '水', '金', '土'].includes(k.kanji)) {
      return 8;
    }
    // Default score for other N5 kanji
    return 6;
  })(),
  usefulnessDescription: 'Common in basic Japanese texts',
  examples: []
}));

/**
 * Helper function to get JLPT level for a kanji
 * @param kanji The kanji character to look up
 * @returns The JLPT level (N5, N4, etc.) or null if not found
 */
export function getJlptLevelForKanji(kanji: string): string | null {
  if (n5KanjiComplete.some(k => k.kanji === kanji)) return 'N5';
  if (N4_KANJI.some(k => k.kanji === kanji)) return 'N4';
  if (N3_KANJI.some(k => k.kanji === kanji)) return 'N3';
  if (N2_KANJI.some(k => k.kanji === kanji)) return 'N2';
  if (N1_KANJI.some(k => k.kanji === kanji)) return 'N1';
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...n5KanjiComplete, ...N4_KANJI, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];
