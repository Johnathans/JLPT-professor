'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';

interface Flashcard {
  id: number;
  kanji: string;
  reading: string;
  meaning: string;
  isKnown: boolean;
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  useEffect(() => {
    // Initialize flashcards from the N2 kanji data
    const initialCards = N2_KANJI.map((kanji, index) => ({
      id: index,
      kanji: kanji.kanji,
      reading: kanji.reading,
      meaning: kanji.meaning,
      isKnown: false,
    }));

    // Shuffle the cards
    const shuffledCards = [...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setIsLoading(false);
  }, []);

  // Handle card flip
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Move to the next card
  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex + 1);
      setProgress(Math.round(((currentCardIndex + 1) / cards.length) * 100));
    } else {
      // Show review screen when all cards are done
      setShowReview(true);
    }
  };

  // Move to the previous card
  const previousCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex - 1);
      setProgress(Math.round(((currentCardIndex - 1) / cards.length) * 100));
    }
  };

  // Mark the current card as known
  const markAsKnown = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].isKnown = true;
    setCards(updatedCards);
    setKnownCount(knownCount + 1);
    nextCard();
  };

  // Reset the deck and shuffle cards
  const resetDeck = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    shuffledCards.forEach(card => card.isKnown = false);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setProgress(0);
    setShowReview(false);
    setKnownCount(0);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  // Show review screen when all cards are done
  if (showReview) {
    return (
      <div className={styles.container}>
        <div className={styles.reviewContainer}>
          <h1 className={styles.title}>Review Complete!</h1>
          <div className={styles.reviewStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{cards.length}</span>
              <span className={styles.statLabel}>Total Cards</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{knownCount}</span>
              <span className={styles.statLabel}>Known Cards</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{Math.round((knownCount / cards.length) * 100)}%</span>
              <span className={styles.statLabel}>Mastery</span>
            </div>
          </div>
          <div className={styles.reviewActions}>
            <button onClick={resetDeck} className={styles.primaryButton}>
              Restart Deck
            </button>
            <Link href="/n2-kanji-list" className={styles.secondaryButton}>
              Back to N2 Kanji List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main flashcard interface
  return (
    <div className={styles.container}>
      <div className={styles.flashcardHeader}>
        <h1 className={styles.title}>N2 Kanji Flashcards</h1>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className={styles.progressText}>
            {currentCardIndex + 1} of {cards.length} cards
          </div>
        </div>
      </div>

      <div 
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} 
        onClick={flipCard}
      >
        <div className={styles.flashcardInner}>
          <div className={styles.flashcardFront}>
            <div className={styles.cardContent}>
              <div className={styles.kanji}>{cards[currentCardIndex].kanji}</div>
              <div className={styles.cardHint}>Click to reveal reading and meaning</div>
            </div>
          </div>
          <div className={styles.flashcardBack}>
            <div className={styles.cardContent}>
              <div className={styles.reading}>
                <div className={styles.readingRow}>
                  <div className={styles.readingLabel}>READINGS</div>
                  <div className={styles.readingBoxes}>
                    {cards[currentCardIndex].reading.includes('On:') && (
                      <div 
                        className={styles.onyomi}
                        dangerouslySetInnerHTML={{ 
                          __html: cards[currentCardIndex].reading
                            .split('On:')[1]
                            .split('Kun:')[0]
                            .trim() 
                        }}
                      />
                    )}
                    {cards[currentCardIndex].reading.includes('Kun:') && (
                      <div 
                        className={styles.kunyomi}
                        dangerouslySetInnerHTML={{ 
                          __html: cards[currentCardIndex].reading
                            .split('Kun:')[1]
                            .trim() 
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.meaning}>{cards[currentCardIndex].meaning}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button 
          onClick={previousCard} 
          className={`${styles.controlButton} ${currentCardIndex === 0 ? styles.disabled : ''}`}
          disabled={currentCardIndex === 0}
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
          onClick={nextCard} 
          className={styles.controlButton}
        >
          Next
        </button>
      </div>

      <div className={styles.deckControls}>
        <button onClick={resetDeck} className={styles.resetButton}>
          Reset Deck
        </button>
        <Link href="/n2-kanji-list" className={styles.backButton}>
          Back to List
        </Link>
      </div>
    </div>
  );
}
