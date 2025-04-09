'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';
import { n2KanjiComplete } from '@/data/n2-kanji-complete';

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
    const initialCards = n2KanjiComplete.map((kanji, index) => ({
      id: index,
      kanji: kanji.kanji,
      reading: [
        kanji.onyomi.length > 0 ? `On: ${kanji.onyomi.join(', ')}` : '',
        kanji.kunyomi.length > 0 ? `Kun: ${kanji.kunyomi.join(', ')}` : ''
      ].filter(Boolean).join(' '),
      meaning: Array.isArray(kanji.meaning) 
        ? kanji.meaning.join(', ')
        : kanji.meaning,
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
      setShowReview(true);
    }
  };

  // Mark current card as known
  const markAsKnown = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].isKnown = true;
    setCards(updatedCards);
    setKnownCount(knownCount + 1);
    nextCard();
  };

  // Mark current card as unknown
  const markAsUnknown = () => {
    const updatedCards = [...cards];
    updatedCards[currentCardIndex].isKnown = false;
    setCards(updatedCards);
    nextCard();
  };

  // Reset the flashcards
  const resetCards = () => {
    const shuffledCards = [...cards]
      .map(card => ({ ...card, isKnown: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setProgress(0);
    setShowReview(false);
    setKnownCount(0);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading flashcards...</div>;
  }

  if (showReview) {
    return (
      <div className={styles.container}>
        <div className={styles.reviewContainer}>
          <h2>Review Complete!</h2>
          <p>You knew {knownCount} out of {cards.length} kanji.</p>
          <div className={styles.reviewStats}>
            <h3>Known Kanji:</h3>
            <div className={styles.knownKanji}>
              {cards
                .filter(card => card.isKnown)
                .map(card => (
                  <Link 
                    key={card.id} 
                    href={`/n2-kanji-list/${encodeURIComponent(card.kanji)}`}
                    className={styles.kanjiLink}
                  >
                    {card.kanji}
                  </Link>
                ))}
            </div>
            <h3>Need More Practice:</h3>
            <div className={styles.unknownKanji}>
              {cards
                .filter(card => !card.isKnown)
                .map(card => (
                  <Link 
                    key={card.id} 
                    href={`/n2-kanji-list/${encodeURIComponent(card.kanji)}`}
                    className={styles.kanjiLink}
                  >
                    {card.kanji}
                  </Link>
                ))}
            </div>
          </div>
          <button onClick={resetCards} className={styles.resetButton}>
            Start Over
          </button>
          <Link href="/n2-kanji-list" className={styles.backLink}>
            Back to N2 Kanji List
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/n2-kanji-list" className={styles.backLink}>
          Back to N2 Kanji List
        </Link>
        <div className={styles.progress}>
          Card {currentCardIndex + 1} of {cards.length} ({progress}%)
        </div>
      </div>

      <div 
        className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
        onClick={flipCard}
      >
        <div className={styles.front}>
          <div className={styles.kanji}>{currentCard.kanji}</div>
        </div>
        <div className={styles.back}>
          <div className={styles.reading}>{currentCard.reading}</div>
          <div className={styles.meaning}>{currentCard.meaning}</div>
        </div>
      </div>

      <div className={styles.controls}>
        <button onClick={markAsUnknown} className={styles.unknownButton}>
          Don&apos;t Know
        </button>
        <button onClick={markAsKnown} className={styles.knownButton}>
          Know It
        </button>
      </div>
    </div>
  );
}
