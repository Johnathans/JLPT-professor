import Link from 'next/link';
import styles from './session.module.css';
import { ChevronLeft, Play, GraduationCap } from 'lucide-react';

interface Question {
  id: number;
  type: 'true-false' | 'multiple-choice';
  question: string;
  options?: { id: string; text: string }[];
  audioUrl: string;
}

// This would come from your database/API
const mockQuestion: Question = {
  id: 1,
  type: 'multiple-choice',
  question: 'What is the woman talking about?',
  options: [
    { id: 'A', text: 'Her hometown' },
    { id: 'B', text: 'Where she currently lives' },
    { id: 'C', text: 'A place she visited' },
    { id: 'D', text: 'Where she wants to go' }
  ],
  audioUrl: '/audio/listening/sample.mp3'
};

export default function ListeningSession({ params }: { params: { sessionId: string } }) {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <aside>
            <header className={styles.sessionHeader}>
              <Link href="/n5-listening" className={styles.backLink}>
                <ChevronLeft size={20} />
                Back to Listening Practice
              </Link>
              
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>1/3</span>
                  <span className={styles.statLabel}>Plays</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>0.75×</span>
                  <span className={styles.statLabel}>Speed</span>
                </div>
              </div>

              <div className={styles.levelBadge}>
                <GraduationCap size={16} />
                JLPT N5
              </div>
            </header>
          </aside>

          <main className={styles.questionArea}>
            <div className={styles.audioPlayer}>
              <button className={styles.playButton}>
                <Play size={32} />
              </button>
            </div>

            <div className={styles.questionCard}>
              <h2 className={styles.question}>{mockQuestion.question}</h2>

              <div className={styles.options}>
                {mockQuestion.options?.map((option) => (
                  <button key={option.id} className={styles.optionButton}>
                    <span className={styles.optionLabel}>{option.id}</span>
                    {option.text}
                  </button>
                ))}
              </div>

              <div className={styles.controls}>
                <button className={styles.controlButton}>
                  Replay Audio
                </button>
                <button className={styles.controlButton}>
                  Show Text
                </button>
              </div>

              <div className={styles.actionButtons}>
                <button className={styles.skipButton}>
                  Skip
                </button>
                <button className={styles.submitButton}>
                  Submit
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
