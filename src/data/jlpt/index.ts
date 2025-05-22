import { kanji as N5Kanji } from './n5/kanji';
import { kanji as N4Kanji } from './n4/kanji';
import { kanji as N3Kanji } from './n3/kanji';
import { kanji as N2Kanji } from './n2/kanji';
import { kanji as N1Kanji } from './n1/kanji';

import { vocabulary as N5Vocabulary } from './n5/vocabulary';
import { vocabulary as N4Vocabulary } from './n4/vocabulary';
import { vocabulary as N3Vocabulary } from './n3/vocabulary';
import { vocabulary as N2Vocabulary } from './n2/vocabulary';
import { vocabulary as N1Vocabulary } from './n1/vocabulary';

import { grammar as N5Grammar } from './n5/grammar';
import { grammar as N4Grammar } from './n4/grammar';
import { grammar as N3Grammar } from './n3/grammar';
import { grammar as N2Grammar } from './n2/grammar';
import { grammar as N1Grammar } from './n1/grammar';

export {
  N5Kanji, N4Kanji, N3Kanji, N2Kanji, N1Kanji,
  N5Vocabulary, N4Vocabulary, N3Vocabulary, N2Vocabulary, N1Vocabulary,
  N5Grammar, N4Grammar, N3Grammar, N2Grammar, N1Grammar
};

export interface KanjiData {
  character: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  jlpt: number;
}

export interface VocabularyData {
  kanji?: string;
  kana: string;
  meanings: string[];
  jlpt: number;
  partOfSpeech: string;
}

export interface GrammarData {
  pattern: string;
  jlpt: number;
}

export interface JLPTData {
  kanji: {
    n5: KanjiData[];
    n4: KanjiData[];
    n3: KanjiData[];
    n2: KanjiData[];
    n1: KanjiData[];
  };
  vocabulary: {
    n5: VocabularyData[];
    n4: VocabularyData[];
    n3: VocabularyData[];
    n2: VocabularyData[];
    n1: VocabularyData[];
  };
  grammar: {
    n5: GrammarData[];
    n4: GrammarData[];
    n3: GrammarData[];
    n2: GrammarData[];
    n1: GrammarData[];
  };
}

export const JLPT_DATA: JLPTData = {
  kanji: {
    n5: N5Kanji,
    n4: N4Kanji,
    n3: N3Kanji,
    n2: N2Kanji,
    n1: N1Kanji
  },
  vocabulary: {
    n5: N5Vocabulary,
    n4: N4Vocabulary,
    n3: N3Vocabulary,
    n2: N2Vocabulary,
    n1: N1Vocabulary
  },
  grammar: {
    n5: N5Grammar,
    n4: N4Grammar,
    n3: N3Grammar,
    n2: N2Grammar,
    n1: N1Grammar
  }
};
