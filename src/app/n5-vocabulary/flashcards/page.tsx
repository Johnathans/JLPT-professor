'use client';

import { useState, useEffect } from 'react';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';

// Convert the vocabulary data to flashcard format
const vocabFlashcards = n5VocabularyCombined.map(word => ({
  romaji: word.romaji,
  kana: word.kana,
  kanji: word.kanji,
  meaning: word.meaning,
  type: 'Vocabulary (N5)'
}));

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...vocabFlashcards]);
  const [knownWords, setKnownWords] = useState<string[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [progress, setProgress] = useState(0);

  // Shuffle the cards when the component mounts
  useEffect(() => {
    shuffleCards();
  }, []);

  // Update progress when currentCardIndex changes
  useEffect(() => {
    setProgress(Math.round((currentCardIndex / shuffledCards.length) * 100));
  }, [currentCardIndex, shuffledCards.length]);

  const shuffleCards = () => {
    const shuffled = [...vocabFlashcards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // End of deck
      setReviewMode(true);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const markAsKnown = () => {
    const currentWord = shuffledCards[currentCardIndex];
    if (currentWord && currentWord.kana) {
      setKnownWords([...knownWords, currentWord.kana]);
    }
    handleNextCard();
  };

  const resetDeck = () => {
    shuffleCards();
    setKnownWords([]);
    setReviewMode(false);
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
              <span className={styles.statLabel}>Words Marked as Known</span>
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
            <Link href="/n5-vocabulary" className={styles.secondaryButton}>
              Back to N5 Vocabulary List
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
        <h1 className={styles.title}>N5 Vocabulary Flashcards</h1>
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
              <div className={styles.kana}>{currentCard.kana}</div>
              {currentCard.kanji && (
                <div className={styles.kanji}>{currentCard.kanji}</div>
              )}
              <div className={styles.cardHint}>Click to reveal</div>
            </div>
          </div>
          <div className={styles.flashcardBack}>
            <div className={styles.cardContent}>
              <div className={styles.reading}>
                <div className={styles.readingRow}>
                  <div className={styles.readingLabel}>READING</div>
                  <div className={styles.readingBoxes}>
                    <div className={styles.romaji}>{currentCard.romaji}</div>
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
          disabled={currentCardIndex === 0}
          className={styles.controlButton}
        >
          Previous
        </button>
        <button 
          onClick={markAsKnown}
          className={styles.knownButton}
        >
          I Know This
        </button>
        <button 
          onClick={handleNextCard}
          className={styles.controlButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
