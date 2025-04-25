"use client";

import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Menu, MenuItem } from '@mui/material';
import { VolumeUp, VolumeUpOutlined, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { KanjiData as KanjiDataBasic, N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji-complete';
import { KanjiQuestion } from '@/types/kanji';
import { createKanjiQuestion } from '@/utils/kanji-compounds';
import { useRouter } from 'next/navigation';

type StudyMode = 'flashcard' | 'match' | 'writing';
type ExtendedKanjiData = KanjiQuestion;

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
  width: '100%',
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

export default function KanjiPage() {
  const router = useRouter();
  const { level } = useJlptLevel();
  const [currentKanji, setCurrentKanji] = useState<ExtendedKanjiData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load initial kanji
    const kanjiList = level === 'N5' ? N5_KANJI :
                     level === 'N4' ? N4_KANJI :
                     level === 'N3' ? N3_KANJI :
                     level === 'N2' ? N2_KANJI : N1_KANJI;
    
    const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    setCurrentKanji(convertToExtendedKanjiData(randomKanji));
  }, [level]);

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleModeSelect = (mode: StudyMode) => {
    setStudyMode(mode);
    handleMenuClose();
  };

  const modeDisplay = {
    flashcard: 'Flashcards',
    match: 'Match Game',
    writing: 'Writing Practice'
  };

  const handleDifficulty = (difficulty: 'forgot' | 'hard' | 'good' | 'easy') => {
    // Update progress based on difficulty
    const progressIncrement = difficulty === 'forgot' ? 5 :
                            difficulty === 'hard' ? 10 :
                            difficulty === 'good' ? 15 :
                            20; // easy
    setProgress(prev => Math.min(100, prev + progressIncrement));

    // Load next kanji
    const kanjiList = level === 'N5' ? N5_KANJI :
                     level === 'N4' ? N4_KANJI :
                     level === 'N3' ? N3_KANJI :
                     level === 'N2' ? N2_KANJI : N1_KANJI;
    
    const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
    setCurrentKanji(convertToExtendedKanjiData(randomKanji));
    setIsFlipped(false);
  };

  const convertToExtendedKanjiData = (basic: KanjiDataBasic): ExtendedKanjiData => {
    return createKanjiQuestion({
      ...basic,
      id: Math.floor(Math.random() * 1000000),
      onyomi: [],
      onyomi_katakana: [],
      kunyomi: [],
      kunyomi_hiragana: [],
      examples: []
    });
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    if (currentKanji && !isPlaying) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(currentKanji.kanji);
      utterance.lang = 'ja-JP';
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!currentKanji) return null;

  return (
    <StudyContainer>
      <Box sx={{ width: '100%', maxWidth: '680px', mb: 2 }}>
        <Header>
          <CloseButton onClick={handleClose}>
            <Close />
          </CloseButton>
          <HeaderControls>
            <CurrentMode>{modeDisplay[studyMode]}</CurrentMode>
            <MenuButton onClick={handleMenuOpen}>
              <TuneRounded />
            </MenuButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: '12px',
                  minWidth: '160px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <MenuItem onClick={() => handleModeSelect('flashcard')}>Flashcard</MenuItem>
              <MenuItem onClick={() => handleModeSelect('match')}>Match Game</MenuItem>
              <MenuItem onClick={() => handleModeSelect('writing')}>Writing Practice</MenuItem>
            </Menu>
          </HeaderControls>
        </Header>
        <ProgressBar value={progress} />
      </Box>

      <KanjiCard onClick={() => setIsFlipped(!isFlipped)}>
        {!isFlipped ? (
          <>
            <KanjiCharacter>{currentKanji.kanji}</KanjiCharacter>
            <AudioButton 
              onClick={handlePlayAudio}
              disabled={isPlaying}
            >
              {isPlaying ? <VolumeUp /> : <VolumeUpOutlined />}
            </AudioButton>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            overflow: 'auto'
          }}>
            <Typography variant="h3" sx={{ mb: 4, color: '#7c4dff', fontWeight: 600 }}>
              {currentKanji.meaning}
            </Typography>
            {currentKanji.compounds.filter(c => c.correct).map((compound, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  p: 2,
                  borderBottom: '1px solid #e2e8f0',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
                    {compound.word}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {compound.reading} - {compound.meaning}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{ color: '#7c4dff' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle audio
                  }}
                >
                  <VolumeUp />
                </IconButton>
              </Box>
            ))}
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
    </StudyContainer>
  );
}
