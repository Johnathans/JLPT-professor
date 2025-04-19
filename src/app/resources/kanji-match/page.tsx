'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './kanji-match.module.css';

// Loading component while the game loads
function LoadingGame() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/resources" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Resources
        </Link>
      </div>
      <div className={styles.gameContent}>
        <div className={styles.question}>
          <h2 className={styles.meaning}>Loading game...</h2>
        </div>
      </div>
    </div>
  );
}

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2'];
const KANJI_COUNTS = [5, 10, 15, 20, 25];

function KanjiMatchLanding() {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [kanjiCount, setKanjiCount] = useState(10);
  const router = useRouter();

  const handlePlay = () => {
    router.push(`/resources/kanji-match/play?level=${selectedLevel}&count=${kanjiCount}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/resources" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back to Resources
        </Link>
      </div>

      <div className={styles.landingContent}>
        <div className={styles.landingLeft}>
          <h1 className={styles.landingTitle}>Kanji Match Game</h1>
          
          <div className={styles.gameDescription}>
            <p>Test your kanji knowledge with our interactive matching game! Match kanji characters with their meanings in this fast-paced challenge.</p>
            <ul>
              <li>Practice recognizing kanji quickly</li>
              <li>Learn common meanings and readings</li>
              <li>Track your progress with scores</li>
              <li>Choose your JLPT level (N5-N2)</li>
            </ul>
          </div>

          <div className={styles.gameSettings}>
            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Select JLPT Level:</label>
              <div className={styles.levelSelector}>
                {JLPT_LEVELS.map((level) => (
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
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.settingLabel}>Number of Kanji:</label>
              <div className={styles.levelSelector}>
                {KANJI_COUNTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setKanjiCount(count)}
                    className={`${styles.levelButton} ${
                      kanjiCount === count ? styles.levelButtonActive : ''
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handlePlay} className={styles.playButton}>
              Play Now
            </button>
          </div>
        </div>

        <div className={styles.gamePreview}>
          <Image 
            src="/kanji-match-game.png"
            alt="Kanji Match Game Screenshot"
            width={800}
            height={600}
            className={styles.screenshot}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default KanjiMatchLanding;
