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
