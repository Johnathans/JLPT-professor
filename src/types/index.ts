export interface Example {
  japanese: string;
  romaji: string;
  english: string;
}

export interface Word {
  id: string;
  word: string;
  reading: string;
  meanings: string[];
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  examples: Example[];
}

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
