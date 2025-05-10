import { N5_KANJI } from './n5-kanji';
import { N4_KANJI } from './n4-kanji';
import { N3_KANJI } from './n3-kanji';
import { N2_KANJI } from './n2-kanji';
import { N1_KANJI } from './n1-kanji';

export type KanjiData = {
  kanji: string;
  meanings: readonly string[];
  onyomi: readonly string[];
  kunyomi: readonly string[];
  info: {
    readonly grade: number;
    readonly jlpt: number;
    readonly strokeCount: number;
    readonly unicode: string;
    readonly examples?: readonly string[];
  };
};

export type JLPTKanjiData = {
  n5: KanjiData[];
  n4: KanjiData[];
  n3: KanjiData[];
  n2: KanjiData[];
  n1: KanjiData[];
};

export const KANJI_DATA: JLPTKanjiData = {
  n5: Array.from(N5_KANJI),
  n4: Array.from(N4_KANJI),
  n3: Array.from(N3_KANJI),
  n2: Array.from(N2_KANJI),
  n1: Array.from(N1_KANJI),
};

export type JLPTLevel = keyof JLPTKanjiData;
