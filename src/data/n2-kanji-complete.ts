/**
 * JLPT N2 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N2 level
 * Updated on 2025-03-29
 */

import n2KanjiPart1Raw from './n2-kanji-new-part1.json';
import n2KanjiPart2Raw from './n2-kanji-new-part2.json';

export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// Process the raw kanji data from both files
const processKanjiData = (kanjiItem: any): KanjiData => {
  // Extract onyomi and kunyomi from the string format
  const extractReading = (reading: string) => {
    if (!reading) return [];
    // Handle empty readings
    if (reading === "") return [];
    
    // Extract kana readings from format like "ryou (リョウ)" or "take (たけ)"
    const match = reading.match(/([^(]+)\s*\(([^)]+)\)/);
    if (match) {
      return [match[1].trim()];
    }
    return [reading.trim()];
  };

  // Process onyomi
  const onyomiRaw = kanjiItem.onyomi || "";
  const onyomiList = extractReading(onyomiRaw);
  
  // Process kunyomi
  const kunyomiRaw = kanjiItem.kunyomi || "";
  const kunyomiList = extractReading(kunyomiRaw);
  
  // Format readings with HTML spans
  const onyomi = onyomiList.length > 0 ? `<span class="onyomi">On: ${onyomiList.join(', ')}</span>` : '';
  const kunyomi = kunyomiList.length > 0 ? `<span class="kunyomi">Kun: ${kunyomiList.join(', ')}</span>` : '';
  const reading = [onyomi, kunyomi].filter(Boolean).join(' ');
  
  // Process meaning
  const meaningRaw = kanjiItem.meaning || "";
  const meanings = typeof meaningRaw === 'string' ? meaningRaw.split(', ') : [meaningRaw];
  
  return {
    kanji: kanjiItem.kanji,
    reading: reading || '(No reading available)',
    meaning: meanings.join(', '),
    level: 'N2'
  };
};

// Combine and convert the raw JSON data to our KanjiData format
export const n2KanjiComplete: KanjiData[] = [
  ...n2KanjiPart1Raw.kanji_data.map(processKanjiData),
  ...n2KanjiPart2Raw.kanji_data.map(processKanjiData)
];
