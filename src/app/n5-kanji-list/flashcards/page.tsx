'use client';

import { useState, useEffect, useRef } from 'react';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';

// Convert the kanji data to flashcard format
const kanjiFlashcards = n5KanjiComplete.map(kanji => ({
  kanji: kanji.kanji,
  kana: kanji.reading,
  meaning: kanji.meaning,
  type: 'Kanji (N5)'
}));

type SpeedOption = {
  label: string;
  value: number; // seconds per card
};

const speedOptions: SpeedOption[] = [
  { label: 'Very Slow (10s)', value: 10 },
  { label: 'Slow (7s)', value: 7 },
  { label: 'Normal (5s)', value: 5 },
  { label: 'Fast (3s)', value: 3 },
  { label: 'Very Fast (2s)', value: 2 }
];

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...kanjiFlashcards]);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>(speedOptions[2]); // Default to Normal
  const autoPlayTimerRef = useRef<NodeJS.Timeout>();

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
      // Show front of card
      setIsFlipped(false);

      const cycleCard = () => {
        // Show back of card
        setIsFlipped(true);

        // Wait and then move to next card
        setTimeout(() => {
          if (currentCardIndex < shuffledCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipped(false);
          } else {
            // End of deck
            setIsAutoPlaying(false);
            setReviewMode(true);
          }
        }, selectedSpeed.value * 1000); // Show back for full time
      };

      // Start the cycle after showing front for full time
      autoPlayTimerRef.current = setTimeout(cycleCard, selectedSpeed.value * 1000);

      return () => {
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
      };
    }
  }, [isAutoPlaying, selectedSpeed.value, currentCardIndex, shuffledCards.length]);

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
    setIsAutoPlaying(!isAutoPlaying);
    setIsFlipped(false);
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
      <div className={styles.flashcardHeader}>
        <h1 className={styles.title}>N5 Kanji Flashcards</h1>
        <div className={styles.autoplayControls}>
          <div className={styles.speedSelector}>
            {speedOptions.map((speed) => (
              <button
                key={speed.value}
                onClick={() => handleSpeedChange(speed)}
                className={`${styles.speedButton} ${
                  selectedSpeed.value === speed.value ? styles.speedButtonActive : ''
                }`}
                disabled={isAutoPlaying}
              >
                {speed.label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleAutoPlay}
            className={`${styles.autoplayButton} ${isAutoPlaying ? styles.autoplayActive : ''}`}
          >
            {isAutoPlaying ? 'Stop' : 'Start'} Autoplay
          </button>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>
            {currentCardIndex + 1} / {shuffledCards.length}
          </div>
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
                <div className={styles.readingRow}>
                  <div className={styles.readingLabel}>READINGS</div>
                  <div className={styles.readingBoxes}>
                    {currentCard.kana.includes('On:') && (
                      <div 
                        className={styles.onyomi}
                        dangerouslySetInnerHTML={{ 
                          __html: currentCard.kana
                            .split('On:')[1]
                            .split('Kun:')[0]
                            .trim() 
                        }}
                      />
                    )}
                    {currentCard.kana.includes('Kun:') && (
                      <div 
                        className={styles.kunyomi}
                        dangerouslySetInnerHTML={{ 
                          __html: currentCard.kana
                            .split('Kun:')[1]
                            .trim() 
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.meaning}>{currentCard.meaning}</div>
              <div className={styles.type}>{currentCard.type}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
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
  );
}
