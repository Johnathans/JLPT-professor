'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import n5KanjiRaw from '@/data/n5-kanji-new.json';
import styles from '@/styles/flashcards.module.css';
import Link from 'next/link';
import { Volume2, GraduationCap, Clock, BarChart, Loader2, Pause, Play, ChevronLeft, Settings } from 'lucide-react';
import KanjiAudioPlayer from '@/components/KanjiAudioPlayer';
import type { Database } from '@/lib/database.types';

interface KanjiFlashcard {
  id?: string;
  kanji: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  srs_level?: number;
  next_review?: string | null;
  correct_count: number;
  incorrect_count: number;
}

type SpeedOption = {
  label: string;
  value: number;
};

const speedOptions: SpeedOption[] = [
  { label: 'Slow', value: 8 },
  { label: 'Normal', value: 6 },
  { label: 'Fast', value: 4 },
];

// Convert first 10 kanji for demo mode
const demoCards = n5KanjiRaw.n5_kanji.slice(0, 10).map(k => ({
  kanji: k.kanji,
  meaning: Array.isArray(k.meaning) ? k.meaning.join(', ') : k.meaning,
  onyomi: k.onyomi,
  kunyomi: k.kunyomi.map((k: string) => k.replace(/\(.*?\)/g, '')),
  srs_level: 0,
  next_review: null,
  correct_count: 0,
  incorrect_count: 0
}));

