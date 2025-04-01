'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Question, TestSection, TestProgress, TestResult } from '@/types/test';
import styles from './test.module.css';

interface Props {
  params: {
    level: string;
  };
}

export default function TestPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [sections, setSections] = useState<TestSection[]>([]);
  const [progress, setProgress] = useState<TestProgress>({
    currentSection: 0,
    currentQuestion: 0,
    answers: {},
    timeRemaining: 0,
    isComplete: false,
  });
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  // Load test data based on level
  useEffect(() => {
    const loadTest = async () => {
      try {
        // In a real app, this would fetch from an API
        const testData = await import(`@/data/tests/${resolvedParams.level}.json`);
        const sections = testData.default.sections || [];
        
        if (sections.length === 0) {
          throw new Error('No test sections found');
        }

        setSections(sections);
        setProgress(prev => ({
          ...prev,
          timeRemaining: sections[0]?.timeLimit * 60 || 120 * 60 // Default to 120 minutes
        }));
        setLoading(false);
      } catch (error) {
        console.error('Failed to load test:', error);
        setLoading(false);
      }
    };
    loadTest();
  }, [resolvedParams.level]);

  // Timer logic
  useEffect(() => {
    if (!showInstructions && !progress.isComplete && progress.timeRemaining > 0) {
      const timer = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showInstructions, progress.isComplete, progress.timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (progress.timeRemaining <= 0 && !progress.isComplete) {
      handleSubmitTest();
    }
  }, [progress.timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleNextQuestion = () => {
    const currentSection = sections[progress.currentSection];
    if (progress.currentQuestion < currentSection.questions.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    } else if (progress.currentSection < sections.length - 1) {
      setProgress(prev => ({
        ...prev,
        currentSection: prev.currentSection + 1,
        currentQuestion: 0
      }));
    }
  };

  const handlePrevQuestion = () => {
    if (progress.currentQuestion > 0) {
      setProgress(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    } else if (progress.currentSection > 0) {
      setProgress(prev => ({
        ...prev,
        currentSection: prev.currentSection - 1,
        currentQuestion: sections[prev.currentSection - 1].questions.length - 1
      }));
    }
  };

  const handleSubmitTest = useCallback(() => {
    if (!sections.length) return;

    const results: TestResult = {
      totalQuestions: 0,
      correctAnswers: 0,
      score: 0,
      sectionScores: {},
      timeSpent: 0,
      answers: progress.answers
    };

    sections.forEach(section => {
      let sectionCorrect = 0;
      section.questions.forEach(question => {
        results.totalQuestions++;
        const userAnswer = progress.answers[question.id];
        if (Array.isArray(question.correctAnswer)) {
          if (Array.isArray(userAnswer) && 
              question.correctAnswer.every(ans => userAnswer.includes(ans))) {
            sectionCorrect++;
            results.correctAnswers++;
          }
        } else if (userAnswer === question.correctAnswer) {
          sectionCorrect++;
          results.correctAnswers++;
        }
      });
      results.sectionScores[section.id] = (sectionCorrect / section.questions.length) * 100;
    });

    results.score = (results.correctAnswers / results.totalQuestions) * 100;
    // Calculate time spent safely
    const totalTimeLimit = sections[0]?.timeLimit || 120; // Default to 120 minutes if not set
    results.timeSpent = totalTimeLimit * 60 - progress.timeRemaining;

    setResult(results);
    setProgress(prev => ({ ...prev, isComplete: true }));
  }, [sections, progress.answers, progress.timeRemaining]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading test...</p>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className={styles.container}>
        <div className={styles.instructionsCard}>
          <h1>JLPT {resolvedParams.level.toUpperCase()} Practice Test</h1>
          <div className={styles.testInfo}>
            <div className={styles.infoItem}>
              <span>Sections:</span>
              <strong>{sections.length}</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Questions:</span>
              <strong>
                {sections.reduce((total, section) => total + section.questions.length, 0)}
              </strong>
            </div>
            <div className={styles.infoItem}>
              <span>Time Limit:</span>
              <strong>{sections[0].timeLimit} minutes</strong>
            </div>
          </div>

          <div className={styles.sectionsList}>
            {sections.map((section, index) => (
              <div key={section.id} className={styles.sectionItem}>
                <h3>{section.title}</h3>
                <p>{section.instructions}</p>
                <div className={styles.sectionMeta}>
                  <span>{section.questions.length} questions</span>
                  <span>{section.timeLimit} minutes</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.instructions}>
            <h2>Test Instructions</h2>
            <ul>
              <li>Answer all questions within the time limit</li>
              <li>You can navigate between questions using the previous/next buttons</li>
              <li>Mark questions for review if you want to come back to them</li>
              <li>Submit your test before the time runs out</li>
              <li>You&apos;re doing great! Keep going!</li>
            </ul>
          </div>

          <button 
            className={styles.startButton}
            onClick={() => setShowInstructions(false)}
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (progress.isComplete && result) {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <h1>Test Results</h1>
          <div className={styles.scoreOverview}>
            <div className={styles.scoreCircle}>
              <svg viewBox="0 0 36 36" className={styles.scoreChart}>
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e8e3ff"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#7c4dff"
                  strokeWidth="3"
                  strokeDasharray={`${result.score}, 100`}
                />
                <text x="18" y="20.35" className={styles.scoreText}>
                  {Math.round(result.score)}%
                </text>
              </svg>
            </div>
            <div className={styles.scoreDetails}>
              <div className={styles.scoreItem}>
                <span>Correct Answers:</span>
                <strong>{result.correctAnswers} / {result.totalQuestions}</strong>
              </div>
              <div className={styles.scoreItem}>
                <span>Time Spent:</span>
                <strong>{formatTime(result.timeSpent)}</strong>
              </div>
            </div>
          </div>

          <div className={styles.sectionScores}>
            <h2>Section Scores</h2>
            {sections.map(section => (
              <div key={section.id} className={styles.sectionScore}>
                <span>{section.title}</span>
                <div className={styles.scoreBar}>
                  <div 
                    className={styles.scoreProgress}
                    style={{ width: `${result.sectionScores[section.id]}%` }}
                  />
                </div>
                <strong>{Math.round(result.sectionScores[section.id])}%</strong>
              </div>
            ))}
          </div>

          <div className={styles.resultActions}>
            <button
              className={styles.reviewButton}
              onClick={() => router.push(`/practice-test/${resolvedParams.level}/review`)}
            >
              Review Answers
            </button>
            <button
              className={styles.newTestButton}
              onClick={() => router.push('/practice-test')}
            >
              Take Another Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = sections[progress.currentSection];
  const currentQuestion = currentSection.questions[progress.currentQuestion];

  return (
    <div className={styles.container}>
      <div className={styles.testHeader}>
        <div className={styles.progress}>
          <span>Section {progress.currentSection + 1}/{sections.length}</span>
          <span>Question {progress.currentQuestion + 1}/{currentSection.questions.length}</span>
        </div>
        <div className={styles.timer}>
          Time Remaining: {formatTime(progress.timeRemaining)}
        </div>
      </div>

      <div className={styles.questionCard}>
        <h2>{currentSection.title}</h2>
        <div className={styles.question}>
          <p className={styles.questionText}>{currentQuestion.text}</p>
          
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className={styles.options}>
              {currentQuestion.options.map((option, index) => (
                <label key={index} className={styles.option}>
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={progress.answers[currentQuestion.id] === option}
                    onChange={() => handleAnswer(currentQuestion.id, option)}
                  />
                  <span className={styles.optionText}>{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill-in' && (
            <input
              type="text"
              className={styles.fillInInput}
              value={progress.answers[currentQuestion.id] as string || ''}
              onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
            />
          )}
        </div>

        <div className={styles.navigation}>
          <button
            className={styles.navButton}
            onClick={handlePrevQuestion}
            disabled={progress.currentSection === 0 && progress.currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className={styles.navButton}
            onClick={handleNextQuestion}
            disabled={
              progress.currentSection === sections.length - 1 &&
              progress.currentQuestion === currentSection.questions.length - 1
            }
          >
            Next
          </button>
        </div>

        {progress.currentSection === sections.length - 1 &&
         progress.currentQuestion === currentSection.questions.length - 1 && (
          <button
            className={styles.submitButton}
            onClick={handleSubmitTest}
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}
