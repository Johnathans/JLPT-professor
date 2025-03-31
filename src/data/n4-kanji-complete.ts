/**
 * JLPT N4 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N4 level
 * Updated on 2025-03-29
 */

import { N5_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji';
import n4KanjiRaw from './n4-kanji-new.json';

export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// Convert the raw JSON data to our KanjiData format
export const n4KanjiComplete: KanjiData[] = n4KanjiRaw.n4_kanji.map(k => {
  const onyomi = k.onyomi.length > 0 ? `<span class="onyomi">On: ${k.onyomi.join(', ')}</span>` : '';
  const kunyomi = k.kunyomi.length > 0 ? `<span class="kunyomi">Kun: ${k.kunyomi.join(', ')}</span>` : '';
  const reading = [onyomi, kunyomi].filter(Boolean).join(' ');
  
  return {
    kanji: k.kanji,
    reading: reading || '(No reading available)',
    meaning: k.meaning.join(', '),
    level: 'N4'
  };
});

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
