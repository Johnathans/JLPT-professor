export interface Point {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface Stroke {
  points: Point[];
}

export interface KanjiDetails {
  character: string;
  meaning: string;
  reading: string;
  strokes: Stroke[];
  error?: string;
}

export type StrokeDirection = 'horizontal' | 'vertical' | 'diagonal';

export interface StrokeGuide {
  startPoint: Point;
  endPoint: Point;
  direction: StrokeDirection;
}

export interface KanjiExample {
  japanese: string;
  hiragana?: string;
  romaji?: string;
  english: string;
  focus_word: string;
}

export interface CompoundWord {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}

export interface KanjiData {
  id: number;
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
  onyomi: readonly string[];
  onyomi_katakana: readonly string[];
  kunyomi: readonly string[];
  kunyomi_hiragana: readonly string[];
  examples: readonly KanjiExample[];
  compounds: readonly (CompoundWord & { correct: boolean })[];
}

export interface KanjiQuestion extends KanjiData {
  correct: boolean;
}
