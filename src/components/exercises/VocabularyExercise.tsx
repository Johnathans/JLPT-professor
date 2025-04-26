'use client';

import { useState } from 'react';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VolumeUp from '@mui/icons-material/VolumeUp';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

const VocabCard = styled(Box)(({ theme }) => ({
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

const PartOfSpeechChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(124, 77, 255, 0.08)',
  color: '#7c4dff',
  fontWeight: 500,
  fontSize: '0.75rem',
  height: 24,
}));

interface VocabularyExerciseProps {
  onComplete: (score: number) => void;
}

interface VocabItem {
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string[];
  example: {
    japanese: string;
    meaning: string;
  };
}

// Mock data - replace with real data from your API
const mockVocab: VocabItem[] = [
  {
    word: '食べる',
    reading: 'たべる',
    meaning: 'to eat',
    partOfSpeech: ['verb', 'ichidan'],
    example: {
      japanese: '朝ごはんを食べます。',
      meaning: 'I eat breakfast.',
    },
  },
  {
    word: '学生',
    reading: 'がくせい',
    meaning: 'student',
    partOfSpeech: ['noun'],
    example: {
      japanese: '私は学生です。',
      meaning: 'I am a student.',
    },
  },
  // Add more vocab here
];

export default function VocabularyExercise({ onComplete }: VocabularyExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { level } = useJlptLevel();

  const currentVocab = mockVocab[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < mockVocab.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
      onComplete(Math.round((score / mockVocab.length) * 100));
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
          Vocabulary Complete!
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Score: {score}/{mockVocab.length}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <VocabCard>
        <CardInner $isFlipped={isFlipped}>
          <CardFront onClick={handleFlip}>
            <Typography sx={{ 
              fontSize: '2.5rem', 
              mb: 1,
              fontFamily: '"Noto Sans JP", sans-serif',
              fontWeight: 500
            }}>
              {currentVocab.word}
            </Typography>
            <Typography sx={{ 
              fontSize: '1.5rem', 
              mb: 2,
              fontFamily: '"Noto Sans JP", sans-serif',
              color: '#6F767E'
            }}>
              {currentVocab.reading}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                playAudio(currentVocab.word);
              }}
              sx={{ color: '#7c4dff' }}
            >
              <VolumeUp />
            </IconButton>
          </CardFront>
          <CardBack onClick={handleFlip}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {currentVocab.meaning}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {currentVocab.partOfSpeech.map((pos, index) => (
                <PartOfSpeechChip key={index} label={pos} />
              ))}
            </Box>
            <Box sx={{ mb: 3, width: '100%' }}>
              <Typography variant="subtitle2" sx={{ color: '#6F767E', mb: 1 }}>
                Example:
              </Typography>
              <Typography sx={{ 
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '1.125rem',
                mb: 1
              }}>
                {currentVocab.example.japanese}
              </Typography>
              <Typography sx={{ color: '#6F767E' }}>
                {currentVocab.example.meaning}
              </Typography>
            </Box>
          </CardBack>
        </CardInner>
      </VocabCard>

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
          {currentIndex + 1} of {mockVocab.length}
        </Typography>
      </Box>
    </Box>
  );
}
