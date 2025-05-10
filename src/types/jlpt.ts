export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface JlptKanjiData {
  kanji: string;
  meaning: string;
  level: JlptLevel;
  onyomi: string[];
  kunyomi: string[];
}

export interface JlptWordData {
  kanji?: string;
  kana: string;
  meaning: string;
  level: JlptLevel;
}
