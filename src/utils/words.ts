import { Word, JlptLevel } from '@/types';
import { words } from '@/data/words';

export function getWordsByLevel(level: JlptLevel): Word[] {
  return words.filter(word => word.jlptLevel === level);
}

export function getWordById(id: string): Word | undefined {
  return words.find(word => word.id === id);
}

export function getAllLevels(): JlptLevel[] {
  return ['N5', 'N4', 'N3', 'N2', 'N1'];
}

export function getWordCount(level: JlptLevel): number {
  return words.filter(word => word.jlptLevel === level).length;
}
