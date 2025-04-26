import { useState, useEffect } from 'react';
import { kanjiService } from '@/services/kanji-service';
import type { KanjiDetails } from '@/types/kanji';

// N5 kanji data with proper stroke order
const N5_KANJI_LIST = [
  {
    character: '日',
    meaning: 'day, sun',
    reading: 'ひ (hi), にち (nichi)',
  },
  {
    character: '月',
    meaning: 'month, moon',
    reading: 'つき (tsuki), げつ (getsu)',
  },
  {
    character: '火',
    meaning: 'fire',
    reading: 'ひ (hi), か (ka)',
  },
  {
    character: '水',
    meaning: 'water',
    reading: 'みず (mizu), すい (sui)',
  },
  {
    character: '木',
    meaning: 'tree, wood',
    reading: 'き (ki), もく (moku)',
  }
];

export function useKanji() {
  const [kanji, setKanji] = useState<KanjiDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKanjiData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load stroke data for each kanji
        const kanjiWithStrokes = await Promise.all(
          N5_KANJI_LIST.map(async (k) => {
            try {
              const data = await kanjiService.getKanjiData(k.character);
              return {
                ...k,
                ...data,
              };
            } catch (err) {
              console.error(`Error loading kanji ${k.character}:`, err);
              return {
                ...k,
                strokes: [],
                error: err instanceof Error ? err.message : 'Failed to load stroke data'
              };
            }
          })
        );

        // Filter out any kanji that failed to load
        const validKanji = kanjiWithStrokes.filter(k => k.strokes && k.strokes.length > 0);

        if (validKanji.length === 0) {
          throw new Error('No valid kanji data could be loaded');
        }

        // Shuffle the kanji array for practice
        setKanji(validKanji.sort(() => Math.random() - 0.5));
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading kanji data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load kanji data');
        setIsLoading(false);
      }
    };

    loadKanjiData();
  }, []);

  return { kanji, isLoading, error };
}
