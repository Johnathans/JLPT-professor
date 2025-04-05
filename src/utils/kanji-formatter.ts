interface StandardizedKanji {
  id: number;
  kanji: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
  meaning: string[];
}

interface FormattedKanji {
  id: number;
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
}

export function formatKanjiForDisplay(kanji: StandardizedKanji, level: string): FormattedKanji {
  // Format readings as HTML
  const onyomiHtml = kanji.onyomi.map((reading, i) => 
    `<ruby>${kanji.onyomi_katakana[i]}<rt>${reading}</rt></ruby>`
  ).join('、');

  const kunyomiHtml = kanji.kunyomi.map((reading, i) => 
    `<ruby>${kanji.kunyomi_hiragana[i]}<rt>${reading}</rt></ruby>`
  ).join('、');

  // Combine readings with labels if both exist
  const readingParts = [];
  if (onyomiHtml) readingParts.push(`[音] ${onyomiHtml}`);
  if (kunyomiHtml) readingParts.push(`[訓] ${kunyomiHtml}`);
  const reading = readingParts.join(' ');

  return {
    id: kanji.id,
    kanji: kanji.kanji,
    reading,
    meaning: kanji.meaning.join(', '),
    level,
    onyomi: kanji.onyomi,
    onyomi_katakana: kanji.onyomi_katakana,
    kunyomi: kanji.kunyomi,
    kunyomi_hiragana: kanji.kunyomi_hiragana
  };
}

export function formatKanjiListForDisplay(kanjiList: StandardizedKanji[], level: string): FormattedKanji[] {
  return kanjiList.map(kanji => formatKanjiForDisplay(kanji, level));
}
