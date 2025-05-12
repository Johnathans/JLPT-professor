'use client';

import React, { useEffect } from 'react';
import styles from '@/styles/dashboard.module.css';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, Book, Edit3 } from 'react-feather';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GoalSettingModal, { DailyGoals } from './GoalSettingModal';
import { useColorMode } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';

const mockData = {
  user: {
    firstName: "John",
    lastName: "Smith",
    progress: {
      remainingKanji: 243,
      remainingWords: 1875,
      currentLevel: "N4"
    }
  },
  jlptLevels: [
    {
      id: "n5",
      name: "N5",
      description: "Basic Japanese knowledge",
      modules: [
        {
          id: "n5-1",
          title: "Fast Track Level 1",
          description: "1,000 Sentences",
          tag: "Fluency Fast Track",
          status: "in_progress",
          progress: {
            playing: 7,
            mastered: 0,
            playingPercentage: 0.7,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 2,
            new: 0,
            review: 2
          }
        },
        {
          id: "n5-2",
          title: "Fast Track Level 2",
          description: "1,000 Sentences",
          tag: "Fluency Fast Track",
          status: "available",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        },
        {
          id: "n5-3",
          title: "Kanji Essentials",
          description: "103 Kanji Characters",
          tag: "Kanji",
          status: "locked",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        },
        {
          id: "n5-4",
          title: "Core Vocabulary",
          description: "800 Essential Words",
          tag: "Vocabulary",
          status: "locked",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        },
        {
          id: "n5-5",
          title: "Grammar Foundations",
          description: "Basic Sentence Patterns",
          tag: "Grammar",
          status: "locked",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        }
      ]
    },
    {
      id: "n4",
      name: "N4",
      description: "Basic Japanese knowledge",
      modules: [
        {
          id: "n4-1",
          title: "Intermediate Kanji",
          description: "181 Kanji Characters",
          tag: "Kanji",
          status: "locked",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        },
        {
          id: "n4-2",
          title: "Expanded Vocabulary",
          description: "1,500 Words",
          tag: "Vocabulary",
          status: "locked",
          progress: {
            playing: 0,
            mastered: 0,
            playingPercentage: 0,
            masteredPercentage: 0
          },
          dailyActivity: {
            played: 0,
            new: 0,
            review: 0
          }
        }
      ]
    },
    {
      id: "n3",
      name: "N3",
      description: "Intermediate Japanese knowledge",
      modules: []
    },
    {
      id: "n2",
      name: "N2",
      description: "Pre-advanced Japanese knowledge",
      modules: []
    },
    {
      id: "n1",
      name: "N1",
      description: "Advanced Japanese knowledge",
      modules: []
    }
  ],
  srs: {
    new: 42,
    learning: 78,
    mastered: 156,
    readyForReview: 8,
    accuracy: 87
  },
  dailyGoal: {
    total: 30,
    completed: 21,
    categories: {
      vocabulary: { total: 10, completed: 8 },
      kanji: { total: 5, completed: 4 },
      grammar: { total: 5, completed: 3 },
      listening: { total: 5, completed: 3 },
      reading: { total: 5, completed: 3 }
    },
    timeRemaining: "5h 20m"
  },
  streak: 1,
  playedToday: {
    total: 4,
    new: 4,
    review: 0
  },
  level: {
    current: 0,
    pointsToNext: 76
  },
  leaderboard: {
    rank: 382
  },
  history: [
    { date: '2025-04-29', count: 0 },
    { date: '2025-04-30', count: 2 },
    { date: '2025-05-01', count: 1 },
    { date: '2025-05-02', count: 3 },
    { date: '2025-05-03', count: 5 },
    { date: '2025-05-04', count: 2 },
    { date: '2025-05-05', count: 4 }
  ]
};

