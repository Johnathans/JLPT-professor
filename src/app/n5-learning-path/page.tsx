'use client';

import { Book, Crown, GraduationCap, Volume2, PenTool, Gamepad, Brain, Target, MessageCircle, Trophy } from 'lucide-react';
import Link from 'next/link';
import styles from './learning-path.module.css';

export default function LearningPath() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Your N5 Journey Starts Here</h1>
          <Link href="/n5-learning-path/introduction" className={styles.startButton}>
            Get Started Learning
          </Link>
        </div>
      </div>

      <main className={styles.pathContainer}>
        <div className={styles.path}>
          {/* SVG Path */}
          <svg className={styles.pathSvg} viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
            {/* Background paths for visual depth */}
            <path 
              d="M100,150 H325 M375,150 H575 M625,150 H825 M875,150 H950 V400 H825 M775,400 H625 M575,400 H375 M325,400 H100 V650 H325 M375,650 H575"
              stroke="#e8e3ff"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Foreground active paths */}
            <path 
              d="M100,150 H325 M375,150 H575"
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
      </main>
    </div>
  );
}
