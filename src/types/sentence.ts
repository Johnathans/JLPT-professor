export interface SentenceEntry {
  id: string;
  japanese: string;
  english: string;
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
  associatedKanji: string[];
  tags: string[];
  audioUrl?: string;
}

export interface WordEntry {
  word: string;
  reading?: string;
  meaning?: string;
}
