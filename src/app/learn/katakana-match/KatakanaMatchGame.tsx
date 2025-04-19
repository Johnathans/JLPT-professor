import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './katakana-match.module.css';

interface Character {
  katakana: string;
  romaji: string;
}

interface KatakanaMatchGameProps {
  groups: string[];
  characterCount: number;
  onScoreUpdate: (score: number) => void;
}

export const KATAKANA_SETS: { [key: string]: Character[] } = {
  // Basic sets
  'a': [
    { katakana: 'ア', romaji: 'a' }, { katakana: 'イ', romaji: 'i' },
    { katakana: 'ウ', romaji: 'u' }, { katakana: 'エ', romaji: 'e' },
    { katakana: 'オ', romaji: 'o' }
  ],
  'ka': [
    { katakana: 'カ', romaji: 'ka' }, { katakana: 'キ', romaji: 'ki' },
    { katakana: 'ク', romaji: 'ku' }, { katakana: 'ケ', romaji: 'ke' },
    { katakana: 'コ', romaji: 'ko' }
  ],
  'sa': [
    { katakana: 'サ', romaji: 'sa' }, { katakana: 'シ', romaji: 'shi' },
    { katakana: 'ス', romaji: 'su' }, { katakana: 'セ', romaji: 'se' },
    { katakana: 'ソ', romaji: 'so' }
  ],
  'ta': [
    { katakana: 'タ', romaji: 'ta' }, { katakana: 'チ', romaji: 'chi' },
    { katakana: 'ツ', romaji: 'tsu' }, { katakana: 'テ', romaji: 'te' },
    { katakana: 'ト', romaji: 'to' }
  ],
  'na': [
    { katakana: 'ナ', romaji: 'na' }, { katakana: 'ニ', romaji: 'ni' },
    { katakana: 'ヌ', romaji: 'nu' }, { katakana: 'ネ', romaji: 'ne' },
    { katakana: 'ノ', romaji: 'no' }
  ],
  'ha': [
    { katakana: 'ハ', romaji: 'ha' }, { katakana: 'ヒ', romaji: 'hi' },
    { katakana: 'フ', romaji: 'fu' }, { katakana: 'ヘ', romaji: 'he' },
    { katakana: 'ホ', romaji: 'ho' }
  ],
  'ma': [
    { katakana: 'マ', romaji: 'ma' }, { katakana: 'ミ', romaji: 'mi' },
    { katakana: 'ム', romaji: 'mu' }, { katakana: 'メ', romaji: 'me' },
    { katakana: 'モ', romaji: 'mo' }
  ],
  'ya': [
    { katakana: 'ヤ', romaji: 'ya' }, { katakana: 'ユ', romaji: 'yu' },
    { katakana: 'ヨ', romaji: 'yo' }
  ],
  'ra': [
    { katakana: 'ラ', romaji: 'ra' }, { katakana: 'リ', romaji: 'ri' },
    { katakana: 'ル', romaji: 'ru' }, { katakana: 'レ', romaji: 're' },
    { katakana: 'ロ', romaji: 'ro' }
  ],
  'wa': [
    { katakana: 'ワ', romaji: 'wa' }, { katakana: 'ヲ', romaji: 'wo' },
    { katakana: 'ン', romaji: 'n' }
  ],
  // Dakuten sets
  'ga': [
    { katakana: 'ガ', romaji: 'ga' }, { katakana: 'ギ', romaji: 'gi' },
    { katakana: 'グ', romaji: 'gu' }, { katakana: 'ゲ', romaji: 'ge' },
    { katakana: 'ゴ', romaji: 'go' }
  ],
  'za': [
    { katakana: 'ザ', romaji: 'za' }, { katakana: 'ジ', romaji: 'ji' },
    { katakana: 'ズ', romaji: 'zu' }, { katakana: 'ゼ', romaji: 'ze' },
    { katakana: 'ゾ', romaji: 'zo' }
  ],
  'da': [
    { katakana: 'ダ', romaji: 'da' }, { katakana: 'ヂ', romaji: 'ji' },
    { katakana: 'ヅ', romaji: 'zu' }, { katakana: 'デ', romaji: 'de' },
    { katakana: 'ド', romaji: 'do' }
  ],
  'ba': [
    { katakana: 'バ', romaji: 'ba' }, { katakana: 'ビ', romaji: 'bi' },
    { katakana: 'ブ', romaji: 'bu' }, { katakana: 'ベ', romaji: 'be' },
    { katakana: 'ボ', romaji: 'bo' }
  ],
  'pa': [
    { katakana: 'パ', romaji: 'pa' }, { katakana: 'ピ', romaji: 'pi' },
    { katakana: 'プ', romaji: 'pu' }, { katakana: 'ペ', romaji: 'pe' },
    { katakana: 'ポ', romaji: 'po' }
  ],
  // Combo sets
  'kya': [
    { katakana: 'キャ', romaji: 'kya' }, { katakana: 'キュ', romaji: 'kyu' },
    { katakana: 'キョ', romaji: 'kyo' }
  ],
  'sha': [
    { katakana: 'シャ', romaji: 'sha' }, { katakana: 'シュ', romaji: 'shu' },
    { katakana: 'ショ', romaji: 'sho' }
  ],
  'cha': [
    { katakana: 'チャ', romaji: 'cha' }, { katakana: 'チュ', romaji: 'chu' },
    { katakana: 'チョ', romaji: 'cho' }
  ],
  'nya': [
    { katakana: 'ニャ', romaji: 'nya' }, { katakana: 'ニュ', romaji: 'nyu' },
    { katakana: 'ニョ', romaji: 'nyo' }
  ],
  'hya': [
    { katakana: 'ヒャ', romaji: 'hya' }, { katakana: 'ヒュ', romaji: 'hyu' },
    { katakana: 'ヒョ', romaji: 'hyo' }
  ],
  'mya': [
    { katakana: 'ミャ', romaji: 'mya' }, { katakana: 'ミュ', romaji: 'myu' },
    { katakana: 'ミョ', romaji: 'myo' }
  ],
  'rya': [
    { katakana: 'リャ', romaji: 'rya' }, { katakana: 'リュ', romaji: 'ryu' },
    { katakana: 'リョ', romaji: 'ryo' }
  ],
  'gya': [
    { katakana: 'ギャ', romaji: 'gya' }, { katakana: 'ギュ', romaji: 'gyu' },
    { katakana: 'ギョ', romaji: 'gyo' }
  ],
  'ja': [
    { katakana: 'ジャ', romaji: 'ja' }, { katakana: 'ジュ', romaji: 'ju' },
    { katakana: 'ジョ', romaji: 'jo' }
  ],
  'bya': [
    { katakana: 'ビャ', romaji: 'bya' }, { katakana: 'ビュ', romaji: 'byu' },
    { katakana: 'ビョ', romaji: 'byo' }
  ],
  'pya': [
    { katakana: 'ピャ', romaji: 'pya' }, { katakana: 'ピュ', romaji: 'pyu' },
    { katakana: 'ピョ', romaji: 'pyo' }
  ]
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const MIN_COUNT = 5;
const MAX_COUNT = 30;

export default function KatakanaMatchGame({ groups, characterCount, onScoreUpdate }: KatakanaMatchGameProps) {
  const router = useRouter();
  // Initialize game characters in useState initializer
  const [gameCharacters] = useState(() => {
    const allCharacters = groups.flatMap(group => {
      const groupKey = group.toLowerCase();
      return KATAKANA_SETS[groupKey as keyof typeof KATAKANA_SETS] || [];
    });
    return allCharacters.length ? shuffleArray([...allCharacters]).slice(0, characterCount) : [];
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Single useEffect for options
  useEffect(() => {
    if (!gameCharacters.length || currentQuestion >= gameCharacters.length) return;
    
    const current = gameCharacters[currentQuestion];
    const wrongOptions = gameCharacters
      .filter(c => c.katakana !== current.katakana)
      .map(c => c.katakana);
    const allOptions = shuffleArray([...shuffleArray(wrongOptions).slice(0, 5), current.katakana]);
    setOptions(allOptions);
  }, [currentQuestion, gameCharacters]);

  const updateScore = (newScore: number) => {
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null || isTransitioning) return;

    const current = gameCharacters[currentQuestion];
    const correct = answer === current.katakana;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setIsTransitioning(true);

    if (correct) {
      updateScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion === gameCharacters.length - 1) {
        // Game over
        setIsGameComplete(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
      setIsTransitioning(false);
    }, 1000);
  };

  if (!gameCharacters.length) {
    return <div className={styles.error}>No characters available for the selected groups: {groups.join(', ')}</div>;
  }

  if (isGameComplete) {
    return (
      <div className={styles.gameContent}>
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Game Complete!</h2>
          <div className={styles.resultStats}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Score</div>
              <div className={styles.statValue}>{score}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Questions</div>
              <div className={styles.statValue}>{gameCharacters.length}</div>
            </div>
          </div>
          <div className={styles.resultButtons}>
            <button
              onClick={() => router.refresh()}
              className={styles.playAgainButton}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = gameCharacters[currentQuestion];

  return (
    <div className={styles.gameContent}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${((currentQuestion + 1) / gameCharacters.length) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          Question {currentQuestion + 1} of {gameCharacters.length}
        </div>
      </div>

      <div className={styles.question}>
        <div className={styles.score}>Score: {score}</div>
        <h2 className={styles.meaning}>
          What is the katakana for "{current.romaji}"?
        </h2>
      </div>

      <div className={styles.options}>
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === current.katakana;
          let className = styles.option;
          
          if (selectedAnswer === option) {
            className += ` ${isCorrect ? styles.correct : styles.incorrect}`;
          }
          
          return (
            <button
              key={`${currentQuestion}-${index}`}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null || isTransitioning}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
