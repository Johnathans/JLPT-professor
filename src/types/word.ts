export interface ExampleSentence {
  japanese: string;
  romaji?: string;
  english: string;
}

export interface KanjiInfo {
  kanji: string;
  meaning: string;
  onReading: string[];
  kunReading: string[];
  strokeCount: number;
}

export interface KanjiData {
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meaning: string | string[];
  level: string;
  type: string;
  usefulness?: number;
  usefulnessDescription?: string;
  examples?: ExampleSentence[];
  id?: number;
  onyomi_katakana?: string[];
  kunyomi_hiragana?: string[];
}

export interface Word {
  id?: string;
  romaji?: string;
  kana: string;
  kanji?: string;
  meaning: string;
  type: string;
  examples?: ExampleSentence[];
  kanjiInfo?: KanjiInfo[];
  notes?: string[];
  antonyms?: string[];
  synonyms?: string[];
  commonCollocations?: string[];
}
