'use client';

import { useState, useEffect, useRef } from 'react';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import n5KanjiRaw from '@/data/n5-kanji-new.json';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';
import { Volume2 } from 'lucide-react';
import KanjiAudioPlayer from '@/components/KanjiAudioPlayer';

// Convert the kanji data to flashcard format
const kanjiFlashcards = n5KanjiComplete.map(kanji => {
  const rawKanji = n5KanjiRaw.n5_kanji.find(k => k.kanji === kanji.kanji);
  return {
    ...kanji,
    onyomi: rawKanji?.onyomi || [],
    kunyomi: rawKanji?.kunyomi || []
  };
});

type SpeedOption = {
  label: string;
  value: number;
};

const speedOptions: SpeedOption[] = [
  { label: 'Slow', value: 8 },
  { label: 'Normal', value: 6 },
  { label: 'Fast', value: 4 },
];

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...kanjiFlashcards]);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>(speedOptions[1]);
  const [loading, setLoading] = useState(false);
  const [showReadingType, setShowReadingType] = useState<'both' | 'onyomi' | 'kunyomi'>('both');
  const autoPlayTimerRef = useRef<NodeJS.Timeout>();

  const generateAudio = async (reading: string, type: 'onyomi' | 'kunyomi') => {
    try {
      setLoading(true);

      const response = await fetch('/api/test-kanji-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanji: currentCard.kanji,
          reading,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      const audio = new Audio(data.url);
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Shuffle the cards when the component mounts
  useEffect(() => {
    shuffleCards();
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);

  // Update progress when currentCardIndex changes
  useEffect(() => {
    setProgress(Math.round((currentCardIndex / shuffledCards.length) * 100));
  }, [currentCardIndex, shuffledCards.length]);

  // Handle autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      const cycleTime = selectedSpeed.value * 1000; // Total time for one card cycle
      const viewTime = cycleTime * 0.3; // 30% for viewing front
      const flipTime = cycleTime * 0.7; // 70% for viewing back and audio
      const currentCard = shuffledCards[currentCardIndex];

      // Show front of card first
      setIsFlipped(false);

      // Schedule card flip and audio
      const flipTimer = setTimeout(async () => {
        setIsFlipped(true);

        // Play audio based on reading selection with proper delays
        const playAudio = async () => {
          if (showReadingType === 'both' || showReadingType === 'onyomi') {
            if (currentCard.onyomi?.length > 0) {
              await generateAudio(currentCard.onyomi[0], 'onyomi');
              // Wait for onyomi to finish before playing kunyomi
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }
          
          if (showReadingType === 'both' || showReadingType === 'kunyomi') {
            if (currentCard.kunyomi?.length > 0) {
              await generateAudio(currentCard.kunyomi[0], 'kunyomi');
              // Wait for kunyomi to finish before moving to next card
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }
        };

        // Play audio and then schedule next card
        await playAudio();

        // Schedule next card after audio finishes
        if (currentCardIndex < shuffledCards.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
        } else {
          // End of deck
          setIsAutoPlaying(false);
          setReviewMode(true);
        }
      }, viewTime);

      return () => {
        clearTimeout(flipTimer);
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
      };
    }
  }, [isAutoPlaying, selectedSpeed.value, currentCardIndex, shuffledCards.length, showReadingType]);

  const shuffleCards = () => {
    const shuffled = [...kanjiFlashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    if (!isAutoPlaying) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // End of deck
      setIsAutoPlaying(false);
      setReviewMode(true);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const toggleAutoPlay = () => {
    if (!isAutoPlaying) {
      setIsFlipped(true); // Start by showing the back of the first card
    }
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleSpeedChange = (speed: SpeedOption) => {
    setSelectedSpeed(speed);
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 100);
    }
  };

  const markAsKnown = () => {
    const currentWord = shuffledCards[currentCardIndex];
    if (currentWord && currentWord.kanji) {
      setKnownWords([...knownWords, currentWord.kanji]);
    }
    handleNextCard();
  };

  const resetDeck = () => {
    shuffleCards();
    setKnownWords([]);
    setReviewMode(false);
    setIsAutoPlaying(false);
  };

  const currentCard = shuffledCards[currentCardIndex];

  if (reviewMode) {
    return (
      <div className={styles.container}>
        <div className={styles.reviewContainer}>
          <h1 className={styles.title}>Flashcard Session Complete!</h1>
          <div className={styles.reviewStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{shuffledCards.length}</span>
              <span className={styles.statLabel}>Total Cards</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{knownWords.length}</span>
              <span className={styles.statLabel}>Kanji Marked as Known</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{shuffledCards.length - knownWords.length}</span>
              <span className={styles.statLabel}>Words to Review</span>
            </div>
          </div>
          <div className={styles.reviewActions}>
            <button onClick={resetDeck} className={styles.primaryButton}>
              Restart Deck
            </button>
            <Link href="/n5-kanji-list" className={styles.secondaryButton}>
              Back to N5 Kanji List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${(currentCardIndex / shuffledCards.length) * 100}%` }}
        />
      </div>

      <div className={styles.flashcardHeader}>
        <h1 className={styles.title}>N5 Kanji Flashcards</h1>
        <div className={styles.controls}>
          <select
            value={showReadingType}
            onChange={(e) => setShowReadingType(e.target.value as 'both' | 'onyomi' | 'kunyomi')}
            className={`${styles.readingSelect}`}
          >
            <option value="both">Both Readings</option>
            <option value="onyomi">On'yomi Only</option>
            <option value="kunyomi">Kun'yomi Only</option>
          </select>
          <button
            onClick={toggleAutoPlay}
            className={`${styles.autoplayButton} ${isAutoPlaying ? styles.playing : ''}`}
          >
            {isAutoPlaying ? 'Pause' : 'Start'}
          </button>
          {speedOptions.map((speed) => (
            <button
              key={speed.value}
              onClick={() => handleSpeedChange(speed)}
              className={`${styles.speedButton} ${selectedSpeed.value === speed.value ? styles.selected : ''}`}
            >
              {speed.label} ({speed.value}s)
            </button>
          ))}
        </div>
      </div>

      <div 
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleCardClick}
      >
        <div className={styles.flashcardInner}>
          <div className={styles.flashcardFront}>
            <div className={styles.cardContent}>
              <div className={styles.kanji}>{currentCard.kanji}</div>
              <div className={styles.cardHint}>{isAutoPlaying ? 'Autoplay Mode' : 'Click to reveal'}</div>
            </div>
          </div>
          <div className={styles.flashcardBack}>
            <div className={styles.cardContent}>
              <div className={styles.reading}>
                {(showReadingType === 'both' || showReadingType === 'onyomi') && (
                  <div className={styles.readingRow}>
                    <div className={styles.readingLabel}>ON-YOMI</div>
                    <div className={styles.readingBoxes}>
                      {currentCard.onyomi.map((reading, index) => (
                        <button
                          key={index}
                          className={styles.onyomi}
                          onClick={(e) => {
                            e.stopPropagation();
                            generateAudio(reading, 'onyomi');
                          }}
                          disabled={loading}
                        >
                          {reading}
                          <Volume2 
                            className={styles.soundIcon}
                            size={16}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {(showReadingType === 'both' || showReadingType === 'kunyomi') && (
                  <div className={styles.readingRow}>
                    <div className={styles.readingLabel}>KUN-YOMI</div>
                    <div className={styles.readingBoxes}>
                      {currentCard.kunyomi.map((reading, index) => (
                        <button
                          key={index}
                          className={styles.kunyomi}
                          onClick={(e) => {
                            e.stopPropagation();
                            generateAudio(reading, 'kunyomi');
                          }}
                          disabled={loading}
                        >
                          {reading}
                          <Volume2 
                            className={styles.soundIcon}
                            size={16}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.meaning}>{currentCard.meaning}</div>
              <div className={styles.type}>{currentCard.type}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomControls}>
        <div className={styles.navigationControls}>
          <button 
            onClick={handlePrevCard} 
            disabled={currentCardIndex === 0 || isAutoPlaying}
            className={styles.controlButton}
          >
            Previous
          </button>
          <button 
            onClick={markAsKnown}
            disabled={isAutoPlaying}
            className={styles.knownButton}
          >
            I Know This
          </button>
          <button 
            onClick={handleNextCard}
            disabled={isAutoPlaying}
            className={styles.controlButton}
          >
            Next
          </button>
        </div>

        <div className={styles.deckControls}>
          <button onClick={resetDeck} className={styles.resetButton}>
            Reset Deck
          </button>
          <Link href="/n5-kanji-list" className={styles.backButton}>
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
