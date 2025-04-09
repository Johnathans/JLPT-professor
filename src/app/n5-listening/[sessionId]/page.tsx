'use client';

import { use } from 'react';
import Link from 'next/link';
import styles from './session.module.css';
import { ChevronLeft, Play, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  audioUrl: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

function getMockQuestion(): Question {
  return {
    id: 1,
    audioUrl: '/audio/n5-listening-1.mp3',
    questionText: 'What is the woman asking about?',
    options: [
      'The time of the meeting',
      'The location of the office',
      'When the man will arrive',
      'If the man has finished his work'
    ],
    correctAnswer: 2
  };
}

type Props = {
  params: Promise<{ sessionId: string }>;
}

export default function ListeningSession({ params }: Props) {
  const resolvedParams = use(params);
  const mockQuestion = getMockQuestion();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/n5-listening" className={styles.backButton}>
              <ChevronLeft size={24} />
              <span>Back to Lessons</span>
            </Link>
          </div>
          
          <div className={styles.headerCenter}>
            <h1 className={styles.title}>Listening Practice</h1>
            <div className={styles.sessionInfo}>
              <span className={styles.sessionId}>Session {resolvedParams.sessionId}</span>
              <span className={styles.divider}>•</span>
              <span className={styles.questionCount}>Question 1 of 5</span>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <Link href="/n5-learning-path" className={styles.pathButton}>
              <GraduationCap size={20} />
              <span>Learning Path</span>
            </Link>
          </div>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '20%' }}></div>
          </div>

          <main className={styles.questionArea}>
            <div className={styles.audioPlayer}>
              <button className={styles.playButton}>
                <Play size={32} />
              </button>
            </div>

            <div className={styles.questionCard}>
              <h2 className={styles.question}>{mockQuestion.questionText}</h2>

              <div className={styles.options}>
                {mockQuestion.options.map((option, index) => (
                  <button key={index} className={styles.optionButton}>
                    <span className={styles.optionLabel}>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
