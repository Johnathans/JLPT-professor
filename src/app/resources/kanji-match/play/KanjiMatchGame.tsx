'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../kanji-match.module.css';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';
import { n3KanjiComplete } from '@/data/n3-kanji-complete';
import { n2KanjiComplete } from '@/data/n2-kanji-complete';
import { KanjiData } from '@/types/word';

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to get meaning from kanji data
function getFirstMeaning(kanji: KanjiData): string {
  if (Array.isArray(kanji.meaning)) {
    return kanji.meaning[0];
  }
  if (typeof kanji.meaning === 'string') {
    return kanji.meaning.split(',')[0].trim();
  }
  return 'Unknown';
}

const KANJI_SETS = {
  'N5': n5KanjiComplete,
  'N4': n4KanjiComplete,
  'N3': n3KanjiComplete,
  'N2': n2KanjiComplete,
} as const;

const DEFAULT_COUNT = 10;
const MIN_COUNT = 5;
const MAX_COUNT = 25;

export default function KanjiMatchGame() {
  const searchParams = useSearchParams();
  const level = searchParams.get('level') || 'N5';
  const count = Math.min(
    Math.max(
      Number(searchParams.get('count')) || DEFAULT_COUNT,
      MIN_COUNT
    ),
    MAX_COUNT
  );
  const kanjiSet = KANJI_SETS[level as keyof typeof KANJI_SETS];

  const [gameKanji] = useState(() => 
    shuffleArray(kanjiSet).slice(0, count).map(k => ({
      kanji: k.kanji,
      meaning: getFirstMeaning(k),
      level: k.level,
    }))
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentQuestion < gameKanji.length) {
      const current = gameKanji[currentQuestion];
      // Get 5 random wrong answers from the same level
      const otherKanji = kanjiSet
        .filter(k => k.kanji !== current.kanji)
        .map(k => k.kanji);
      const wrongOptions = shuffleArray(otherKanji).slice(0, 5);
      // Add correct answer and shuffle
      const allOptions = [...wrongOptions, current.kanji]
        .sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  }, [currentQuestion, gameKanji, kanjiSet]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    const correct = answer === gameKanji[currentQuestion].kanji;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion === gameKanji.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const restartGame = () => {
    window.location.reload(); // Reload to get new random kanji
  };

  if (showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/resources/kanji-match" className={styles.backLink}>
            <ArrowLeft size={20} />
            Back to Game Menu
          </Link>
        </div>

        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Game Complete!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>Your Score</span>
            <span className={styles.scoreValue}>{score}/{gameKanji.length}</span>
          </div>
          <button onClick={restartGame} className={styles.restartButton}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/resources/kanji-match" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Game Menu
        </Link>
        <div className={styles.progress}>
          <div className={styles.progressText}>
            Question {currentQuestion + 1} of {gameKanji.length}
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentQuestion + 1) / gameKanji.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={styles.score}>
          Score: {score}
        </div>
      </div>

      <div className={styles.gameContent}>
        <div className={styles.question}>
          <h2 className={styles.meaning}>
            Which kanji means &quot;{gameKanji[currentQuestion].meaning}&quot;?
          </h2>
          <div className={styles.level}>
            Level: {level}
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`${styles.optionCard} ${
                selectedAnswer === option
                  ? isCorrect
                    ? styles.correct
                    : styles.incorrect
                  : ''
              }`}
              disabled={selectedAnswer !== null}
            >
              {option}
              {selectedAnswer === option && (
                <div className={styles.resultIcon}>
                  {isCorrect ? (
                    <Check className={styles.checkIcon} />
                  ) : (
                    <X className={styles.xIcon} />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
