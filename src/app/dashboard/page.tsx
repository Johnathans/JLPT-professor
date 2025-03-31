'use client';

import { useState } from 'react';
import styles from './dashboard.module.css';

interface StudyProgress {
  n5: {
    kanji: number;
    vocabulary: number;
    grammar: number;
  };
  n4: {
    kanji: number;
    vocabulary: number;
    grammar: number;
  };
  n3: {
    kanji: number;
    vocabulary: number;
    grammar: number;
  };
  n2: {
    kanji: number;
    vocabulary: number;
    grammar: number;
  };
  n1: {
    kanji: number;
    vocabulary: number;
    grammar: number;
  };
}

export default function Dashboard() {
  const [activeLevel, setActiveLevel] = useState('n5');
  
  // Mock data - this will be replaced with real data from an API/database
  const progress: StudyProgress = {
    n5: { kanji: 75, vocabulary: 60, grammar: 45 },
    n4: { kanji: 40, vocabulary: 35, grammar: 30 },
    n3: { kanji: 25, vocabulary: 20, grammar: 15 },
    n2: { kanji: 10, vocabulary: 8, grammar: 5 },
    n1: { kanji: 5, vocabulary: 3, grammar: 2 }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header Section */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.welcomeTitle}>Welcome Back!</h1>
        <p className={styles.welcomeSubtitle}>Track your progress and continue your JLPT journey</p>
        <div className="row g-4">
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div className={styles.statsNumber}>23</div>
              <p className={styles.statsLabel}>Study Hours This Month</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div className={styles.statsNumber}>5</div>
              <p className={styles.statsLabel}>Day Streak</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={styles.statsCard}>
              <div className={styles.statsNumber}>342</div>
              <p className={styles.statsLabel}>Items Mastered</p>
            </div>
          </div>
        </div>
      </div>

      {/* JLPT Level Tabs */}
      <div className={styles.levelTabs}>
        {['n5', 'n4', 'n3', 'n2', 'n1'].map((level) => (
          <button
            key={level}
            className={`${styles.levelTab} ${activeLevel === level ? styles.levelTabActive : ''}`}
            onClick={() => setActiveLevel(level)}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Progress Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className={styles.progressCard}>
            <h5 className={styles.progressTitle}>Kanji Progress</h5>
            <div className={styles.progressBar}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${progress[activeLevel as keyof StudyProgress].kanji}%`
                }}
                role="progressbar"
                aria-valuenow={progress[activeLevel as keyof StudyProgress].kanji}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress[activeLevel as keyof StudyProgress].kanji}%
              </div>
            </div>
            <p>Master the essential kanji for {activeLevel.toUpperCase()}</p>
            <a href={`/${activeLevel}-kanji-list`} className={styles.continueButton}>
              Continue Learning
            </a>
          </div>
        </div>

        <div className="col-md-4">
          <div className={styles.progressCard}>
            <h5 className={styles.progressTitle}>Vocabulary Progress</h5>
            <div className={styles.progressBar}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${progress[activeLevel as keyof StudyProgress].vocabulary}%`
                }}
                role="progressbar"
                aria-valuenow={progress[activeLevel as keyof StudyProgress].vocabulary}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress[activeLevel as keyof StudyProgress].vocabulary}%
              </div>
            </div>
            <p>Build your {activeLevel.toUpperCase()} vocabulary knowledge</p>
            <a href={`/${activeLevel}-vocabulary`} className={styles.continueButton}>
              Continue Learning
            </a>
          </div>
        </div>

        <div className="col-md-4">
          <div className={styles.progressCard}>
            <h5 className={styles.progressTitle}>Grammar Progress</h5>
            <div className={styles.progressBar}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${progress[activeLevel as keyof StudyProgress].grammar}%`
                }}
                role="progressbar"
                aria-valuenow={progress[activeLevel as keyof StudyProgress].grammar}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress[activeLevel as keyof StudyProgress].grammar}%
              </div>
            </div>
            <p>Master {activeLevel.toUpperCase()} grammar patterns</p>
            <a href={`/${activeLevel}-grammar`} className={styles.continueButton}>
              Continue Learning
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.activityList}>
        <h2 className="mb-4">Recent Activity</h2>
        <div className={styles.activityItem}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">Completed N5 Kanji Lesson</h5>
            <span className={styles.activityTime}>3 hours ago</span>
          </div>
          <p className="mb-0">Mastered 5 new kanji characters</p>
        </div>
        <div className={styles.activityItem}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">Vocabulary Quiz</h5>
            <span className={styles.activityTime}>Yesterday</span>
          </div>
          <p className="mb-0">Scored 85% on N5 vocabulary quiz</p>
        </div>
        <div className={styles.activityItem}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-1">Grammar Practice</h5>
            <span className={styles.activityTime}>2 days ago</span>
          </div>
          <p className="mb-0">Completed basic particles exercise</p>
        </div>
      </div>
    </div>
  );
}
