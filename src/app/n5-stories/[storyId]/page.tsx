'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Volume2, BookOpen, GraduationCap, Play, Pause } from 'lucide-react';
import { Modal } from '@/components/Modal';
import storiesData from '@/data/n5-stories.json';
import styles from './story.module.css';

interface StoryStats {
  n5_words: number;
  n5_kanji: number;
  estimated_time: number;
  sentences?: number;
}

interface ParagraphAudioState {
  isPlaying: boolean;
  audioUrl?: string;
  audio?: HTMLAudioElement;
}

export default function StoryPage() {
  const params = useParams();
  const story = storiesData.stories.find(s => s.id === params.storyId);
  const [showFurigana, setShowFurigana] = useState<Record<number, boolean>>({});
  const [showRomaji, setShowRomaji] = useState<Record<number, boolean>>({});
  const [showEnglish, setShowEnglish] = useState<Record<number, boolean>>({});
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [paragraphAudioStates, setParagraphAudioStates] = useState<{ [key: number]: ParagraphAudioState }>({});

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

  const toggleFurigana = (index: number) => {
    setShowFurigana(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleRomaji = (index: number) => {
    setShowRomaji(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleEnglish = (index: number) => {
    setShowEnglish(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const showVocabulary = (index: number) => {
    setCurrentParagraphIndex(index);
    setIsVocabModalOpen(true);
  };

  const playAudio = async (paragraphIndex: number, text: string) => {
    let audioState = paragraphAudioStates[paragraphIndex];

    // If we don't have audio yet, generate it
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
            paragraphId: paragraphIndex,
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
        setParagraphAudioStates(prev => ({
          ...prev,
          [paragraphIndex]: audioState,
        }));
      } catch (error) {
        console.error('Error generating audio:', error);
        return;
      }
    }

    // Play or pause the audio
    if (audioState.isPlaying) {
      audioState.audio?.pause();
      setParagraphAudioStates(prev => ({
        ...prev,
        [paragraphIndex]: { ...audioState, isPlaying: false },
      }));
    } else {
      // Pause all other playing audio
      Object.entries(paragraphAudioStates).forEach(([idx, state]) => {
        if (state.isPlaying && state.audio) {
          state.audio.pause();
          setParagraphAudioStates(prev => ({
            ...prev,
            [idx]: { ...state, isPlaying: false },
          }));
        }
      });

      // Play the selected audio
      audioState.audio?.play();
      setParagraphAudioStates(prev => ({
        ...prev,
        [paragraphIndex]: { ...audioState, isPlaying: true },
      }));

      // Add ended event listener
      audioState.audio?.addEventListener('ended', () => {
        setParagraphAudioStates(prev => ({
          ...prev,
          [paragraphIndex]: { ...audioState, isPlaying: false },
        }));
      });
    }
  };

  const getParagraphText = (paragraph: any) => {
    return paragraph.segments.map((segment: any) => segment.text).join('');
  };

  const getParagraphFurigana = (paragraph: any) => {
    return paragraph.segments.map((segment: any) => {
      if (segment.isKanji) {
        return segment.reading;
      }
      return segment.text;
    }).join('');
  };

  const renderParagraph = (paragraph: any, index: number) => {
    const audioState = paragraphAudioStates[index] || { isPlaying: false };

    return (
      <div key={index} className={styles.paragraph}>
        <div className={styles.japaneseText}>
          {paragraph.segments.map((segment: any, segIndex: number) => (
            <span key={segIndex} className={segment.isKanji ? styles.kanji : ''}>
              {segment.text}
            </span>
          ))}
        </div>

        <div className={styles.toolsSection}>
          <div className={styles.toolsGroup}>
            <h3 className={styles.toolsTitle}>Reading Aids</h3>
            <div className={styles.controls}>
              <button 
                className={`${styles.controlButton} ${showFurigana[index] ? styles.active : ''}`}
                onClick={() => toggleFurigana(index)}
              >
                Furigana
              </button>
              <button 
                className={`${styles.controlButton} ${showRomaji[index] ? styles.active : ''}`}
                onClick={() => toggleRomaji(index)}
              >
                Romaji
              </button>
              <button 
                className={`${styles.controlButton} ${showEnglish[index] ? styles.active : ''}`}
                onClick={() => toggleEnglish(index)}
              >
                English
              </button>
            </div>
          </div>

          <div className={styles.toolsGroup}>
            <h3 className={styles.toolsTitle}>Study Tools</h3>
            <div className={styles.controls}>
              <button 
                className={`${styles.controlButton} ${styles.playButton} ${audioState.isPlaying ? styles.active : ''}`}
                onClick={() => playAudio(index, getParagraphText(paragraph))}
              >
                {audioState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {audioState.isPlaying ? 'Pause' : 'Play'}
              </button>
              <button 
                className={styles.controlButton}
                onClick={() => showVocabulary(index)}
              >
                <GraduationCap size={16} />
                Vocabulary
              </button>
            </div>
          </div>
        </div>

        {showFurigana[index] && (
          <div className={styles.furiganaText}>
            {getParagraphFurigana(paragraph)}
          </div>
        )}

        {showRomaji[index] && (
          <div className={styles.romajiText}>
            {/* Add romaji conversion logic here */}
          </div>
        )}

        {showEnglish[index] && (
          <div className={styles.englishText}>
            {paragraph.translation}
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
            Back to Stories
          </Link>
          <div className={styles.levelBadge}>
            <GraduationCap size={16} />
            JLPT N5
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        <aside>
          <header className={styles.storyHeader}>
            <h1 className={styles.storyTitle}>{story.title}</h1>
            <p className={styles.subtitle}>{story.titleTranslation}</p>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{story.stats.n5_words}</span>
                <span className={styles.statLabel}>N5 Words</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{story.stats.n5_kanji}</span>
                <span className={styles.statLabel}>N5 Kanji</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>
                  {(story.stats as StoryStats).sentences || '-'}
                </span>
                <span className={styles.statLabel}>Sentences</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{story.stats.estimated_time}m</span>
                <span className={styles.statLabel}>Est. Time</span>
              </div>
            </div>

            <div className={styles.storyActions}>
              <button className={`${styles.storyAction} ${styles.playFullStory}`}>
                <Play size={16} />
                Play Full Story
              </button>
              <button className={`${styles.storyAction} ${styles.viewFlashcards}`}>
                <GraduationCap size={16} />
                View Flashcards
              </button>
            </div>
          </header>
        </aside>

        <div className={styles.mainArea}>
          {story.content
            .filter(p => p.type === 'paragraph')
            .map((paragraph, index) => renderParagraph(paragraph, index))}
        </div>
      </div>

      <Modal isOpen={isVocabModalOpen} onClose={() => setIsVocabModalOpen(false)}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Vocabulary</h2>
          <ul className={styles.vocabularyList}>
            {story.vocabulary.n5_words.map((word: any, index: number) => (
              <li key={index} className={styles.vocabularyItem}>
                <span className={styles.word}>{word.word}</span>
                <span className={styles.reading}>{word.reading}</span>
                <span className={styles.meaning}>{word.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}
