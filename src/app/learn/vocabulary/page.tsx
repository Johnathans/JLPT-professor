"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Stack, IconButton, Menu, MenuItem, Select, Paper, Grid } from '@mui/material';
import { VolumeUp, VolumeUpOutlined, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { N5Vocabulary, N4Vocabulary, N3Vocabulary, N2Vocabulary, N1Vocabulary } from '@/data/jlpt';
// import { Word, Example } from '@/types/vocabulary';

interface GameStats {
  currentRound: number;
  totalRounds: number;
  correctAnswers: number;
}

type StudyMode = 'flashcard' | 'match' | 'writing';

const modeDisplay = {
  flashcard: 'Flashcards',
  match: 'Match Game',
  writing: 'Writing Practice'
};

interface MatchTileData {
  id: string;
  content: string;
  type: 'vocab' | 'meaning';
  matched: boolean;
}

interface Word {
  kanji?: string;
  kana: string;
  meanings: string[];
  jlpt: number;
  partOfSpeech: string;
}

const StudyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  width: '100%',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
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
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem'
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

const FlipCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '680px',
  aspectRatio: '16/10',
  borderRadius: theme.spacing(4),
  padding: theme.spacing(4),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  [theme.breakpoints.down('sm')]: {
    aspectRatio: '4/3.2',
    padding: theme.spacing(3)
  }
}));

const WordText = styled(Typography)(({ theme }) => ({
  fontSize: '16rem',
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 400,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginTop: theme.spacing(40),
  marginBottom: theme.spacing(5),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(20),
  }
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

const ButtonGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: '600px',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1)
  }
}));

const DifficultyButton = styled(Button)(({ theme }) => ({
  minWidth: '120px',
  border: '2px solid #000',
  borderRadius: '12px',
  padding: '16px',
  fontSize: '1.25rem',
  fontWeight: 500,
  textTransform: 'none',
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff'
  },
  '&.forgot': {
    backgroundColor: '#dc2626',
    color: '#fff',
    border: '2px solid #dc2626',
    '&:hover': {
      backgroundColor: '#b91c1c',
      borderColor: '#b91c1c'
    }
  },
  '&.hard': {
    backgroundColor: '#7c4dff',
    color: '#fff',
    border: '2px solid #7c4dff',
    '&:hover': {
      backgroundColor: '#6b42e0',
      borderColor: '#6b42e0'
    }
  }
}));

const MatchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: theme.spacing(2),
  position: 'relative',
  height: '100%'
}));

const GameHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(0, 1),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
  }
}));

const Timer = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.25rem',
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem'
  }
}));

const MatchGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  padding: theme.spacing(1),
  '& .MuiGrid-item': {
    padding: theme.spacing(1),
  }
}));

const MatchTile = styled(Paper)<{ 
  isSelected?: boolean; 
  isMatched?: boolean; 
  isWrongMatch?: boolean; 
}>(({ theme, isSelected, isMatched, isWrongMatch }) => ({
  aspectRatio: '1',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease-in-out',
  backgroundColor: isMatched 
    ? '#ecfdf5'
    : isWrongMatch
    ? '#fef2f2'
    : isSelected 
    ? '#e8e3ff'
    : '#fff',
  border: `1px solid ${
    isMatched 
      ? '#34d399'
      : isWrongMatch
      ? '#fca5a5'
      : isSelected 
      ? '#7c4dff' 
      : '#e2e8f0'
  }`,
  '&:hover': {
    backgroundColor: isMatched 
      ? '#ecfdf5'
      : isWrongMatch
      ? '#fef2f2'
      : '#e8e3ff',
    transform: isMatched || isWrongMatch ? 'none' : 'translateY(-2px)',
  },
}));

type Difficulty = 'forgot' | 'hard' | 'good' | 'easy';

