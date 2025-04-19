'use client';

import { useState } from 'react';
import styles from '@/styles/kanji-list.module.css';

interface KanjiAudioPlayerProps {
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
}

export default function KanjiAudioPlayer({ kanji, onyomi, kunyomi }: KanjiAudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = async (reading: string, type: 'onyomi' | 'kunyomi') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/test-kanji-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanji,
          reading,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();

      // Create and play audio
      const audio = new Audio(data.url);
      await audio.play();
    } catch (err) {
      setError('Error playing audio');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.audioPlayerContainer}>
      <h3>Readings</h3>
      <div className={styles.readingSection}>
        {onyomi.length > 0 && (
          <div className={styles.readingGroup}>
            <h4>On'yomi (音読み)</h4>
            <div className={styles.readingButtons}>
              {onyomi.map((reading, index) => (
                <button
                  key={`onyomi-${reading}-${index}`}
                  onClick={() => generateAudio(reading, 'onyomi')}
                  disabled={loading}
                  className={styles.audioButton}
                >
                  {reading}
                  <span className={styles.playIcon}>▶</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {kunyomi.length > 0 && (
          <div className={styles.readingGroup}>
            <h4>Kun'yomi (訓読み)</h4>
            <div className={styles.readingButtons}>
              {kunyomi.map((reading, index) => (
                <button
                  key={`kunyomi-${reading}-${index}`}
                  onClick={() => generateAudio(reading, 'kunyomi')}
                  disabled={loading}
                  className={styles.audioButton}
                >
                  {reading}
                  <span className={styles.playIcon}>▶</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <div className={styles.audioError}>{error}</div>}
    </div>
  );
}
