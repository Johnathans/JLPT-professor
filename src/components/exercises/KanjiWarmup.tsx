'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

const KanjiCard = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  transition: 'transform 0.3s ease',
  perspective: '1000px',
}));

const CardInner = styled('div')<{ $isFlipped: boolean }>(({ $isFlipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  transform: $isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
}));

const CardSide = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
});

const CardFront = styled(CardSide)({
  backgroundColor: '#fff',
});

const CardBack = styled(CardSide)({
  backgroundColor: '#fff',
  transform: 'rotateY(180deg)',
});

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#7c4dff',
  border: '1px solid rgba(124, 77, 255, 0.5)',
  padding: '10px 24px',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)',
    border: '1px solid #7c4dff',
  },
  '&.correct': {
    backgroundColor: '#4caf50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  '&.incorrect': {
    backgroundColor: '#f44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#e53935',
    },
  },
}));

interface KanjiWarmupProps {
  onComplete: (score: number) => void;
}

interface KanjiItem {
  kanji: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  example: {
    japanese: string;
    meaning: string;
  };
}

// Mock data - replace with real data from your API
const mockKanji: KanjiItem[] = [
  {
    kanji: '日',
    meaning: 'day, sun',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    example: {
      japanese: '日本',
      meaning: 'Japan',
    },
  },
  {
    kanji: '月',
    meaning: 'month, moon',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    example: {
      japanese: '月曜日',
      meaning: 'Monday',
    },
  },
  // Add more kanji here
];

export default function KanjiWarmup({ onComplete }: KanjiWarmupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { level } = useJlptLevel();

  const currentKanji = mockKanji[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < mockKanji.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
      onComplete(Math.round((score / mockKanji.length) * 100));
    }
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  if (showResult) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#7c4dff' }}>
          Warmup Complete!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Score: {score}/{mockKanji.length}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <KanjiCard>
        <CardInner $isFlipped={isFlipped}>
          <CardFront onClick={handleFlip}>
            <Typography sx={{ fontSize: '4rem', mb: 2, fontFamily: '"Noto Sans JP", sans-serif' }}>
              {currentKanji.kanji}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                playAudio(currentKanji.kanji);
              }}
              sx={{ color: '#7c4dff' }}
            >
              <VolumeUp />
            </IconButton>
          </CardFront>
          <CardBack onClick={handleFlip}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentKanji.meaning}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#6F767E' }}>
                On'yomi:
              </Typography>
              <Typography>
                {currentKanji.onyomi.join(', ')}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#6F767E' }}>
                Kun'yomi:
              </Typography>
              <Typography>
                {currentKanji.kunyomi.join(', ')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#6F767E' }}>
                Example:
              </Typography>
              <Typography sx={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
                {currentKanji.example.japanese}
              </Typography>
              <Typography>
                {currentKanji.example.meaning}
              </Typography>
            </Box>
          </CardBack>
        </CardInner>
      </KanjiCard>

      {isFlipped && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <ActionButton
            className="incorrect"
            startIcon={<Close />}
            onClick={() => handleAnswer(false)}
          >
            Still Learning
          </ActionButton>
          <ActionButton
            className="correct"
            startIcon={<Check />}
            onClick={() => handleAnswer(true)}
          >
            Got It!
          </ActionButton>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#6F767E' }}>
          {currentIndex + 1} of {mockKanji.length}
        </Typography>
      </Box>
    </Box>
  );
}
