'use client';

import { useState, useEffect } from 'react';
import { N3_KANJI } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';

// Convert the kanji data to flashcard format
const kanjiFlashcards = N3_KANJI.map(kanji => {
  const onyomiText = kanji.onyomi?.length > 0 ? `On: ${kanji.onyomi.join(', ')}` : '';
  const kunyomiText = kanji.kunyomi?.length > 0 ? `Kun: ${kanji.kunyomi.join(', ')}` : '';
  const readingText = [onyomiText, kunyomiText].filter(Boolean).join(' ');
  
  return {
    kanji: kanji.kanji,
    kana: readingText,
    meaning: Array.isArray(kanji.meaning) ? kanji.meaning.join(', ') : kanji.meaning,
    type: 'Kanji (N3)'
  };
});

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([...kanjiFlashcards]);
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
    const shuffled = [...kanjiFlashcards].sort(() => Math.random() - 0.5);
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
    if (currentWord && currentWord.kanji) {
      setKnownWords([...knownWords, currentWord.kanji]);
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
              <span className={styles.statLabel}>Kanji Marked as Known</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{shuffledCards.length - knownWords.length}</span>
              <span className={styles.statLabel}>Kanji to Review</span>
            </div>
          </div>
          <div className={styles.reviewActions}>
            <button onClick={resetDeck} className={styles.primaryButton}>
              Restart Deck
            </button>
            <Link href="/n3-kanji-list" className={styles.secondaryButton}>
              Back to N3 Kanji List
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
        <h1 className={styles.title}>N3 Kanji Flashcards</h1>
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
              <div className={styles.cardHint}>Click to reveal</div>
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

      <div className={styles.deckControls}>
        <button onClick={resetDeck} className={styles.resetButton}>
          Reset Deck
        </button>
        <Link href="/n3-kanji-list" className={styles.backButton}>
          Back to List
        </Link>
      </div>
    </div>
  );
}
