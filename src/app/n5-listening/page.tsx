import Link from 'next/link';
import styles from './listening.module.css';
import { GraduationCap, Headphones } from 'lucide-react';

interface ListeningSession {
  id: string;
  title: string;
  description: string;
  questions: number;
  estimatedTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const listeningPractices: ListeningSession[] = [
  {
    id: '1',
    title: 'Daily Life Conversations',
    description: 'Practice understanding everyday conversations about home, work, and daily activities.',
    questions: 10,
    estimatedTime: 15,
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Location and Directions',
    description: 'Learn to understand conversations about places, locations, and getting directions.',
    questions: 8,
    estimatedTime: 12,
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Time and Schedule',
    description: 'Practice understanding discussions about time, dates, and scheduling.',
    questions: 12,
    estimatedTime: 18,
    difficulty: 'Intermediate'
  }
];

export default function ListeningPractice() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <Headphones className={styles.icon} />
            N5 Listening Practice
          </h1>
          <div className={styles.levelBadge}>
            <GraduationCap size={16} />
            JLPT N5
          </div>
        </div>
        <p className={styles.description}>
          Improve your Japanese listening skills with our curated practice sessions.
          Each session focuses on common JLPT N5 topics and patterns.
        </p>
      </header>

      <section className={styles.sessions}>
        {listeningPractices.map((session) => (
          <Link 
            key={session.id}
            href={`/n5-listening/${session.id}`} 
            className={styles.sessionCard}
          >
            <div className={styles.sessionHeader}>
              <h2 className={styles.sessionTitle}>{session.title}</h2>
              <span className={`${styles.difficultyBadge} ${styles[session.difficulty.toLowerCase()]}`}>
                {session.difficulty}
              </span>
            </div>
            <p className={styles.sessionDescription}>{session.description}</p>
            <div className={styles.sessionMeta}>
              <span>{session.questions} Questions</span>
              <span>{session.estimatedTime} min</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
