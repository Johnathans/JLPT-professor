'use client';

import { useEffect, useState } from 'react';
import styles from './kanji-grid.module.css';

const N5_SAMPLE_KANJI = [
  { kanji: '日', meaning: ['day', 'sun'], reading: 'ニチ, ひ' },
  { kanji: '月', meaning: ['month', 'moon'], reading: 'ゲツ, つき' },
  { kanji: '火', meaning: ['fire'], reading: 'カ, ひ' },
  { kanji: '水', meaning: ['water'], reading: 'スイ, みず' },
  { kanji: '木', meaning: ['tree', 'wood'], reading: 'モク, き' },
  { kanji: '金', meaning: ['gold', 'money'], reading: 'キン, かね' },
  { kanji: '土', meaning: ['earth', 'soil'], reading: 'ド, つち' },
  { kanji: '人', meaning: ['person'], reading: 'ジン, ひと' },
  { kanji: '子', meaning: ['child'], reading: 'シ, こ' },
  { kanji: '学', meaning: ['study', 'learn'], reading: 'ガク, まな.ぶ' },
  { kanji: '生', meaning: ['life', 'birth'], reading: 'セイ, い.きる' },
  { kanji: '先', meaning: ['before', 'ahead'], reading: 'セン, さき' },
  { kanji: '大', meaning: ['big', 'large'], reading: 'ダイ, おお.きい' },
  { kanji: '小', meaning: ['small', 'little'], reading: 'ショウ, ちい.さい' },
  { kanji: '上', meaning: ['up', 'above'], reading: 'ジョウ, うえ' },
  { kanji: '下', meaning: ['down', 'below'], reading: 'カ, した' }
];

export default function KanjiGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % N5_SAMPLE_KANJI.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleFlip = (index: number) => {
    setFlippedCards(current => 
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  return (
    <div className={styles.kanjiGridContainer}>
      <div className={styles.kanjiGrid}>
        {N5_SAMPLE_KANJI.map((item, index) => (
          <div
            key={item.kanji}
            className={`${styles.kanjiCell} ${index === activeIndex ? styles.active : ''} ${
              flippedCards.includes(index) ? styles.flipped : ''
            }`}
            onClick={() => toggleFlip(index)}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                {item.kanji}
              </div>
              <div className={styles.cardBack}>
                <div className={styles.meaning}>
                  {item.meaning.join(', ')}
                </div>
                <div className={styles.reading}>
                  {item.reading}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
