export interface KanjiExample {
  japanese: string;
  hiragana: string;
  english: string;
  focus_word: string;
}

export interface KanjiData {
  id: number;
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
  examples: KanjiExample[];
}

export interface CompoundWord {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}

export interface KanjiQuestion extends KanjiData {
  compounds: (CompoundWord & { correct: boolean })[];
}
