'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import styles from './kanji-match.module.css';

// Sample data - In production, this would come from an API
const kanjiData = [
  { kanji: '人', meaning: 'person', level: 'N5', wrong: ['入', '八', '大', '本', '木', '休'] },
  { kanji: '日', meaning: 'day, sun', level: 'N5', wrong: ['月', '目', '田', '白', '百', '早'] },
  { kanji: '山', meaning: 'mountain', level: 'N5', wrong: ['出', '川', '石', '岩', '止', '足'] },
  { kanji: '水', meaning: 'water', level: 'N5', wrong: ['永', '氷', '泳', '海', '池', '江'] },
  { kanji: '火', meaning: 'fire', level: 'N5', wrong: ['灯', '炎', '点', '熱', '災', '焼'] },
];

export default function KanjiMatch() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentQuestion < kanjiData.length) {
      const current = kanjiData[currentQuestion];
      // Get 5 random wrong answers
      const wrongOptions = current.wrong
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      // Add correct answer and shuffle
      const allOptions = [...wrongOptions, current.kanji]
        .sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    const correct = answer === kanjiData[currentQuestion].kanji;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion === kanjiData.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (showResult) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/resources" className={styles.backLink}>
            <ArrowLeft size={20} />
            Back to Resources
          </Link>
        </div>

        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Game Complete!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>Your Score</span>
            <span className={styles.scoreValue}>{score}/{kanjiData.length}</span>
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
        <Link href="/resources" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Resources
        </Link>
        <div className={styles.progress}>
          <div className={styles.progressText}>
            Question {currentQuestion + 1} of {kanjiData.length}
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${((currentQuestion + 1) / kanjiData.length) * 100}%` }}
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
            Which kanji means &quot;{kanjiData[currentQuestion].meaning}&quot;?
          </h2>
          <div className={styles.level}>
            Level: {kanjiData[currentQuestion].level}
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
