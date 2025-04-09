import { N5_KANJI } from '@/data/jlpt-kanji-updated';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';
import { N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji-updated';

/**
 * Helper function to get JLPT level for a kanji
 * @param kanji The kanji character to look up
 * @returns The JLPT level (N5, N4, etc.) or null if not found
 */
export function getJlptLevelForKanji(kanji: string): string | null {
  if (N5_KANJI.some(k => k.kanji === kanji)) return 'N5';
  if (n4KanjiComplete.some(k => k.kanji === kanji)) return 'N4';
  if (N3_KANJI.some(k => k.kanji === kanji)) return 'N3';
  if (N2_KANJI.some(k => k.kanji === kanji)) return 'N2';
  if (N1_KANJI.some(k => k.kanji === kanji)) return 'N1';
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...n4KanjiComplete, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];
