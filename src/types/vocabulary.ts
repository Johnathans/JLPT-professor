export interface Word {
  word: string;
  reading: string;
  meaning: string;
  sentence?: string;
  sentenceReading?: string;
  sentenceMeaning?: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}
