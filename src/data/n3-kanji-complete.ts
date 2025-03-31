/**
 * JLPT N3 Kanji Data (Complete)
 * This file contains kanji categorized as JLPT N3 level
 * Updated on 2025-03-29
 */

import n3KanjiRaw from './n3-kanji-new.json';

export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// Convert the raw JSON data to our KanjiData format
export const n3KanjiComplete: KanjiData[] = n3KanjiRaw.n3_kanji.map(k => {
  const onyomi = k.onyomi.length > 0 ? `<span class="onyomi">On: ${k.onyomi.join(', ')}</span>` : '';
  const kunyomi = k.kunyomi.length > 0 ? `<span class="kunyomi">Kun: ${k.kunyomi.join(', ')}</span>` : '';
  const reading = [onyomi, kunyomi].filter(Boolean).join(' ');
  
  return {
    kanji: k.kanji,
    reading: reading || '(No reading available)',
    meaning: k.meaning.join(', '),
    level: 'N3'
  };
});
