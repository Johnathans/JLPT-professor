'use client';

import React, { useEffect, useState } from 'react';
import { JLPT_DATA, KanjiData, VocabularyData, GrammarData } from '@/data/jlpt';

interface LevelData {
  vocabulary: VocabularyData[];
  kanji: KanjiData[];
  grammar: GrammarData[];
}

interface JlptDataState {
  isLoading: boolean;
  data: {
    [key in 'n5' | 'n4' | 'n3' | 'n2' | 'n1']?: LevelData;
  };
}

export function useJlptData(initialLevel: 'n5' | 'n4' | 'n3' | 'n2' | 'n1') {
  const [state, setState] = useState<JlptDataState>({
    isLoading: true,
    data: {}
  });

  useEffect(() => {
    // Initialize with all data immediately since it's static
    const allData = {
      n5: {
        vocabulary: JLPT_DATA.vocabulary.n5,
        kanji: JLPT_DATA.kanji.n5,
        grammar: JLPT_DATA.grammar.n5
      },
      n4: {
        vocabulary: JLPT_DATA.vocabulary.n4,
        kanji: JLPT_DATA.kanji.n4,
        grammar: JLPT_DATA.grammar.n4
      },
      n3: {
        vocabulary: JLPT_DATA.vocabulary.n3,
        kanji: JLPT_DATA.kanji.n3,
        grammar: JLPT_DATA.grammar.n3
      },
      n2: {
        vocabulary: JLPT_DATA.vocabulary.n2,
        kanji: JLPT_DATA.kanji.n2,
        grammar: JLPT_DATA.grammar.n2
      },
      n1: {
        vocabulary: JLPT_DATA.vocabulary.n1,
        kanji: JLPT_DATA.kanji.n1,
        grammar: JLPT_DATA.grammar.n1
      }
    };

    setState({
      isLoading: false,
      data: allData
    });
  }, []); // Only run on mount

  const getLevelData = React.useCallback((level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1'): LevelData | null => {
    if (state.isLoading) return null;
    return state.data[level] || null;
  }, [state.data, state.isLoading]);

  return {
    isLoading: state.isLoading,
    getLevelData
  };
}
