'use client';

import { useEffect, useState } from 'react';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import styles from '@/styles/kuroshiro.module.css';

interface Props {
  text: string;
}

export default function KanjiTooltip({ text }: Props) {
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
        
        // Convert to furigana with HTML ruby tags
        const result = await kuroshiro.convert(text, { 
          mode: "furigana",
          to: "hiragana"
        });

        setFuriganaHtml(result);
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
    return <span className="text-gray-400">Loading readings...</span>;
  }

  if (error) {
    return <span className="text-red-500">Error loading readings</span>;
  }

  return (
    <span 
      className={styles.furiganaText}
      dangerouslySetInnerHTML={{ __html: furiganaHtml }} 
      title="Hover over kanji to see readings"
    />
  );
}
