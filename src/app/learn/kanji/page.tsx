"use client";

import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { VolumeUp, VolumeUpOutlined, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { N5Kanji, N4Kanji, N3Kanji, N2Kanji, N1Kanji } from '@/data/jlpt';
import type { KanjiData } from '@/data/jlpt';
import { useRouter } from 'next/navigation';

type StudyMode = 'flashcard' | 'match' | 'writing';

const StudyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minHeight: '100vh',
  padding: theme.spacing(1),
  backgroundColor: '#f8fafc',
  position: 'relative'
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '680px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const HeaderControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}));

const CurrentMode = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.text.secondary
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#fff',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  color: '#7c4dff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }
}));

const ProgressBar = styled(Box)<{ value: number }>(({ theme, value }) => ({
  width: '100%',
  maxWidth: '680px',
  height: '4px',
  backgroundColor: '#e8e3ff',
  position: 'relative',
  borderRadius: '2px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    backgroundColor: '#7c4dff',
    transition: 'width 0.3s ease'
  }
}));

const KanjiCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '680px',
  aspectRatio: '16/10',
  backgroundColor: '#fff',
  borderRadius: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  '&:hover': {
    transform: 'translateY(-4px)'
  },
  [theme.breakpoints.down('sm')]: {
    aspectRatio: '4/3.2',
    padding: theme.spacing(3)
  }
}));

const KanjiCharacter = styled(Typography)(({ theme }) => ({
  fontSize: '12rem',
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 400,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginBottom: theme.spacing(5),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const AudioButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#e8e3ff',
  color: '#7c4dff',
  '&:hover': {
    backgroundColor: '#d3c6ff'
  },
  '& svg': {
    fontSize: '1.5rem'
  }
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: '680px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1.5)
  }
}));

const DifficultyButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  backgroundColor: '#e8e3ff',
  color: '#7c4dff',
  '&:hover': {
    backgroundColor: '#d3c6ff'
  },
  '&.forgot': {
    backgroundColor: '#5e35b1',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4527a0'
    }
  },
  '&.hard': {
    backgroundColor: '#7c4dff',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#6b42e0'
    }
  }
}));

const ReadingBadge = styled(Box)({
  padding: '8px 16px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: '"Noto Sans JP", sans-serif',
});

const OnYomiBadge = styled(ReadingBadge)({
  backgroundColor: '#fff494',
});

const KunYomiBadge = styled(ReadingBadge)({
  backgroundColor: '#ff9d4d',
});

const ReadingLabel = styled('span')({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#000',
});

const ReadingText = styled('span')({
  fontSize: '1.125rem',
  color: '#000',
});

const Example = styled(Typography)({
  fontSize: '1.25rem',
  color: '#000',
  textAlign: 'center',
  marginTop: '24px',
  fontFamily: '"Noto Sans JP", sans-serif',
});

