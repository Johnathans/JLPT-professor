'use client';

import { useState } from 'react';
import studyGuideData from '@/data/jlpt-study-guide.json';
import styles from './study-guide.module.css';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

type ContentCategory = {
  section: string;
  points: string[];
};

type ExamSection = {
  title: string;
  timeLimit: string;
  questions: string;
  content: ContentCategory[];
};

type ExamSections = {
  [key: string]: ExamSection;
};

type WeeklyGoal = {
  focus: string;
  tasks: string[];
};

type StudyPlan = {
  estimated_time: string;
  weekly_goals: WeeklyGoal[];
};

type Resources = {
  textbooks: string[];
  online: string[];
  apps: string[];
};

type LevelData = {
  title: string;
  description: string;
  examSections?: ExamSections;
  studyPlan?: StudyPlan;
  resources?: Resources;
  tips?: string[];
};

const defaultLevelData: LevelData = {
  title: '',
  description: '',
  examSections: {},
  studyPlan: {
    estimated_time: '',
    weekly_goals: []
  },
  resources: {
    textbooks: [],
    online: [],
    apps: []
  },
  tips: []
};

export default function StudyGuidePage() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const levelData: LevelData = {
    ...defaultLevelData,
    ...(studyGuideData.levels[selectedLevel] as LevelData)
  };

  const renderContent = (content: ContentCategory[]) => {
    if (!content || content.length === 0) return null;

    return content.map((category, index) => (
      <div key={index} className={styles.contentCategory}>
        <h5>{category.section}</h5>
        <ul className={styles.contentList}>
          {category.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>How to Pass the JLPT</h1>
        <p className={styles.subtitle}>
          Comprehensive study guides and strategies for all JLPT levels
        </p>
        <div className={styles.levelSelector}>
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`${styles.levelButton} ${
                selectedLevel === level ? styles.levelButtonActive : ''
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      {/* Level Overview */}
      <section className={styles.overview}>
        <div className={styles.levelIntro}>
          <h2>{levelData.title}</h2>
          <p>{levelData.description}</p>
          {levelData.studyPlan?.estimated_time && (
            <div className={styles.estimatedTime}>
              <span className={styles.timeIcon}>⏱️</span>
              Estimated study time: {levelData.studyPlan.estimated_time}
            </div>
          )}
        </div>

        {/* Exam Sections */}
        {levelData.examSections && Object.keys(levelData.examSections).length > 0 && (
          <div className={styles.examSections}>
            <h3 className={styles.sectionTitle}>Exam Structure</h3>
            <div className={styles.sectionsGrid}>
              {Object.entries(levelData.examSections).map(([key, section]) => (
                <div key={key} className={styles.examSection}>
                  <div className={styles.sectionHeader}>
                    <h4>{section.title}</h4>
                    <div className={styles.sectionMeta}>
                      <span>{section.timeLimit}</span>
                      <span>{section.questions}</span>
                    </div>
                  </div>
                  <div className={styles.sectionContent}>
                    {renderContent(section.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Study Plan */}
        {levelData.studyPlan?.weekly_goals && levelData.studyPlan.weekly_goals.length > 0 && (
          <div className={styles.studyPlan}>
            <h3 className={styles.sectionTitle}>Weekly Study Plan</h3>
            <div className={styles.weeklyGoals}>
              {levelData.studyPlan.weekly_goals.map((goal, index) => (
                <div key={index} className={styles.goalCard}>
                  <h4>{goal.focus}</h4>
                  <ul className={styles.taskList}>
                    {goal.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Resources */}
        {levelData.resources && (
          Object.values(levelData.resources).some(arr => arr.length > 0) && (
            <div className={styles.resources}>
              <h3 className={styles.sectionTitle}>Recommended Resources</h3>
              <div className={styles.resourcesGrid}>
                {levelData.resources.textbooks.length > 0 && (
                  <div className={styles.resourceCategory}>
                    <h4>📚 Textbooks</h4>
                    <ul>
                      {levelData.resources.textbooks.map((book, index) => (
                        <li key={index}>{book}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {levelData.resources.online.length > 0 && (
                  <div className={styles.resourceCategory}>
                    <h4>💻 Online Resources</h4>
                    <ul>
                      {levelData.resources.online.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {levelData.resources.apps.length > 0 && (
                  <div className={styles.resourceCategory}>
                    <h4>📱 Apps</h4>
                    <ul>
                      {levelData.resources.apps.map((app, index) => (
                        <li key={index}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Study Tips */}
        {levelData.tips && levelData.tips.length > 0 && (
          <div className={styles.tips}>
            <h3 className={styles.sectionTitle}>Pro Tips</h3>
            <div className={styles.tipsGrid}>
              {levelData.tips.map((tip, index) => (
                <div key={index} className={styles.tipCard}>
                  <span className={styles.tipNumber}>Tip {index + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice Area */}
        <div className={styles.practiceArea}>
          <h3 className={styles.sectionTitle}>Start Practicing</h3>
          <div className={styles.practiceGrid}>
            <a href={`/n${selectedLevel.substring(1)}-kanji-list`} className={styles.practiceCard}>
              <span className={styles.practiceIcon}>漢</span>
              <h4>Kanji Practice</h4>
              <p>Master the kanji required for {selectedLevel}</p>
            </a>
            <a href={`/practice-test/${selectedLevel.toLowerCase()}`} className={styles.practiceCard}>
              <span className={styles.practiceIcon}>📝</span>
              <h4>Mock Tests</h4>
              <p>Test your knowledge with full practice exams</p>
            </a>
            <a href={`/flashcards/${selectedLevel.toLowerCase()}`} className={styles.practiceCard}>
              <span className={styles.practiceIcon}>🔄</span>
              <h4>Flashcards</h4>
              <p>Review vocabulary and kanji efficiently</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
