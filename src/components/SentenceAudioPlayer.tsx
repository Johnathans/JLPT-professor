'use client';

import { useState } from 'react';
import styles from '@/styles/kanji-list.module.css';

interface SentenceAudioPlayerProps {
  text: string;
}

export default function SentenceAudioPlayer({ text }: SentenceAudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAudio = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sentence-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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
    <button
      onClick={generateAudio}
      disabled={loading}
      className={styles.audioButton}
      title="Play sentence"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
