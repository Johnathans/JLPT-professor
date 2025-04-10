import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../hiragana-match.module.css';

interface Character {
  hiragana: string;
  romaji: string;
}

const HIRAGANA_SETS: { [key: string]: Character[] } = {
  // Basic sets
  'a': [
    { hiragana: 'あ', romaji: 'a' }, { hiragana: 'い', romaji: 'i' },
    { hiragana: 'う', romaji: 'u' }, { hiragana: 'え', romaji: 'e' },
    { hiragana: 'お', romaji: 'o' }
  ],
  'ka': [
    { hiragana: 'か', romaji: 'ka' }, { hiragana: 'き', romaji: 'ki' },
    { hiragana: 'く', romaji: 'ku' }, { hiragana: 'け', romaji: 'ke' },
    { hiragana: 'こ', romaji: 'ko' }
  ],
  'sa': [
    { hiragana: 'さ', romaji: 'sa' }, { hiragana: 'し', romaji: 'shi' },
    { hiragana: 'す', romaji: 'su' }, { hiragana: 'せ', romaji: 'se' },
    { hiragana: 'そ', romaji: 'so' }
  ],
  'ta': [
    { hiragana: 'た', romaji: 'ta' }, { hiragana: 'ち', romaji: 'chi' },
    { hiragana: 'つ', romaji: 'tsu' }, { hiragana: 'て', romaji: 'te' },
    { hiragana: 'と', romaji: 'to' }
  ],
  'na': [
    { hiragana: 'な', romaji: 'na' }, { hiragana: 'に', romaji: 'ni' },
    { hiragana: 'ぬ', romaji: 'nu' }, { hiragana: 'ね', romaji: 'ne' },
    { hiragana: 'の', romaji: 'no' }
  ],
  'ha': [
    { hiragana: 'は', romaji: 'ha' }, { hiragana: 'ひ', romaji: 'hi' },
    { hiragana: 'ふ', romaji: 'fu' }, { hiragana: 'へ', romaji: 'he' },
    { hiragana: 'ほ', romaji: 'ho' }
  ],
  'ma': [
    { hiragana: 'ま', romaji: 'ma' }, { hiragana: 'み', romaji: 'mi' },
    { hiragana: 'む', romaji: 'mu' }, { hiragana: 'め', romaji: 'me' },
    { hiragana: 'も', romaji: 'mo' }
  ],
  'ya': [
    { hiragana: 'や', romaji: 'ya' }, { hiragana: 'ゆ', romaji: 'yu' },
    { hiragana: 'よ', romaji: 'yo' }
  ],
  'ra': [
    { hiragana: 'ら', romaji: 'ra' }, { hiragana: 'り', romaji: 'ri' },
    { hiragana: 'る', romaji: 'ru' }, { hiragana: 'れ', romaji: 're' },
    { hiragana: 'ろ', romaji: 'ro' }
  ],
  'wa': [
    { hiragana: 'わ', romaji: 'wa' }, { hiragana: 'を', romaji: 'wo' },
    { hiragana: 'ん', romaji: 'n' }
  ],
  // Dakuten sets
  'ga': [
    { hiragana: 'が', romaji: 'ga' }, { hiragana: 'ぎ', romaji: 'gi' },
    { hiragana: 'ぐ', romaji: 'gu' }, { hiragana: 'げ', romaji: 'ge' },
    { hiragana: 'ご', romaji: 'go' }
  ],
  'za': [
    { hiragana: 'ざ', romaji: 'za' }, { hiragana: 'じ', romaji: 'ji' },
    { hiragana: 'ず', romaji: 'zu' }, { hiragana: 'ぜ', romaji: 'ze' },
    { hiragana: 'ぞ', romaji: 'zo' }
  ],
  'da': [
    { hiragana: 'だ', romaji: 'da' }, { hiragana: 'ぢ', romaji: 'ji' },
    { hiragana: 'づ', romaji: 'zu' }, { hiragana: 'で', romaji: 'de' },
    { hiragana: 'ど', romaji: 'do' }
  ],
  'ba': [
    { hiragana: 'ば', romaji: 'ba' }, { hiragana: 'び', romaji: 'bi' },
    { hiragana: 'ぶ', romaji: 'bu' }, { hiragana: 'べ', romaji: 'be' },
    { hiragana: 'ぼ', romaji: 'bo' }
  ],
  'pa': [
    { hiragana: 'ぱ', romaji: 'pa' }, { hiragana: 'ぴ', romaji: 'pi' },
    { hiragana: 'ぷ', romaji: 'pu' }, { hiragana: 'ぺ', romaji: 'pe' },
    { hiragana: 'ぽ', romaji: 'po' }
  ],
  // Combo sets
  'kya': [
    { hiragana: 'きゃ', romaji: 'kya' }, { hiragana: 'きゅ', romaji: 'kyu' },
    { hiragana: 'きょ', romaji: 'kyo' }
  ],
  'sha': [
    { hiragana: 'しゃ', romaji: 'sha' }, { hiragana: 'しゅ', romaji: 'shu' },
    { hiragana: 'しょ', romaji: 'sho' }
  ],
  'cha': [
    { hiragana: 'ちゃ', romaji: 'cha' }, { hiragana: 'ちゅ', romaji: 'chu' },
    { hiragana: 'ちょ', romaji: 'cho' }
  ],
  'nya': [
    { hiragana: 'にゃ', romaji: 'nya' }, { hiragana: 'にゅ', romaji: 'nyu' },
    { hiragana: 'にょ', romaji: 'nyo' }
  ],
  'hya': [
    { hiragana: 'ひゃ', romaji: 'hya' }, { hiragana: 'ひゅ', romaji: 'hyu' },
    { hiragana: 'ひょ', romaji: 'hyo' }
  ],
  'mya': [
    { hiragana: 'みゃ', romaji: 'mya' }, { hiragana: 'みゅ', romaji: 'myu' },
    { hiragana: 'みょ', romaji: 'myo' }
  ],
  'rya': [
    { hiragana: 'りゃ', romaji: 'rya' }, { hiragana: 'りゅ', romaji: 'ryu' },
    { hiragana: 'りょ', romaji: 'ryo' }
  ],
  'gya': [
    { hiragana: 'ぎゃ', romaji: 'gya' }, { hiragana: 'ぎゅ', romaji: 'gyu' },
    { hiragana: 'ぎょ', romaji: 'gyo' }
  ],
  'ja': [
    { hiragana: 'じゃ', romaji: 'ja' }, { hiragana: 'じゅ', romaji: 'ju' },
    { hiragana: 'じょ', romaji: 'jo' }
  ],
  'bya': [
    { hiragana: 'びゃ', romaji: 'bya' }, { hiragana: 'びゅ', romaji: 'byu' },
    { hiragana: 'びょ', romaji: 'byo' }
  ],
  'pya': [
    { hiragana: 'ぴゃ', romaji: 'pya' }, { hiragana: 'ぴゅ', romaji: 'pyu' },
    { hiragana: 'ぴょ', romaji: 'pyo' }
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

interface HiraganaMatchGameProps {
  groups: string[];
  characterCount: number;
  onScoreUpdate: (score: number) => void;
}

export default function HiraganaMatchGame({ groups, characterCount, onScoreUpdate }: HiraganaMatchGameProps) {
  // Initialize game characters in useState initializer
  const [gameCharacters] = useState(() => {
    const allCharacters = groups.flatMap(group => {
      const groupKey = group.toLowerCase();
      return HIRAGANA_SETS[groupKey as keyof typeof HIRAGANA_SETS] || [];
    });
    return allCharacters.length ? shuffleArray([...allCharacters]).slice(0, characterCount) : [];
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Single useEffect for options
  useEffect(() => {
    if (!gameCharacters.length || currentQuestion >= gameCharacters.length) return;
    
    const current = gameCharacters[currentQuestion];
    const wrongOptions = gameCharacters
      .filter(c => c.hiragana !== current.hiragana)
      .map(c => c.hiragana);
    const allOptions = shuffleArray([...shuffleArray(wrongOptions).slice(0, 5), current.hiragana]);
    setOptions(allOptions);
  }, [currentQuestion, gameCharacters]);

  // Update score without useEffect
  const updateScore = (newScore: number) => {
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null || isTransitioning) return;

    const current = gameCharacters[currentQuestion];
    const correct = answer === current.hiragana;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setIsTransitioning(true);

    if (correct) {
      updateScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion === gameCharacters.length - 1) {
        // Game over
        setSelectedAnswer(null);
        setIsCorrect(null);
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
        <h2 className={styles.meaning}>
          What is the hiragana for "{current.romaji}"?
        </h2>
      </div>

      <div className={styles.options}>
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === current.hiragana;
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
