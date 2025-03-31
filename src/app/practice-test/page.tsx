'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './practice-test.module.css';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
type Section = 'vocabulary' | 'grammar' | 'reading' | 'listening';

interface TestConfig {
  level: JLPTLevel;
  sections: Section[];
  timeLimit: number; // in minutes
}

const DEFAULT_TEST_CONFIG: TestConfig = {
  level: 'N5',
  sections: ['vocabulary', 'grammar', 'reading', 'listening'],
  timeLimit: 120
};

const SECTION_TIMES = {
  vocabulary: 25,
  grammar: 25,
  reading: 50,
  listening: 30
};

export default function PracticeTest() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [selectedSections, setSelectedSections] = useState<Section[]>(['vocabulary', 'grammar']);
  const [showCustomize, setShowCustomize] = useState(false);

  const calculateTotalTime = (sections: Section[]) => {
    return sections.reduce((total, section) => total + SECTION_TIMES[section], 0);
  };

  const handleSectionToggle = (section: Section) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.title}>
              Master the JLPT
              <span className={styles.titleHighlight}>Practice Tests</span>
            </h1>
            <p className={styles.subtitle}>
              Prepare for success with our comprehensive practice tests designed to simulate the real JLPT experience
            </p>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>JLPT Levels</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Questions</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>4</span>
                <span className={styles.statLabel}>Test Sections</span>
              </div>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroGraphic}>
              <svg className={styles.heroIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className={styles.heroDecoration}></div>
            </div>
          </div>
        </div>
        <div className={styles.heroBadges}>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C15.866 15 19 11.866 19 8C19 4.134 15.866 1 12 1C8.13401 1 5 4.134 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Instant Results
          </div>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Timed Sections
          </div>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7L15 12L9 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Audio Support
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.testOptions}>
          <div className={styles.levelSelector}>
            <h2>Select JLPT Level</h2>
            <div className={styles.levelButtons}>
              {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
                <button
                  key={level}
                  className={`${styles.levelButton} ${selectedLevel === level ? styles.selected : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionSelector}>
            <div className={styles.sectionHeader}>
              <h2>Test Sections</h2>
              <button 
                className={styles.customizeButton}
                onClick={() => setShowCustomize(!showCustomize)}
              >
                {showCustomize ? 'Hide Options' : 'Customize Test'}
              </button>
            </div>

            {showCustomize && (
              <div className={styles.sectionOptions}>
                {(['vocabulary', 'grammar', 'reading', 'listening'] as Section[]).map((section) => (
                  <label key={section} className={styles.sectionCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section)}
                      onChange={() => handleSectionToggle(section)}
                    />
                    <span className={styles.checkboxLabel}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                      <span className={styles.sectionTime}>
                        {SECTION_TIMES[section]} minutes
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.testSummary}>
            <h2>Test Summary</h2>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryItem}>
                <span>Selected Level:</span>
                <strong>{selectedLevel}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Sections:</span>
                <strong>{selectedSections.length}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Total Time:</span>
                <strong>{calculateTotalTime(selectedSections)} minutes</strong>
              </div>
            </div>
          </div>

          <Link 
            href={`/practice-test/${selectedLevel.toLowerCase()}`}
            className={styles.startButton}
          >
            Start Practice Test
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={styles.startIcon}
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>About JLPT Practice Tests</h3>
            <p>
              Our practice tests are designed to simulate the real JLPT experience. 
              Each test includes questions from previous exams and follows the official JLPT format.
            </p>
            <ul className={styles.infoList}>
              <li>Timed sections to match the actual exam</li>
              <li>Instant feedback and detailed explanations</li>
              <li>Track your progress over time</li>
              <li>Practice specific sections or take full tests</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h3>Study Tips</h3>
            <ul className={styles.tipsList}>
              <li>Take practice tests regularly to build stamina</li>
              <li>Focus on your weakest sections first</li>
              <li>Review incorrect answers thoroughly</li>
              <li>Time yourself to improve speed and accuracy</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