export default function FlashcardsPage() {
  const supabase = createClientComponentClient<Database>();
  const [session, setSession] = useState<any>(null);
  const [cards, setCards] = useState<KanjiFlashcard[]>([]);
  const [dueCards, setDueCards] = useState<KanjiFlashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>(speedOptions[1]);
  const [loading, setLoading] = useState(true);
  const [showReadingType, setShowReadingType] = useState<'both' | 'onyomi' | 'kunyomi'>('both');
  const [stats, setStats] = useState({
    totalCards: 0,
    dueToday: 0,
    averageAccuracy: 0,
  });
  const [isDemo, setIsDemo] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);
  const audioBufferRef = useRef<AudioBuffer | undefined>(undefined);
  const [audioCache, setAudioCache] = useState<Record<string, HTMLAudioElement>>({});
  const successAudioRef = useRef<HTMLAudioElement | undefined>(undefined);

  // Initialize audio after mount
  useEffect(() => {
    successAudioRef.current = new Audio('/audio/ui/correct.mp3');
  }, []);

  // Load flashcards and initialize SRS system
  useEffect(() => {
    const initializeFlashcards = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Set demo cards for non-authenticated users
          setCards(demoCards);
          setDueCards(demoCards);
          setStats({
            totalCards: demoCards.length,
            dueToday: demoCards.length,
            averageAccuracy: 0,
          });
          setLoading(false);
          return;
        }

        setIsDemo(false);

        // Get existing flashcards for authenticated users
        const { data: existingCards, error: fetchError } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('level', 'N5');

        if (fetchError) {
          throw new Error('Failed to fetch flashcards');
        }

        if (!existingCards || existingCards.length === 0) {
          // Initialize flashcards for new users
          const newCards = n5KanjiComplete.map(kanji => {
            const rawKanji = n5KanjiRaw.n5_kanji.find(k => k.kanji === kanji.kanji);
            return {
              user_id: session.user.id,
              item_id: kanji.kanji,
              item_type: 'kanji',
              level: 'N5',
              srs_level: 0,
              next_review: new Date().toISOString(),
              correct_count: 0,
              incorrect_count: 0,
              created_at: new Date().toISOString(),
              is_known: false
            };
          });

          const { data: insertedCards, error: insertError } = await supabase
            .from('flashcards')
            .insert(newCards)
            .select();

          if (insertError) {
            throw new Error('Failed to initialize flashcards');
          }

          if (insertedCards) {
            setCards(insertedCards);
            updateDueCards(insertedCards);
          }
        } else {
          setCards(existingCards);
          updateDueCards(existingCards);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        // Fallback to demo mode on error
        setCards(demoCards);
        setDueCards(demoCards);
        setStats({
          totalCards: demoCards.length,
          dueToday: demoCards.length,
          averageAccuracy: 0,
        });
        setLoading(false);
      }
    };

    initializeFlashcards();
  }, []);

  const updateDueCards = (allCards: KanjiFlashcard[]) => {
    const now = new Date();
    const due = allCards.filter(card => 
      card.next_review && new Date(card.next_review) <= now
    ).sort((a, b) => 
      new Date(a.next_review!).getTime() - new Date(b.next_review!).getTime()
    );
    
    setDueCards(due);
    setStats({
      totalCards: allCards.length,
      dueToday: due.length,
      averageAccuracy: calculateAverageAccuracy(allCards),
    });
  };

  const calculateAverageAccuracy = (cards: KanjiFlashcard[]) => {
    const totalReviews = cards.reduce((acc, card) => 
      acc + card.correct_count + card.incorrect_count, 0
    );
    const totalCorrect = cards.reduce((acc, card) => acc + card.correct_count, 0);
    return totalReviews === 0 ? 0 : Math.round((totalCorrect / totalReviews) * 100);
  };

  const moveToNextCard = () => {
    // First play the success sound
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(console.error);
    }
    
    // Then flip back
    setIsFlipped(false);
    
    // Finally move to next card after flip animation
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % dueCards.length);
    }, 200);
  };

  const handleReviewResult = async (isCorrect: boolean) => {
    // If it's correct, always move to next card with sound
    if (isCorrect) {
      // Update review status in Supabase
      if (!isDemo) {
        if (!supabase || !session) {
          setShowSignInModal(true);
          return;
        }

        const { error } = await supabase
          .from('kanji_reviews')
          .insert({
            user_id: session.user.id,
            kanji: dueCards[currentCardIndex].kanji,
            correct: isCorrect,
          });

        if (error) {
          console.error('Error saving review:', error);
        }
      }

      // Move to next card with success sound
      moveToNextCard();
      return;
    }

    // If it's incorrect and not flipped, flip it first
    if (!isFlipped) {
      setIsFlipped(true);
      return;
    }

    // If it's incorrect and flipped, just flip back
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const generateAudio = async (reading: string, type: 'onyomi' | 'kunyomi') => {
    const cacheKey = `${dueCards[currentCardIndex].kanji}_${type}_${reading}`;
    
    try {
      // If we have cached audio, play it
      if (audioCache[cacheKey]) {
        audioCache[cacheKey].currentTime = 0;
        audioCache[cacheKey].play().catch(console.error);
        return;
      }

      setLoading(true);

      const response = await fetch('/api/test-kanji-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanji: dueCards[currentCardIndex].kanji,
          reading,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      const audio = new Audio(data.url);
      
      // Cache the audio element
      setAudioCache(prev => ({
        ...prev,
        [cacheKey]: audio
      }));
      
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Preload audio for current card
  useEffect(() => {
    const currentCard = dueCards[currentCardIndex];
    if (!currentCard) return;

    const preloadAudio = async (reading: string, type: 'onyomi' | 'kunyomi') => {
      const cacheKey = `${currentCard.kanji}_${type}_${reading}`;
      if (audioCache[cacheKey]) return;

      try {
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

        if (!response.ok) return;

        const data = await response.json();
        const audio = new Audio(data.url);
        
        setAudioCache(prev => ({
          ...prev,
          [cacheKey]: audio
        }));
      } catch (error) {
        console.error('Failed to preload audio:', error);
      }
    };

    // Preload all readings
    currentCard.onyomi.forEach(reading => preloadAudio(reading, 'onyomi'));
    currentCard.kunyomi.forEach(reading => preloadAudio(reading, 'kunyomi'));
  }, [currentCardIndex, dueCards]);

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
    setProgress(Math.round((currentCardIndex / dueCards.length) * 100));
  }, [currentCardIndex, dueCards.length]);

  // Handle autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      const cycleTime = selectedSpeed.value * 1000; // Total time for one card cycle
      const viewTime = cycleTime * 0.3; // 30% for viewing front
      const flipTime = cycleTime * 0.7; // 70% for viewing back and audio
      const currentCard = dueCards[currentCardIndex];

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
        if (currentCardIndex < dueCards.length - 1) {
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
  }, [isAutoPlaying, selectedSpeed.value, currentCardIndex, dueCards.length, showReadingType]);

  const shuffleCards = () => {
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setDueCards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (currentCardIndex < dueCards.length - 1) {
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
    const currentWord = dueCards[currentCardIndex];
    if (currentWord && currentWord.kanji) {
      handleReviewResult(true);
    }
  };

  const resetDeck = () => {
    shuffleCards();
    setReviewMode(false);
    setIsAutoPlaying(false);
  };

  // Show sign in modal after 10th card
  useEffect(() => {
    if (isDemo && currentCardIndex === 9) {
      setShowSignInModal(true);
    }
  }, [isDemo, currentCardIndex]);

  useEffect(() => {
    // Initialize audio context and load sound
    const loadSound = async () => {
      try {
        audioContextRef.current = new AudioContext();
        const response = await fetch('/audio/ui/correct.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };
    loadSound();
  }, []);

  const playCorrectSound = async () => {
    if (!audioContextRef.current || !audioBufferRef.current) return;
    
    try {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  if (reviewMode) {
    return (
      <div className={styles.container}>
        <div className={styles.reviewContainer}>
          <h1 className={styles.title}>Flashcard Session Complete!</h1>
          <div className={styles.reviewStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.totalCards}</span>
              <span className={styles.statLabel}>Total Cards</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.dueToday}</span>
              <span className={styles.statLabel}>Due Today</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.averageAccuracy}%</span>
              <span className={styles.statLabel}>Average Accuracy</span>
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loader} size={32} />
          <p>Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (!dueCards[currentCardIndex]) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyContainer}>
          <h1 className={styles.title}>No Flashcards Available</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <Link href="/n5-kanji-list" className={styles.backButton}>
            <ChevronLeft size={16} />
            Back
          </Link>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.totalCards - stats.dueToday}</span>
              <span className={styles.statLabel}>Learning</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.dueToday}</span>
              <span className={styles.statLabel}>To Review</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.averageAccuracy}%</span>
              <span className={styles.statLabel}>Mastered</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.flashcardSection}>
          <div className={styles.flashcardContainer}>
            <div 
              className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`} 
              onClick={handleCardClick}
            >
              <div className={styles.flashcardFront}>
                <div className={styles.kanji}>{dueCards[currentCardIndex].kanji}</div>
                <div className={styles.hint}>Click to reveal meaning</div>
              </div>
              <div className={styles.flashcardBack}>
                <div className={styles.meaning}>{dueCards[currentCardIndex].meaning}</div>
                <div className={styles.readings}>
                  {showReadingType !== 'kunyomi' && dueCards[currentCardIndex].onyomi.length > 0 && (
                    <div className={styles.readingGroup}>
                      <div className={styles.readingLabel}>ON-YOMI</div>
                      <div className={styles.readingList}>
                        {dueCards[currentCardIndex].onyomi.map((reading, index) => (
                          <button
                            type="button"
                            key={index}
                            className={styles.reading}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              generateAudio(reading, 'onyomi');
                            }}
                          >
                            {reading}
                            <Volume2 size={18} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {showReadingType !== 'onyomi' && dueCards[currentCardIndex].kunyomi.length > 0 && (
                    <div className={styles.readingGroup}>
                      <div className={styles.readingLabel}>KUN-YOMI</div>
                      <div className={styles.readingList}>
                        {dueCards[currentCardIndex].kunyomi.map((reading, index) => (
                          <button
                            type="button"
                            key={index}
                            className={styles.reading}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              generateAudio(reading, 'kunyomi');
                            }}
                          >
                            {reading}
                            <Volume2 size={18} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.answerButtons} onClick={(e) => e.stopPropagation()}>
            <button 
              className={`${styles.reviewButton} ${styles.incorrectButton}`}
              onClick={() => handleReviewResult(false)}
            >
              Keep Studying This One
            </button>
            <button 
              className={`${styles.reviewButton} ${styles.correctButton}`}
              onClick={() => handleReviewResult(true)}
            >
              I Know This
            </button>
          </div>

          <div className={styles.flashcardSettings}>
            <div className={styles.settingsHeader}>
              <Settings size={16} />
              <span className={styles.settingsTitle}>Flashcard Settings</span>
            </div>
            <div className={styles.settingsDescription}>
              Choose which readings to display when reviewing kanji
            </div>
            <div className={styles.readingButtons}>
              <button
                className={`${styles.readingButton} ${showReadingType === 'both' ? styles.active : ''}`}
                onClick={() => setShowReadingType('both')}
              >
                Both Readings
              </button>
              <button
                className={`${styles.readingButton} ${showReadingType === 'onyomi' ? styles.active : ''}`}
                onClick={() => setShowReadingType('onyomi')}
              >
                On Reading
              </button>
              <button
                className={`${styles.readingButton} ${showReadingType === 'kunyomi' ? styles.active : ''}`}
                onClick={() => setShowReadingType('kunyomi')}
              >
                Kun Reading
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSignInModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Ready to Learn More?</h2>
            <p>Sign in to access all {n5KanjiComplete.length} kanji and track your progress!</p>
            <div className={styles.modalButtons}>
              <Link href="/login" className={styles.primaryButton}>Sign In</Link>
              <Link href="/signup" className={styles.secondaryButton}>Create Account</Link>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setShowSignInModal(false)}
            >
              Continue in Demo Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
