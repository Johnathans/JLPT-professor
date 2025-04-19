'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Volume2, BookOpen, GraduationCap, Play, Pause, MoreHorizontal } from 'lucide-react';
import { Modal } from '@/components/Modal';
import storiesData from '@/data/n5-stories.json';
import styles from './story.module.css';

interface StoryStats {
  n5_words: number;
  n5_kanji: number;
  estimated_time: number;
  sentences?: number;
}

interface SentenceAudioState {
  isPlaying: boolean;
  audioUrl?: string;
  audio?: HTMLAudioElement;
}

interface Sentence {
  segments: {
    text: string;
    isKanji: boolean;
    reading?: string;
  }[];
  translation: string;
}

export default function StoryPage() {
  const params = useParams();
  const story = storiesData.stories.find(s => s.id === params.storyId);
  const [showFurigana, setShowFurigana] = useState<Record<string, boolean>>({});
  const [showTools, setShowTools] = useState<Record<string, boolean>>({});
  const [audioStates, setAudioStates] = useState<{ [key: string]: SentenceAudioState }>({});

  if (!story) {
    return (
      <div className={styles.pageWrapper}>
        <nav className={styles.nav}>
          <div className={styles.contentWrapper}>
            <Link href="/n5-stories" className={styles.backLink}>
              <ChevronLeft size={20} />
              Stories
            </Link>
          </div>
        </nav>
        <div className={styles.contentWrapper}>
          <h1>Story not found</h1>
        </div>
      </div>
    );
  }

  const toggleFurigana = (sentenceId: string) => {
    setShowFurigana(prev => ({ ...prev, [sentenceId]: !prev[sentenceId] }));
  };

  const toggleTools = (sentenceId: string) => {
    setShowTools(prev => {
      const newState = { ...prev };
      // Close all other tool popovers
      Object.keys(newState).forEach(key => {
        if (key !== sentenceId) newState[key] = false;
      });
      newState[sentenceId] = !prev[sentenceId];
      return newState;
    });
  };

  const playAudio = async (sentenceId: string, text: string) => {
    let audioState = audioStates[sentenceId];

    if (!audioState?.audioUrl) {
      try {
        const response = await fetch('/api/story-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            storyId: params.storyId,
            sentenceId,
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const audio = new Audio(data.url);
        audioState = {
          isPlaying: false,
          audioUrl: data.url,
          audio,
        };
        setAudioStates(prev => ({
          ...prev,
          [sentenceId]: audioState,
        }));
      } catch (error) {
        console.error('Error generating audio:', error);
        return;
      }
    }

    if (audioState.isPlaying) {
      audioState.audio?.pause();
      setAudioStates(prev => ({
        ...prev,
        [sentenceId]: { ...audioState, isPlaying: false },
      }));
    } else {
      Object.entries(audioStates).forEach(([id, state]) => {
        if (state.isPlaying && state.audio) {
          state.audio.pause();
          setAudioStates(prev => ({
            ...prev,
            [id]: { ...state, isPlaying: false },
          }));
        }
      });

      audioState.audio?.play();
      setAudioStates(prev => ({
        ...prev,
        [sentenceId]: { ...audioState, isPlaying: true },
      }));

      audioState.audio?.addEventListener('ended', () => {
        setAudioStates(prev => ({
          ...prev,
          [sentenceId]: { ...audioState, isPlaying: false },
        }));
      });
    }
  };

  const renderSentence = (sentence: Sentence, index: number) => {
    const sentenceId = `${params.storyId}-${index}`;
    const audioState = audioStates[sentenceId] || { isPlaying: false };

    return (
      <div key={index} className={styles.sentence}>
        <button 
          className={styles.playButton}
          onClick={() => playAudio(sentenceId, sentence.segments.map(s => s.text).join(''))}
        >
          {audioState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <div className={styles.japaneseText}>
          {sentence.segments.map((segment, segIndex) => (
            <span key={segIndex} className={segment.isKanji ? styles.kanji : ''}>
              {segment.isKanji && showFurigana[sentenceId] && (
                <span className={styles.furigana}>{segment.reading}</span>
              )}
              {segment.text}
            </span>
          ))}
        </div>

        <button 
          className={styles.toolsButton}
          onClick={() => toggleTools(sentenceId)}
        >
          <MoreHorizontal size={16} />
        </button>

        {showTools[sentenceId] && (
          <div className={styles.toolsPopover}>
            <button className={styles.toolButton} onClick={() => toggleFurigana(sentenceId)}>
              <BookOpen size={16} />
              {showFurigana[sentenceId] ? 'Hide' : 'Show'} Furigana
            </button>
            <button className={styles.toolButton}>
              <GraduationCap size={16} />
              Add to Flashcards
            </button>
            <div className={styles.flashcardOptions}>
              <button className={`${styles.flashcardOption} ${styles.hard}`}>Hard</button>
              <button className={`${styles.flashcardOption} ${styles.good}`}>Good</button>
              <button className={`${styles.flashcardOption} ${styles.easy}`}>Easy</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <nav className={styles.nav}>
        <div className={styles.contentWrapper}>
          <Link href="/n5-stories" className={styles.backLink}>
            <ChevronLeft size={20} />
            Stories
          </Link>
          <div className={styles.levelBadge}>
            <GraduationCap size={16} />
            JLPT N5
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <aside className={styles.storyHeader}>
          <h1 className={styles.storyTitle}>{story.title}</h1>
          <p className={styles.subtitle}>{story.subtitle}</p>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{story.stats.n5_words}</span>
              <span className={styles.statLabel}>N5 Words</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{story.stats.n5_kanji}</span>
              <span className={styles.statLabel}>N5 Kanji</span>
            </div>
          </div>

          <div className={styles.storyActions}>
            <button className={`${styles.storyAction} ${styles.playFullStory}`}>
              <Volume2 size={16} />
              Play Full Story
            </button>
            <button className={`${styles.storyAction} ${styles.viewFlashcards}`}>
              <BookOpen size={16} />
              View Flashcards
            </button>
          </div>
        </aside>

        <main className={styles.mainArea}>
          {story.paragraphs.map((paragraph, index) => (
            <div key={index} className={styles.paragraph}>
              {paragraph.sentences.map((sentence, sIndex) => 
                renderSentence(sentence, index * 100 + sIndex)
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
