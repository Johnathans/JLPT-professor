/**
 * JLPT Kanji Data (Complete)
 * This file combines all JLPT kanji levels including the updated kanji data
 * Updated on 2025-03-29
 */

import { N1_KANJI } from './jlpt-kanji';
import { n5KanjiComplete } from './n5-kanji-complete';
import { n4KanjiComplete } from './n4-kanji-complete';
import { n3KanjiComplete } from './n3-kanji-complete';
import { n2KanjiComplete } from './n2-kanji-complete';

// Define KanjiData interface
export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// Export the updated kanji data
export const N5_KANJI = n5KanjiComplete;
export const N4_KANJI = n4KanjiComplete;
export const N3_KANJI = n3KanjiComplete;
export const N2_KANJI = n2KanjiComplete;

// Helper function to get JLPT level for a kanji
export function getJlptLevelForKanji(kanji: string): string | null {
  if (N5_KANJI.some(k => k.kanji === kanji)) return 'N5';
  if (N4_KANJI.some(k => k.kanji === kanji)) return 'N4';
  if (N3_KANJI.some(k => k.kanji === kanji)) return 'N3';
  if (N2_KANJI.some(k => k.kanji === kanji)) return 'N2';
  if (N1_KANJI.some(k => k.kanji === kanji)) return 'N1';
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...N4_KANJI, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];

// Re-export other data
export { N1_KANJI };
