export interface Example {
  japanese: string;
  reading?: string;
  romaji?: string;
  english?: string;
  meaning?: string;
}

export interface Word {
  id?: string;
  word?: string;
  romaji?: string;
  kana: string;
  kanji?: string;
  meaning: string;
  type: string;
  partOfSpeech?: string;
  examples?: Example[];
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface VocabularyData {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  jlptLevel: string;
  partOfSpeech: string;
  frequencyRank: number;
  tags: string[];
}
