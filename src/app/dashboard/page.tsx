'use client';

import { useState } from 'react';
import styles from './dashboard.module.css';
import { GraduationCap, Book, Headphones, PenTool, Target, Clock } from 'lucide-react';

interface StudyProgress {
  stories: number;
  vocabulary: number;
  kanji: number;
  listening: number;
  grammar: number;
}

const mockProgress: Record<string, StudyProgress> = {
  n5: {
    stories: 65,
    vocabulary: 45,
    kanji: 30,
    listening: 55,
    grammar: 40,
  },
  n4: {
    stories: 25,
    vocabulary: 15,
    kanji: 10,
    listening: 20,
    grammar: 5,
  },
  n3: {
    stories: 0,
    vocabulary: 0,
    kanji: 0,
    listening: 0,
    grammar: 0,
  },
  n2: {
    stories: 0,
    vocabulary: 0,
    kanji: 0,
    listening: 0,
    grammar: 0,
  },
  n1: {
    stories: 0,
    vocabulary: 0,
    kanji: 0,
    listening: 0,
    grammar: 0,
  },
};

export default function Dashboard() {
  const [activeLevel, setActiveLevel] = useState('n5');
  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Your Progress</h1>
            <p className={styles.subtitle}>Track your JLPT journey</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <Clock size={20} />
              <span>23h studied</span>
            </div>
            <div className={styles.stat}>
              <Target size={20} />
              <span>5 day streak</span>
            </div>
          </div>
        </header>

        <nav className={styles.levelNav}>
          {['n5', 'n4', 'n3', 'n2', 'n1'].map((level) => (
            <button
              key={level}
              className={`${styles.levelButton} ${activeLevel === level ? styles.active : ''}`}
              onClick={() => setActiveLevel(level)}
            >
              <div className={styles.levelIcon}>
                <GraduationCap size={16} />
              </div>
              {level.toUpperCase()}
            </button>
          ))}
        </nav>

        <main className={styles.mainContent}>
          <div className={styles.progressOverview}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewHeader}>
                <h2 className={styles.overviewTitle}>
                  {activeLevel.toUpperCase()} Progress Overview
                </h2>
                <div className={styles.overviewStats}>
                  <div className={styles.overviewStat}>
                    <div className={styles.overviewStatValue}>
                      {Object.values(mockProgress[activeLevel]).reduce((a, b) => a + b, 0) / 5}%
                    </div>
                    <div className={styles.overviewStatLabel}>Overall Progress</div>
                  </div>
                  <div className={styles.overviewStat}>
                    <div className={styles.overviewStatValue}>342</div>
                    <div className={styles.overviewStatLabel}>Items Mastered</div>
                  </div>
                </div>
              </div>

              <div className={styles.skillGrid}>
                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <Book size={20} />
                    <h3>Stories</h3>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillFill} 
                        style={{ width: `${mockProgress[activeLevel].stories}%` }}
                      />
                    </div>
                    <span>{mockProgress[activeLevel].stories}%</span>
                  </div>
                  <p className={styles.skillDetail}>12 of 20 stories completed</p>
                </div>

                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <Book size={20} />
                    <h3>Vocabulary</h3>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillFill} 
                        style={{ width: `${mockProgress[activeLevel].vocabulary}%` }}
                      />
                    </div>
                    <span>{mockProgress[activeLevel].vocabulary}%</span>
                  </div>
                  <p className={styles.skillDetail}>450 of 1000 words mastered</p>
                </div>

                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <PenTool size={20} />
                    <h3>Kanji</h3>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillFill} 
                        style={{ width: `${mockProgress[activeLevel].kanji}%` }}
                      />
                    </div>
                    <span>{mockProgress[activeLevel].kanji}%</span>
                  </div>
                  <p className={styles.skillDetail}>30 of 100 kanji mastered</p>
                </div>

                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <Headphones size={20} />
                    <h3>Listening</h3>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillFill} 
                        style={{ width: `${mockProgress[activeLevel].listening}%` }}
                      />
                    </div>
                    <span>{mockProgress[activeLevel].listening}%</span>
                  </div>
                  <p className={styles.skillDetail}>11 of 20 sessions completed</p>
                </div>

                <div className={styles.skillCard}>
                  <div className={styles.skillHeader}>
                    <Book size={20} />
                    <h3>Grammar</h3>
                  </div>
                  <div className={styles.skillProgress}>
                    <div className={styles.skillBar}>
                      <div 
                        className={styles.skillFill} 
                        style={{ width: `${mockProgress[activeLevel].grammar}%` }}
                      />
                    </div>
                    <span>{mockProgress[activeLevel].grammar}%</span>
                  </div>
                  <p className={styles.skillDetail}>20 of 50 grammar points mastered</p>
                </div>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h2 className={styles.activityTitle}>Recent Activity</h2>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityMeta}>
                    <div className={styles.activityIcon}>
                      <Headphones size={16} />
                    </div>
                    <div>
                      <h3>Completed Listening Practice</h3>
                      <time>2 hours ago</time>
                    </div>
                  </div>
                  <p>Scored 8/10 on "Daily Life Conversations"</p>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityMeta}>
                    <div className={styles.activityIcon}>
                      <Book size={16} />
                    </div>
                    <div>
                      <h3>Read Story</h3>
                      <time>Yesterday</time>
                    </div>
                  </div>
                  <p>Completed "A Day at the Park" with 90% comprehension</p>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityMeta}>
                    <div className={styles.activityIcon}>
                      <PenTool size={16} />
                    </div>
                    <div>
                      <h3>Kanji Practice</h3>
                      <time>2 days ago</time>
                    </div>
                  </div>
                  <p>Mastered 5 new kanji characters</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
