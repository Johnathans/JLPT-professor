/**
 * JLPT Kanji Data (Complete)
 * This file contains kanji categorized by JLPT level
 * Updated on 2025-05-04T23:07:00.000Z
 */

import { JlptKanjiData } from '@/types/jlpt';

// Helper function to convert readings to arrays
function processReadings(reading: string): { onyomi: string[], kunyomi: string[] } {
  // Split by both comma and 、
  const readings = reading.split(/[,、]/).map(r => r.trim()).filter(Boolean);
  
  // Convert hiragana to katakana for comparison
  function toKatakana(str: string): string {
    return str.replace(/[\u3041-\u3096]/g, ch => 
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
  }

  return {
    // If the reading can be converted to katakana and remain unchanged, it's onyomi
    onyomi: readings.filter(r => {
      const katakana = toKatakana(r);
      return /^[\u30A0-\u30FF]+$/.test(katakana);
    }),
    // If it contains hiragana, it's kunyomi
    kunyomi: readings.filter(r => /[\u3040-\u309F]/.test(r))
  };
}

// Process the kanji data to include onyomi and kunyomi
function processKanjiData(data: any): JlptKanjiData {
  const { onyomi, kunyomi } = processReadings(data.reading);
  return {
    ...data,
    onyomi,
    kunyomi,
    onyomi_katakana: onyomi.map(reading => reading.replace(/[\u3041-\u3096]/g, ch => 
      String.fromCharCode(ch.charCodeAt(0) + 0x60)
    )),
    kunyomi_hiragana: kunyomi,
  };
}

// Import original data
import { N5_KANJI as ORIG_N5_KANJI } from './jlpt-kanji-complete';
import { N4_KANJI as ORIG_N4_KANJI } from './jlpt-kanji-complete';
import { N3_KANJI as ORIG_N3_KANJI } from './jlpt-kanji-complete';
import { N2_KANJI as ORIG_N2_KANJI } from './jlpt-kanji-complete';
import { N1_KANJI as ORIG_N1_KANJI } from './jlpt-kanji-complete';

// Process each level
export const N5_KANJI: JlptKanjiData[] = ORIG_N5_KANJI.map(processKanjiData);
export const N4_KANJI: JlptKanjiData[] = ORIG_N4_KANJI.map(processKanjiData);
export const N3_KANJI: JlptKanjiData[] = ORIG_N3_KANJI.map(processKanjiData);
export const N2_KANJI: JlptKanjiData[] = ORIG_N2_KANJI.map(processKanjiData);
export const N1_KANJI: JlptKanjiData[] = ORIG_N1_KANJI.map(processKanjiData);

/**
 * Helper function to get JLPT level for a kanji
 * @param kanji The kanji character to look up
 * @returns The JLPT level (N5, N4, etc.) or null if not found
 */
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