export default function KanjiPage() {
  const router = useRouter();
  const [level, setLevel] = useState<number>(5);
  const [mode, setMode] = useState<StudyMode>('flashcard');
  const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const kanjiList = (() => {
    switch (level) {
      case 1:
        return N1Kanji;
      case 2:
        return N2Kanji;
      case 3:
        return N3Kanji;
      case 4:
        return N4Kanji;
      default:
        return N5Kanji;
    }
  })();

  const [remainingKanji, setRemainingKanji] = useState(N5Kanji);

  useEffect(() => {
    setRemainingKanji(kanjiList);
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [level, kanjiList]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setModeAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setModeAnchorEl(null);
  };

  const handleModeSelect = (newMode: StudyMode) => {
    setMode(newMode);
    handleMenuClose();
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(kanjiList[currentIndex].character);
    utterance.lang = 'ja-JP';
    utterance.onend = () => {
      setIsPlaying(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleDifficulty = (difficulty: 'forgot' | 'hard' | 'good' | 'easy') => {
    if (currentIndex < kanjiList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <StudyContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <CloseButton onClick={() => router.push('/dashboard')}>
          <Close />
        </CloseButton>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[5, 4, 3, 2, 1].map((n) => (
            <Button
              key={n}
              variant={level === n ? 'contained' : 'outlined'}
              onClick={() => setLevel(n)}
              sx={{
                minWidth: 'auto',
                px: 1,
                backgroundColor: level === n ? '#7c4dff' : 'transparent',
                borderColor: '#7c4dff',
                color: level === n ? 'white' : '#7c4dff',
                '&:hover': {
                  backgroundColor: level === n ? '#5e35b1' : 'rgba(124, 77, 255, 0.1)',
                  borderColor: '#7c4dff'
                }
              }}
            >
              N{n}
            </Button>
          ))}
        </Box>
        <HeaderControls>
          <CurrentMode>
            {mode === 'flashcard' ? 'Flashcards' : mode === 'match' ? 'Matching' : 'Writing'}
          </CurrentMode>
          <MenuButton onClick={handleMenuOpen}>
            <TuneRounded />
          </MenuButton>
        </HeaderControls>
      </Box>
      <Menu
        anchorEl={modeAnchorEl}
        open={Boolean(modeAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleModeSelect('flashcard')}>Flashcards</MenuItem>
        <MenuItem onClick={() => handleModeSelect('match')}>Matching</MenuItem>
        <MenuItem onClick={() => handleModeSelect('writing')}>Writing</MenuItem>
      </Menu>

      <ProgressBar value={((currentIndex + 1) / kanjiList.length) * 100} />

      {kanjiList.length > 0 ? (
        <>
          <KanjiCard onClick={() => setShowAnswer(prev => !prev)}>
            {!showAnswer ? (
              <>
                <KanjiCharacter>
                  {kanjiList[currentIndex].character}
                </KanjiCharacter>

                <AudioButton onClick={(e) => {
                  e.stopPropagation(); // Prevent card flip when clicking audio button
                  const utterance = new SpeechSynthesisUtterance(kanjiList[currentIndex].character);
                  utterance.lang = 'ja-JP';
                  window.speechSynthesis.speak(utterance);
                }}>
                  {isPlaying ? <VolumeUpOutlined /> : <VolumeUp />}
                </AudioButton>
              </>
            ) : (
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                py: 2
              }}>
                <Typography variant="h3" sx={{ 
                  fontSize: '2rem',
                  mb: 2,
                  fontWeight: 500
                }}>
                  {kanjiList[currentIndex].meanings.join(', ')}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  mb: 2
                }}>
                  <OnYomiBadge>
                    <ReadingLabel>ON:</ReadingLabel>
                    <ReadingText>
                      {kanjiList[currentIndex].onyomi.join('、')}
                    </ReadingText>
                  </OnYomiBadge>

                  <KunYomiBadge>
                    <ReadingLabel>KUN:</ReadingLabel>
                    <ReadingText>
                      {kanjiList[currentIndex].kunyomi.join('、')}
                    </ReadingText>
                  </KunYomiBadge>
                </Box>
              </Box>
            )}
          </KanjiCard>

          <ButtonGroup>
            <DifficultyButton 
              className="forgot" 
              onClick={() => handleDifficulty('forgot')}
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#d32f2f'
                }
              }}
            >
              Again
            </DifficultyButton>
            <DifficultyButton 
              className="hard" 
              onClick={() => handleDifficulty('hard')}
              sx={{
                backgroundColor: '#7c4dff',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#5e35b1'
                }
              }}
            >
              Hard
            </DifficultyButton>
            <DifficultyButton 
              onClick={() => handleDifficulty('good')}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#388e3c'
                }
              }}
            >
              Good
            </DifficultyButton>
            <DifficultyButton 
              onClick={() => handleDifficulty('easy')}
              sx={{
                backgroundColor: '#00bfa5',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#00897b'
                }
              }}
            >
              Easy
            </DifficultyButton>
          </ButtonGroup>
        </>
      ) : null}
    </StudyContainer>
  );
}
