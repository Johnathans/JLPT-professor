"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Stack, IconButton, Menu, MenuItem, Select, Paper, Grid } from '@mui/material';
import { VolumeUp, Close, TuneRounded } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import type { Word } from '@/types/vocabulary';

interface GameStats {
  currentRound: number;
  totalRounds: number;
  matchesFound: number;
  totalMatches: number;
}

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
  const [progress, setProgress] = useState(45);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<'flashcard' | 'match' | 'custom'>('flashcard');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [matchTiles, setMatchTiles] = useState<MatchTileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [wrongMatch, setWrongMatch] = useState<string[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    currentRound: 1,
    totalRounds: 10,
    matchesFound: 0,
    totalMatches: 3
  });

  const currentWord: Word = n5VocabularyCombined[currentWordIndex];

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleModeSelect = (mode: 'flashcard' | 'match' | 'custom') => {
    setStudyMode(mode);
    setCurrentWordIndex(0);
    setProgress(0);
    setIsFlipped(false);
    handleMenuClose();
  };

  const handleAddDeck = () => {
    console.log('Add custom deck');
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: Difficulty) => {
    if (difficulty === 'easy') {
      setProgress(prev => Math.min(prev + 20, 100));
    } else if (difficulty === 'good') {
      setProgress(prev => Math.min(prev + 15, 100));
    } else if (difficulty === 'hard') {
      setProgress(prev => Math.min(prev + 10, 100));
    } else {
      setProgress(prev => Math.min(prev + 5, 100));
    }
    setCurrentWordIndex((prev) => (prev + 1) % n5VocabularyCombined.length);
    setIsFlipped(false);
  };

  const modeDisplay = {
    flashcard: 'Flashcard',
    match: 'Match Game',
    custom: 'Custom Deck'
  };

  const startNewRound = () => {
    const vocabList = n5VocabularyCombined;

    // Get 3 random vocabulary words for the round
    const matchVocab = [...vocabList]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => ({
        word: v.word,
        meaning: v.meaning
      }));

    const tiles: MatchTileData[] = [
      ...matchVocab.map(v => ({
        id: `v-${v.word}`,
        content: v.word,
        type: 'vocab' as const,
        matched: false
      })),
      ...matchVocab.map(v => ({
        id: `m-${v.word}`,
        content: v.meaning,
        type: 'meaning' as const,
        matched: false
      }))
    ].sort(() => Math.random() - 0.5);

    setMatchTiles(tiles);
    setSelectedTile(null);
  };

  useEffect(() => {
    if (studyMode === 'match') {
      setGameStats({
        currentRound: 1,
        totalRounds: 10,
        matchesFound: 0,
        totalMatches: 3
      });
      setElapsedTime(0);
      setTimerActive(true);
      startNewRound();
    }
  }, [studyMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleTileClick = (tileId: string) => {
    const clickedTile = matchTiles.find(t => t.id === tileId);
    if (!clickedTile || clickedTile.matched) return;

    if (!selectedTile) {
      setSelectedTile(tileId);
      setWrongMatch([]); // Clear any wrong match state
    } else {
      const firstTile = matchTiles.find(t => t.id === selectedTile)!;
      const secondTile = clickedTile;

      if (firstTile.id.split('-')[1] === secondTile.id.split('-')[1] && firstTile.type !== secondTile.type) {
        // Match found
        setMatchTiles(prev => prev.map(tile => 
          tile.id === firstTile.id || tile.id === secondTile.id
            ? { ...tile, matched: true }
            : tile
        ));
        
        setGameStats(prev => {
          const newMatchesFound = prev.matchesFound + 1;
          
          if (newMatchesFound === prev.totalMatches) {
            if (prev.currentRound === prev.totalRounds) {
              setTimerActive(false);
            } else {
              setTimeout(() => {
                startNewRound();
              }, 1000);
            }
            
            return {
              ...prev,
              currentRound: prev.currentRound === prev.totalRounds 
                ? prev.currentRound 
                : prev.currentRound + 1,
              matchesFound: 0
            };
          }
          
          return {
            ...prev,
            matchesFound: newMatchesFound
          };
        });

        setProgress(prev => Math.min(prev + 5, 100));
      } else {
        // Wrong match
        setWrongMatch([firstTile.id, secondTile.id]);
        setTimeout(() => {
          setWrongMatch([]);
          setSelectedTile(null);
        }, 1000);
      }
      setSelectedTile(null);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
              <MenuItem onClick={() => handleModeSelect('flashcard')}>Flashcard</MenuItem>
              <MenuItem onClick={() => handleModeSelect('match')}>Match Game</MenuItem>
              <MenuItem onClick={() => handleModeSelect('custom')}>Custom Deck</MenuItem>
            </Menu>
          </HeaderControls>
        </Header>
        <ProgressBar value={progress} />
      </Box>

      {studyMode === 'match' ? (
        <MatchContainer>
          <GameHeader>
            <Timer>{formatTime(elapsedTime)}</Timer>
          </GameHeader>
          <MatchGrid container spacing={0}>
            {matchTiles.map((tile) => (
              <Grid item xs={6} sm={4} key={tile.id}>
                <MatchTile
                  onClick={() => handleTileClick(tile.id)}
                  isSelected={selectedTile === tile.id}
                  isMatched={tile.matched}
                  isWrongMatch={wrongMatch.includes(tile.id)}
                >
                  <Typography
                    sx={{
                      fontSize: tile.type === 'vocab' ? '1.5rem' : '1rem',
                      fontWeight: 500,
                      fontFamily: tile.type === 'vocab' ? '"Noto Sans JP", sans-serif' : 'inherit',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                    }}
                  >
                    {tile.content}
                  </Typography>
                </MatchTile>
              </Grid>
            ))}
          </MatchGrid>
        </MatchContainer>
      ) : studyMode === 'flashcard' ? (
        <FlipCard onClick={() => setIsFlipped(!isFlipped)}>
          {!isFlipped ? (
            <>
              <WordText>{currentWord.word}</WordText>
              <Typography sx={{ 
                fontSize: '1.5rem', 
                color: 'text.secondary',
                mb: 2 
              }}>
                {currentWord.reading}
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
              overflow: 'auto'
            }}>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: '#7c4dff', 
                fontWeight: 600 
              }}>
                {currentWord.meaning}
              </Typography>
              {/* Add example sentences here if needed */}
            </Box>
          )}
        </FlipCard>
      ) : null}

      {studyMode === 'flashcard' && (
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
      )}
    </StudyContainer>
  );
}
