'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/kuroshiro.module.css';

interface Props {
  text: string;
}

export default function KanjiTooltip({ text }: Props) {
  const [furiganaHtml, setFuriganaHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initKuroshiro() {
      try {
        // Dynamically import Kuroshiro only on client side
        const [Kuroshiro, KuromojiAnalyzer] = await Promise.all([
          import('kuroshiro').then(m => m.default),
          import('kuroshiro-analyzer-kuromoji').then(m => m.default)
        ]);

        const kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer({ 
          dictPath: '/dict'  // This path should be relative to the public directory
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
        // Fallback to plain text if there's an error
        setFuriganaHtml(text);
        setIsLoading(false);
      }
    }

    initKuroshiro();
  }, [text]);

  if (isLoading) {
    return <span className="text-gray-400">{text}</span>;
  }

  return (
    <span 
      className={styles.furiganaText}
      dangerouslySetInnerHTML={{ __html: furiganaHtml }} 
      title="Hover over kanji to see readings"
    />
  );
}
