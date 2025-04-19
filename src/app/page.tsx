import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { Book, Crown, GraduationCap, Volume2, PenTool, Gamepad, Brain, Target, MessageCircle, Trophy } from 'lucide-react';
import KanjiGrid from './components/KanjiGrid';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroMain}>
              <h1 className={styles.title}>
                Pass the JLPT with
                <span className={styles.highlight}> AI-Powered</span> Study Tools
              </h1>
              <p className={styles.subtitle}>
                Master Japanese faster with personalized learning paths, 
                real-time feedback, and adaptive practice sessions.
              </p>
              <div className={styles.ctaSection}>
                <Link href="/signup" className={styles.ctaButton}>
                  Start Learning Free
                </Link>
                <p className={styles.ctaNote}>
                  7-day free trial • No credit card required
                </p>
              </div>
            </div>

            <div className={styles.heroImage}>
              <KanjiGrid />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.learningPath}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Master JLPT N5 in 10 Weeks</h2>
          <p className={styles.sectionSubtitle}>Follow our proven study path designed by language experts. Track your progress, practice with AI-powered tools, and achieve JLPT success.</p>
          
          <div className={styles.path}>
            {/* SVG Path */}
            <svg className={styles.pathSvg} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
              {/* Background paths */}
              <path 
                d="M100,140 L350,140 L600,140 L850,140 L850,350 L600,350 L350,350 L100,350 L100,560 L350,560 L600,560"
                stroke="#e8e3ff"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Active paths */}
              <path 
                d="M100,140 L350,140 L600,140"
                stroke="#7c4dff"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* First Row Nodes */}
            <Link href="/n5-learning-path/introduction" className={`${styles.node} ${styles.node1} ${styles.completed}`}>
              <div className={styles.nodeContent}>
                <GraduationCap />
              </div>
              <div className={styles.stats}>Start Here</div>
              <div className={styles.nodeLabel}>Introduction</div>
            </Link>

            <Link href="/n5-kanji-list" className={`${styles.node} ${styles.node2} ${styles.completed}`}>
              <div className={styles.nodeContent}>
                <PenTool />
              </div>
              <div className={styles.stats}>80 Characters</div>
              <div className={styles.nodeLabel}>Basic Kanji</div>
            </Link>

            <Link href="/n5-vocabulary" className={`${styles.node} ${styles.node3} ${styles.current}`}>
              <div className={styles.nodeContent}>
                <Book />
              </div>
              <div className={styles.stats}>240+ Words</div>
              <div className={styles.nodeLabel}>Core Vocabulary</div>
            </Link>

            <Link href="/n5-practice" className={`${styles.node} ${styles.node4}`}>
              <div className={styles.nodeContent}>
                <Gamepad />
              </div>
              <div className={styles.stats}>10 Exercises</div>
              <div className={styles.nodeLabel}>Practice Games</div>
            </Link>

            {/* Second Row Nodes */}
            <Link href="/n5-grammar" className={`${styles.node} ${styles.node5}`}>
              <div className={styles.nodeContent}>
                <Brain />
              </div>
              <div className={styles.stats}>5 Grammar Points</div>
              <div className={styles.nodeLabel}>Grammar Basics</div>
            </Link>

            <Link href="/n5-writing" className={`${styles.node} ${styles.node6}`}>
              <div className={styles.nodeContent}>
                <Target />
              </div>
              <div className={styles.stats}>20 Drills</div>
              <div className={styles.nodeLabel}>Writing Practice</div>
            </Link>

            <Link href="/n5-listening" className={`${styles.node} ${styles.node7}`}>
              <div className={styles.nodeContent}>
                <Volume2 />
              </div>
              <div className={styles.stats}>3 Hours</div>
              <div className={styles.nodeLabel}>Listening</div>
            </Link>

            <Link href="/n5-speaking" className={`${styles.node} ${styles.node8}`}>
              <div className={styles.nodeContent}>
                <MessageCircle />
              </div>
              <div className={styles.stats}>10 Scenarios</div>
              <div className={styles.nodeLabel}>Speaking</div>
            </Link>

            {/* Third Row Nodes */}
            <Link href="/n5-practice-tests" className={`${styles.node} ${styles.node9}`}>
              <div className={styles.nodeContent}>
                <Crown />
              </div>
              <div className={styles.stats}>5 Full Tests</div>
              <div className={styles.nodeLabel}>Practice Tests</div>
            </Link>

            <Link href="/n5-certification" className={`${styles.node} ${styles.node10}`}>
              <div className={styles.nodeContent}>
                <Trophy />
              </div>
              <div className={styles.stats}>Final Challenge</div>
              <div className={styles.nodeLabel}>N5 Certification</div>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.showcase}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Powerful Learning Tools</h2>
          
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseItem}>
              <div className={styles.showcaseContent}>
                <h3>AI-Powered Flashcards</h3>
                <p>Master kanji and vocabulary with smart flashcards that adapt to your learning speed. Get instant stroke order animations and native audio.</p>
                <ul className={styles.featureList}>
                  <li>Stroke order animations</li>
                  <li>Native audio pronunciation</li>
                  <li>Spaced repetition system</li>
                </ul>
              </div>
              <div className={styles.showcaseImage}>
                <Image
                  src="/flashcards.png"
                  alt="AI Flashcard System"
                  width={1206}
                  height={743}
                  className={styles.screenshot}
                />
              </div>
            </div>

            <div className={styles.showcaseItem}>
              <div className={styles.showcaseImage}>
                <Image
                  src="/practice.png"
                  alt="Interactive Practice"
                  width={1101}
                  height={750}
                  className={styles.screenshot}
                />
              </div>
              <div className={styles.showcaseContent}>
                <h3>Interactive Practice</h3>
                <p>Practice reading, writing, and listening with interactive exercises. Get instant feedback and detailed explanations.</p>
                <ul className={styles.featureList}>
                  <li>Real-time writing feedback</li>
                  <li>Listening comprehension</li>
                  <li>Grammar exercises</li>
                </ul>
              </div>
            </div>

            <div className={styles.showcaseItem}>
              <div className={styles.showcaseContent}>
                <h3>Progress Tracking</h3>
                <p>Monitor your learning journey with detailed progress tracking. See your strengths and areas for improvement.</p>
                <ul className={styles.featureList}>
                  <li>Detailed statistics</li>
                  <li>Performance insights</li>
                  <li>Study recommendations</li>
                </ul>
              </div>
              <div className={styles.showcaseImage}>
                <Image
                  src="/progress.png"
                  alt="Progress Tracking"
                  width={1206}
                  height={743}
                  className={styles.screenshot}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.paths}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Choose Your Level</h2>
          <p className={styles.sectionSubtitle}>Select your JLPT level and start your personalized learning journey</p>
        
          <div className={styles.levelGrid}>
            <Link href="/n1-learning-path" className={styles.levelCard}>
              <div className={styles.levelBadge}>N1</div>
              <h3 className={styles.levelTitle}>Advanced</h3>
              <p className={styles.levelDescription}>Master complex Japanese used in academic/professional contexts</p>
              <div className={styles.levelStats}>
                <span className={styles.levelStat}>
                  <Book size={16} />
                  2000+ Kanji
                </span>
                <span className={styles.levelStat}>
                  <GraduationCap size={16} />
                  10000+ Words
                </span>
              </div>
            </Link>

            <Link href="/n2-learning-path" className={styles.levelCard}>
              <div className={styles.levelBadge}>N2</div>
              <h3 className={styles.levelTitle}>Pre-Advanced</h3>
              <p className={styles.levelDescription}>Understand Japanese used in everyday situations</p>
              <div className={styles.levelStats}>
                <span className={styles.levelStat}>
                  <Book size={16} />
                  1000+ Kanji
                </span>
                <span className={styles.levelStat}>
                  <GraduationCap size={16} />
                  6000+ Words
                </span>
              </div>
            </Link>

            <Link href="/n3-learning-path" className={styles.levelCard}>
              <div className={styles.levelBadge}>N3</div>
              <h3 className={styles.levelTitle}>Intermediate</h3>
              <p className={styles.levelDescription}>Read and comprehend everyday Japanese</p>
              <div className={styles.levelStats}>
                <span className={styles.levelStat}>
                  <Book size={16} />
                  650+ Kanji
                </span>
                <span className={styles.levelStat}>
                  <GraduationCap size={16} />
                  3750+ Words
                </span>
              </div>
            </Link>

            <Link href="/n4-learning-path" className={styles.levelCard}>
              <div className={styles.levelBadge}>N4</div>
              <h3 className={styles.levelTitle}>Basic</h3>
              <p className={styles.levelDescription}>Basic Japanese in everyday situations</p>
              <div className={styles.levelStats}>
                <span className={styles.levelStat}>
                  <Book size={16} />
                  300+ Kanji
                </span>
                <span className={styles.levelStat}>
                  <GraduationCap size={16} />
                  1500+ Words
                </span>
              </div>
            </Link>

            <Link href="/n5-learning-path" className={styles.levelCard}>
              <div className={styles.levelBadge}>N5</div>
              <h3 className={styles.levelTitle}>Beginner</h3>
              <p className={styles.levelDescription}>Basic Japanese in familiar situations</p>
              <div className={styles.levelStats}>
                <span className={styles.levelStat}>
                  <Book size={16} />
                  100+ Kanji
                </span>
                <span className={styles.levelStat}>
                  <GraduationCap size={16} />
                  800+ Words
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
