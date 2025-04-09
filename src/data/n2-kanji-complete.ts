/**
 * JLPT N2 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N2 level
 * Updated on 2025-03-29
 */

import n2KanjiPart1Raw from './n2-kanji-new-part1.json';
import n2KanjiPart2Raw from './n2-kanji-new-part2.json';
import { KanjiData } from '@/types/word';

// Process the raw kanji data from both files
const processKanjiData = (kanjiItem: any): KanjiData => {
  // Extract onyomi and kunyomi from the string format
  const extractReading = (reading: string) => {
    if (!reading) return [];
    
    // Extract kana readings from format like "ryou (リョウ)" or "take (たけ)"
    const match = reading.match(/([^(]+)\s*\(([^)]+)\)/);
    if (match) {
      return [match[2].trim()];
    }
    return [];
  };

  // Process meaning
  const meaningRaw = kanjiItem.meaning || "";
  const meanings = typeof meaningRaw === 'string' ? meaningRaw.split(',').map(m => m.trim()) : [meaningRaw];
  
  return {
    kanji: kanjiItem.kanji,
    onyomi: extractReading(kanjiItem.onyomi),
    kunyomi: extractReading(kanjiItem.kunyomi),
    meaning: meanings,
    level: 'N2',
    type: 'general',
    usefulness: 4,
    usefulnessDescription: 'Common in upper-intermediate Japanese texts',
    examples: []
  };
};

// Combine and convert the raw JSON data to our KanjiData format
export const n2KanjiComplete: KanjiData[] = [
  ...n2KanjiPart1Raw.kanji_data.map(processKanjiData),
  ...n2KanjiPart2Raw.kanji_data.map(processKanjiData)
];