export default function VocabularyPage() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState<Word | null>(N5Vocabulary[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<'all' | 'known' | 'due'>('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFilterChange = (newFilter: 'all' | 'known' | 'due') => {
    setFilter(newFilter);
    handleMenuClose();
  };

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

  const [level, setLevel] = useState<number>(5);
  const [words, setWords] = useState<Word[]>(N5Vocabulary);
  const [remainingWords, setRemainingWords] = useState<Word[]>([...N5Vocabulary]);

  useEffect(() => {
    const newWords = (() => {
      switch (level) {
        case 1:
          return N1Vocabulary;
        case 2:
          return N2Vocabulary;
        case 3:
          return N3Vocabulary;
        case 4:
          return N4Vocabulary;
        default:
          return N5Vocabulary;
      }
    })();
    setWords(newWords);
    setRemainingWords([...newWords]);
    setCurrentWord(newWords[0]);
  }, [level]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: Difficulty) => {
    const shuffled = [...remainingWords].sort(() => Math.random() - 0.5);
    setRemainingWords(shuffled);
    setCurrentWord(shuffled[0]);
    setIsFlipped(false);

    if (difficulty === 'forgot') {
      setProgress(prev => Math.max(prev - 5, 0));
    } else {
      setProgress(prev => Math.min(prev + 5, 100));
    }
  };

  return (
    <StudyContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
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
        <IconButton onClick={handleMenuOpen}>
          <TuneRounded />
        </IconButton>
      </Box>
      <Box sx={{ width: '100%', maxWidth: '680px', mb: 2 }}>
        <Header>
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
              <MenuItem onClick={() => handleFilterChange('all')}>All Words</MenuItem>
              <MenuItem onClick={() => handleFilterChange('known')}>Known Words</MenuItem>
              <MenuItem onClick={() => handleFilterChange('due')}>Due for Review</MenuItem>
              <Box sx={{ height: '1px', bgcolor: '#e2e8f0', my: 1 }} />
              <MenuItem onClick={() => handleModeSelect('flashcard')}>Flashcards</MenuItem>
              <MenuItem onClick={() => handleModeSelect('match')}>Match Game</MenuItem>
              <MenuItem onClick={() => handleModeSelect('writing')}>Writing Practice</MenuItem>
            </Menu>
          </HeaderControls>
        </Header>
        <ProgressBar value={progress} />
      </Box>
      <FlipCard 
        onClick={() => setIsFlipped(!isFlipped)}
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        {!isFlipped ? (
          <>
            <WordText>{currentWord?.kanji || currentWord?.kana}</WordText>
            <Typography sx={{ 
              fontSize: '1.5rem', 
              color: 'text.secondary',
              mb: 2 
            }}>
              {currentWord?.kana}
            </Typography>
            <AudioButton 
              onClick={(e) => {
                e.stopPropagation();
                // Add audio play logic here
              }}
            >
              <VolumeUp />
            </AudioButton>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            overflow: 'auto',
            width: '100%'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              width: '100%'
            }}>
              <Typography variant="h3" sx={{ 
                color: '#7c4dff', 
                fontWeight: 600,
                flex: 1
              }}>
                {currentWord?.meanings[0]}
              </Typography>
              <Typography
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#e8e3ff',
                  color: '#7c4dff',
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                N5
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 4,
              width: '100%',
              alignItems: 'center'
            }}>
              <Typography sx={{ 
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '1.5rem',
                fontWeight: 500
              }}>
                {currentWord?.kanji || currentWord?.kana}
              </Typography>
              <Typography sx={{ 
                fontFamily: '"Noto Sans JP", sans-serif',
                fontSize: '1rem',
                color: '#666'
              }}>
                {currentWord?.kana}
              </Typography>
              <Typography
                sx={{
                  ml: 'auto',
                  px: 1.5,
                  py: 0.5,
                  bgcolor: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {currentWord?.partOfSpeech}
              </Typography>
            </Box>

            {/* Examples section removed as it's not in the new data structure */}
          </Box>
        )} 
      </FlipCard>
      <ButtonGrid>
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
      </ButtonGrid>
    </StudyContainer>
  );
}
