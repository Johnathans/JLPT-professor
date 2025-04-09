export interface KanjiExample {
  japanese: string;
  hiragana: string;
  english: string;
  focus_word: string;
}

export interface KanjiData {
  id: number;
  kanji: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
  meaning: string[];
  examples: KanjiExample[];
}
