/**
 * JLPT Kanji Base Data
 * This file contains the base kanji data categorized by JLPT level
 * Updated on 2025-03-29T05:12:30.064Z
 */

import { JlptKanjiData } from '../types/jlpt';

// N5 Kanji (79 kanji)
export const N5_KANJI: JlptKanjiData[] = [
  {
    kanji: "一",
    meaning: "one, one radical (no.1)",
    level: "N5",
    onyomi: ["イチ", "イツ"],
    kunyomi: ["ひと-", "ひと.つ"]
  },
  {
    kanji: "二",
    meaning: "two, two radical (no. 7)",
    level: "N5",
    onyomi: ["ニ", "ジ"],
    kunyomi: ["ふた", "ふた.つ"]
  }
];

// N4 Kanji (166 kanji)
export const N4_KANJI: JlptKanjiData[] = [
  {
    kanji: "力",
    meaning: "power, strength, strong, strain, bear up, exert",
    level: "N4",
    onyomi: ["リョク", "リキ"],
    kunyomi: ["ちから"]
  }
];

// Helper function to get JLPT level for a kanji
export function getJlptLevelForKanji(kanji: string): string | null {
  if (N5_KANJI.some(k => k.kanji === kanji)) return 'N5';
  if (N4_KANJI.some(k => k.kanji === kanji)) return 'N4';
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...N4_KANJI];
