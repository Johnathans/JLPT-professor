"use client";

import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { VolumeUp, VolumeUpOutlined, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { KANJI_DATA } from '@/app/admin/kanji/data';
import type { JlptLevel } from '@/contexts/JlptLevelContext';
import type { KanjiData } from '@/app/admin/kanji/data';
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
  const { level } = useJlptLevel();
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<StudyMode>('flashcard');
  const [modeAnchorEl, setModeAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    console.log('KanjiPage: Level changed to:', level);
    console.log('KANJI_DATA:', KANJI_DATA); // Log the entire KANJI_DATA object
    // Convert N5 to n5 format for accessing KANJI_DATA
    const newLevel = level.toLowerCase() as keyof typeof KANJI_DATA;
    console.log('Converted level:', newLevel); // Log the converted level
    const newKanjiList = KANJI_DATA[newLevel];
    console.log('KanjiPage: New kanji list:', newKanjiList); // Log the full kanji list
    if (!newKanjiList) {
      console.error('No kanji list found for level:', newLevel);
    }
    setKanjiList(newKanjiList || []); // Add fallback to empty array
    setCurrentIndex(0); // Reset to first kanji when level changes
    setShowAnswer(false);
  }, [level]); // This effect runs both on mount and when level changes

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
    const utterance = new SpeechSynthesisUtterance(kanjiList[currentIndex].kanji);
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
      <Header>
        <HeaderControls>
          <CloseButton onClick={() => router.push('/dashboard')}>
            <Close />
          </CloseButton>
          <CurrentMode>
            {mode === 'flashcard' ? 'Flashcards' : mode === 'match' ? 'Matching' : 'Writing'}
          </CurrentMode>
        </HeaderControls>
        <HeaderControls>
          <MenuButton onClick={handleMenuOpen}>
            <TuneRounded />
          </MenuButton>
        </HeaderControls>
      </Header>

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
                  {kanjiList[currentIndex].kanji}
                </KanjiCharacter>

                <AudioButton onClick={(e) => {
                  e.stopPropagation(); // Prevent card flip when clicking audio button
                  handlePlayAudio(e);
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
                  {kanjiList[currentIndex].meanings.slice(0, 3).join(', ')}
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
                      {kanjiList[currentIndex].onyomi.length > 0 
                        ? kanjiList[currentIndex].onyomi.slice(0, 3).join('、')
                        : '—'}
                    </ReadingText>
                  </OnYomiBadge>

                  <KunYomiBadge>
                    <ReadingLabel>KUN:</ReadingLabel>
                    <ReadingText>
                      {kanjiList[currentIndex].kunyomi.length > 0 
                        ? kanjiList[currentIndex].kunyomi.slice(0, 3).join('、')
                        : '—'}
                    </ReadingText>
                  </KunYomiBadge>
                </Box>

                {kanjiList[currentIndex].info?.examples?.[0] && (
                  <Example>
                    {kanjiList[currentIndex].info.examples[0]}
                  </Example>
                )}
              </Box>
            )}
          </KanjiCard>

          <ButtonGroup>
            <DifficultyButton className="forgot" onClick={() => handleDifficulty('forgot')}>
              Again
            </DifficultyButton>
            <DifficultyButton className="hard" onClick={() => handleDifficulty('hard')}>
              Hard
            </DifficultyButton>
            <DifficultyButton onClick={() => handleDifficulty('good')}>
              Good
            </DifficultyButton>
            <DifficultyButton onClick={() => handleDifficulty('easy')}>
              Easy
            </DifficultyButton>
          </ButtonGroup>
        </>
      ) : null}
    </StudyContainer>
  );
}
