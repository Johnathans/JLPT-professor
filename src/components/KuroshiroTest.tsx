'use client';

import { useEffect, useState } from 'react';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import styles from '@/styles/kuroshiro.module.css';

interface Props {
  text: string;
}

interface Word {
  surface: string;
  reading: string;
  type: string;
}

export default function KuroshiroTest({ text }: Props) {
  const [words, setWords] = useState<Word[]>([]);
  const [furiganaHtml, setFuriganaHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initKuroshiro() {
      try {
        const kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer({ 
          dictPath: '/dict'
        }));
        
        // Get furigana HTML
        const furigana = await kuroshiro.convert(text, { 
          mode: "furigana",
          to: "hiragana"
        });
        
        // Get detailed analysis
        const detailed = await kuroshiro.convert(text, {
          mode: "furigana",
          to: "hiragana",
          detailed: true
        });

        // Process detailed results into words
        const processedWords = Array.isArray(detailed) ? detailed.map(token => ({
          surface: token.surface_form,
          reading: token.reading || token.surface_form,
          type: token.type || 'Other'
        })) : [];

        setWords(processedWords);
        setFuriganaHtml(furigana);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Kuroshiro:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    initKuroshiro();
  }, [text]);

  if (isLoading) {
    return <div>Loading Kuroshiro analyzer...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className={styles.sentenceContainer}>
      {/* Original sentence with furigana */}
      <div className={styles.original}>
        <div 
          className={styles.furiganaText}
          dangerouslySetInnerHTML={{ __html: furiganaHtml }} 
          title="Hover over kanji to see readings"
        />
      </div>

      {/* Word breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 uppercase">Word Breakdown</h4>
        <div className={styles.wordList}>
          {words.map((word, index) => (
            word.surface.trim() && (
              <div key={index} className={styles.wordCard}>
                <span className={styles.kanji}>{word.surface}</span>
                {word.reading !== word.surface && (
                  <span className={styles.reading}>{word.reading}</span>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