export default function TestDashboard() {
  const { isDarkMode, toggleDarkMode } = useColorMode();
  const [showGoalModal, setShowGoalModal] = React.useState(false);
  const [activeJlptLevel, setActiveJlptLevel] = React.useState("n5");
  const brandPurple = '#7c4dff';
  const [dailyGoals, setDailyGoals] = React.useState<DailyGoals>({
    vocabulary: mockData.dailyGoal.categories.vocabulary.total,
    kanji: mockData.dailyGoal.categories.kanji.total,
    grammar: mockData.dailyGoal.categories.grammar.total,
    listening: mockData.dailyGoal.categories.listening.total,
    reading: mockData.dailyGoal.categories.reading.total
  });

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.dark : ''}`}>
      {/* Shared Navigation Component */}
      <Navbar />

      {/* JLPT Level Progress Bar */}
      <div className={styles.jlptProgressContainer}>
        <div className={styles.jlptLevelIndicator}>
          <span className={styles.jlptLevelText}>{mockData.user.progress.currentLevel}</span>
        </div>
        <div className={styles.jlptProgressBarWrapper}>
          <div 
            className={styles.jlptProgressBarFill} 
            style={{ 
              width: `${Math.min(100, (mockData.srs.mastered / (mockData.srs.mastered + mockData.user.progress.remainingKanji + mockData.user.progress.remainingWords)) * 100)}%` 
            }}
          />
          <span className={styles.jlptProgressText}>
            {Math.round((mockData.srs.mastered / (mockData.srs.mastered + mockData.user.progress.remainingKanji + mockData.user.progress.remainingWords)) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.welcomeHeader}>
          <h1><span className={styles.welcomeText}>ようこそ,</span> <span className={styles.userName}>{mockData.user.firstName}</span></h1>
          <p>Only <span className={styles.highlightStat}>{mockData.user.progress.remainingKanji} kanji</span> and <span className={styles.highlightStat}>{mockData.user.progress.remainingWords} words</span> left to memorize for {mockData.user.progress.currentLevel}</p>
        </div>
        
        <div className={styles.grid}>
          {/* SRS Stats Card */}
          <div className={styles.card}>
            <div className={styles.srsCardContent}>
              <div className={styles.srsHeader}>
                <h3>JLPT PROGRESS</h3>
              </div>
              
              <div className={styles.srsStatsGrid}>
                <div className={styles.statColumn}>
                  <div className={styles.srsStatItem}>
                    <div className={styles.srsStatValue}>{mockData.srs.new}</div>
                    <div className={styles.srsStatLabel}>NEW</div>
                  </div>
                  
                  <div className={styles.srsStatItem}>
                    <div className={styles.srsStatValue}>{mockData.srs.learning}</div>
                    <div className={styles.srsStatLabel}>LEARNING</div>
                  </div>
                  
                  <div className={styles.srsStatItem}>
                    <div className={styles.srsStatValue}>{mockData.srs.mastered}</div>
                    <div className={styles.srsStatLabel}>MASTERED</div>
                  </div>
                </div>
                
                <div className={styles.accuracyColumn}>
                  <div className={styles.accuracyContainer}>
                    <div className={styles.accuracyLabel}>Average Accuracy</div>
                    <div className={styles.accuracyValue}>{mockData.srs.accuracy}%</div>
                    <div className={styles.accuracyBar}>
                      <div 
                        className={styles.accuracyProgress} 
                        style={{ width: `${mockData.srs.accuracy}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.reviewContainer}>
                    <div className={styles.reviewCount}>
                      <span>{mockData.srs.readyForReview}</span> ready for review
                    </div>
                    <div className={styles.buttonGroup}>
                      <button className={styles.reviewButton}>REVIEW</button>
                      <button onClick={() => window.location.href = '/study'} className={styles.studyButton}>STUDY</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <div className={styles.streakIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3L4 14H13L11 21L20 10H11L13 3Z" fill="currentColor" />
                  </svg>
                </div>
                <h3>Streak</h3>
              </div>
              <button className={styles.viewButton}>View Details</button>
            </div>
            
            <div className={styles.streakCount}>
              <span className={styles.bigNumber}>{mockData.streak}</span> days
            </div>
            
            <div className={styles.weekDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <div key={day + index} className={styles.dayContainer}>
                  <div className={`${styles.dayCircle} ${index < 4 ? styles.completed : ''}`}>
                    {index < 4 && (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.dayLabel}>{day}</div>
                </div>
              ))}
            </div>
            
            <div className={styles.streakStats}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Longest Streak</div>
                <div className={styles.statValue}>100 days</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Total Study Days</div>
                <div className={styles.statValue}>131</div>
              </div>
            </div>
          </div>

          {/* Daily Goal Card */}
          <div className={`${styles.card} ${styles.goalCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <h3>DAILY GOAL</h3>
              </div>
              <button 
                className={styles.editButton} 
                aria-label="Edit daily goal"
                onClick={() => setShowGoalModal(true)}
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            <div className={styles.dailyGoalContent}>
              <div className={styles.goalProgress}>
                <div className={styles.circularProgress}>
                  <CircularProgressbar
                    value={(mockData.dailyGoal.completed / mockData.dailyGoal.total) * 100}
                    text={`${mockData.dailyGoal.completed}/${mockData.dailyGoal.total}`}
                    strokeWidth={10}
                    styles={buildStyles({
                      textSize: '1.5rem',
                      pathColor: brandPurple,
                      textColor: isDarkMode ? '#fff' : '#333',
                      trailColor: '#e8e3ff',
                    })}
                  />
                </div>
                <div className={styles.timeRemaining}>
                  <Clock size={16} />
                  <span>{mockData.dailyGoal.timeRemaining} left today</span>
                </div>
              </div>
              
              <div className={styles.goalCategories}>
                <div className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryLabel}>Vocabulary</div>
                    <div className={styles.categoryCount}>
                      {mockData.dailyGoal.categories.vocabulary.completed}/{mockData.dailyGoal.categories.vocabulary.total}
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress} 
                      style={{ 
                        width: `${(mockData.dailyGoal.categories.vocabulary.completed / mockData.dailyGoal.categories.vocabulary.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryLabel}>Kanji</div>
                    <div className={styles.categoryCount}>
                      {mockData.dailyGoal.categories.kanji.completed}/{mockData.dailyGoal.categories.kanji.total}
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress} 
                      style={{ 
                        width: `${(mockData.dailyGoal.categories.kanji.completed / mockData.dailyGoal.categories.kanji.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryLabel}>Grammar</div>
                    <div className={styles.categoryCount}>
                      {mockData.dailyGoal.categories.grammar.completed}/{mockData.dailyGoal.categories.grammar.total}
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress} 
                      style={{ 
                        width: `${(mockData.dailyGoal.categories.grammar.completed / mockData.dailyGoal.categories.grammar.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryLabel}>Listening</div>
                    <div className={styles.categoryCount}>
                      {mockData.dailyGoal.categories.listening.completed}/{mockData.dailyGoal.categories.listening.total}
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress} 
                      style={{ 
                        width: `${(mockData.dailyGoal.categories.listening.completed / mockData.dailyGoal.categories.listening.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className={styles.categoryItem}>
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryLabel}>Reading</div>
                    <div className={styles.categoryCount}>
                      {mockData.dailyGoal.categories.reading.completed}/{mockData.dailyGoal.categories.reading.total}
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div 
                      className={styles.categoryProgress} 
                      style={{ 
                        width: `${(mockData.dailyGoal.categories.reading.completed / mockData.dailyGoal.categories.reading.total) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* JLPT Study Path Section */}
          <div className={styles.studyPathSection} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.sectionHeader}>
              <h2>Learning Modules</h2>
              <p>Complete these modules to master your Japanese skills</p>
            </div>
            
            <div className={styles.jlptLevelTabs}>
              {mockData.jlptLevels.map((level) => (
                <button 
                  key={level.id}
                  className={`${styles.jlptLevelTab} ${activeJlptLevel === level.id ? styles.activeTab : ''}`}
                  onClick={() => setActiveJlptLevel(level.id)}
                >
                  {level.name}
                </button>
              ))}
            </div>
            
            <div className={styles.modulesContainer}>
              
              <div className={styles.modulesList}>
                {mockData.jlptLevels.find(level => level.id === activeJlptLevel)?.modules.map((module) => (
                  <div 
                    key={module.id} 
                    className={`${styles.moduleCard} ${styles[module.status]}`}
                  >
                    <div className={styles.moduleHeader}>
                      <div className={styles.moduleStatus}>
                        {module.status === 'in_progress' && 'IN PROGRESS'}
                        {module.status === 'available' && 'AVAILABLE'}
                        {module.status === 'locked' && 'LOCKED'}
                        {module.status === 'completed' && 'COMPLETED'}
                      </div>
                      <div className={styles.moduleTag}>{module.tag}</div>
                    </div>
                    
                    <h3 className={styles.moduleTitle}>{module.title}</h3>
                    <div className={styles.moduleDescription}>{module.description}</div>
                    
                    <div className={styles.moduleProgress}>
                      <div className={styles.progressItem}>
                        <div className={styles.progressLabel}>Playing: {module.progress.playing}</div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${module.progress.playingPercentage * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.progressItem}>
                        <div className={styles.progressLabel}>Mastered: {module.progress.mastered}</div>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${module.progress.masteredPercentage * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.moduleActions}>
                      {module.status !== 'locked' && (
                        <button className={styles.playButton}>PLAY</button>
                      )}
                      
                      {(module.status === 'in_progress' || module.status === 'completed') && (
                        <button className={styles.reviewButton}>
                          REVIEW {module.dailyActivity.review > 0 && `(${module.dailyActivity.review})`}
                        </button>
                      )}
                    </div>
                    
                    {module.dailyActivity.played > 0 && (
                      <div className={styles.dailyActivity}>
                        <div className={styles.activityIcon}>✓</div>
                        <div className={styles.activityText}>
                          Played today: {module.dailyActivity.played} / 
                          New: {module.dailyActivity.new} / 
                          Review: {module.dailyActivity.review}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Goal Setting Modal */}
      <GoalSettingModal 
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        initialGoals={dailyGoals}
        onSave={(newGoals) => {
          setDailyGoals(newGoals);
          // In a real app, we would save this to the database
          console.log('New daily goals:', newGoals);
        }}
      />
    </div>
  );
}
