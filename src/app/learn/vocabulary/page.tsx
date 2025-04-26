"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Stack, IconButton, Menu, MenuItem, Select, Paper, Grid } from '@mui/material';
import { VolumeUp, VolumeUpOutlined, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import { Word, Example } from '@/types/vocabulary';

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

const FlipCard = styled(Box)(({ theme }) => ({
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

const WordText = styled(Typography)(({ theme }) => ({
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

const ButtonGrid = styled(Box)(({ theme }) => ({
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
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
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

  useEffect(() => {
    // Initialize with a random word
    const randomWord = n5VocabularyCombined[Math.floor(Math.random() * n5VocabularyCombined.length)];
    setCurrentWord(randomWord);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: Difficulty) => {
    // Get next random word
    const randomWord = n5VocabularyCombined[Math.floor(Math.random() * n5VocabularyCombined.length)];
    setCurrentWord(randomWord);
    setIsFlipped(false);

    if (difficulty === 'forgot') {
      setProgress(prev => Math.max(prev - 5, 0));
    } else {
      setProgress(prev => Math.min(prev + 5, 100));
    }
  };

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
      <FlipCard onClick={() => setIsFlipped(!isFlipped)}>
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
                {currentWord?.meaning}
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

            <Typography sx={{ 
              color: '#666', 
              fontSize: '0.875rem', 
              mb: 2,
              fontWeight: 500,
              alignSelf: 'flex-start'
            }}>
              Example Sentences
            </Typography>
            <Box sx={{ width: '100%' }}>
              {currentWord?.examples?.map((example: Example, i: number) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid #e2e8f0',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ 
                      fontFamily: '"Noto Sans JP", sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      lineHeight: 1.4
                    }}>
                      {example.japanese}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{ 
                        color: '#7c4dff',
                        ml: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const utterance = new SpeechSynthesisUtterance(example.japanese);
                        utterance.lang = 'ja-JP';
                        window.speechSynthesis.speak(utterance);
                      }}
                    >
                      <VolumeUp />
                    </IconButton>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '0.875rem',
                    color: '#666',
                    mb: 1
                  }}>
                    {example.reading}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.875rem',
                    color: '#666'
                  }}>
                    {example.meaning}
                  </Typography>
                </Box>
              ))}
            </Box>
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
