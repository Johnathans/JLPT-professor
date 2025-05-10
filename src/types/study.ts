export type StudyMode = 'vocabulary' | 'sentences' | 'kanji-meaning' | 'kanji-onyomi' | 'kanji-kunyomi' | 'kanji-match';
export type JlptLevel = 'n1' | 'n2' | 'n3' | 'n4' | 'n5';

// Interface for vocabulary items
export interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  jlptLevel: string;
  partOfSpeech: string;
  frequencyRank: number;
  tags: string[];
}

// Interface for kanji items
export interface KanjiItem {
  id: string;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  info: {
    grade: number;
    jlpt: number;
    strokeCount: number;
  };
}
