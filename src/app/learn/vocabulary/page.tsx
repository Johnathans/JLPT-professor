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

const PageWrapper = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
});

const Header = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: '12px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2,
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
  }
}));

const HeaderControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const CurrentMode = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1rem',
  fontWeight: 500,
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

const ProgressBar = styled(Box)<{ value: number }>(({ value }) => ({
  position: 'absolute',
  top: '64px',
  left: 0,
  right: 0,
  height: '8px',
  backgroundColor: 'rgba(124, 77, 255, 0.1)',
  zIndex: 1,
  '&::after': {
    content: '""',
    position: 'absolute',
    height: '100%',
    width: `${value}%`,
    backgroundColor: '#7c4dff',
    transition: 'width 0.3s ease',
  },
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  paddingTop: '96px', 
  paddingBottom: '140px', 
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    paddingTop: '88px', 
    paddingBottom: '120px'
  }
}));

const FlipCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  height: '500px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: '24px',
  [theme.breakpoints.down('sm')]: {
    height: '400px',
    padding: '24px',
    borderRadius: '16px',
  }
}));

const FooterArea = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(124, 77, 255, 0.08)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px 24px', 
  [theme.breakpoints.down('sm')]: {
    padding: '16px'
  }
}));

const ButtonGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  }
}));

const DifficultyButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: '#fff',
  color: '#7c4dff',
  border: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  height: '48px',
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    color: '#5e35b1',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    fontSize: '0.9rem'
  }
}));

const WordText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(4rem, 10vw, 6rem)',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.2,
}));

const ReadingText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.4,
}));

const MeaningText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
  color: theme.palette.text.primary,
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.4,
  textAlign: 'center',
  maxWidth: '90%',
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
    <PageWrapper>
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
      <ContentArea>
        {studyMode === 'match' ? (
          <MatchContainer>
            <GameHeader>
              <Timer>{formatTime(elapsedTime)}</Timer>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Round {gameStats.currentRound} of {gameStats.totalRounds}
              </Typography>
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
                        wordBreak: 'break-word'
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
          <FlipCard onClick={handleFlip} elevation={3}>
            <Box sx={{ textAlign: 'center' }}>
              {!isFlipped ? (
                <>
                  <WordText>{currentWord.word}</WordText>
                  <ReadingText>{currentWord.reading}</ReadingText>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add audio play logic here
                    }}
                    sx={{ mt: 2 }}
                  >
                    <VolumeUp />
                  </IconButton>
                </>
              ) : (
                <MeaningText>{currentWord.meaning}</MeaningText>
              )}
            </Box>
          </FlipCard>
        ) : null}
      </ContentArea>

      <FooterArea>
        {studyMode === 'flashcard' && (
          <ButtonGrid>
            <DifficultyButton onClick={() => handleDifficulty('forgot')}>
              Forgot
            </DifficultyButton>
            <DifficultyButton onClick={() => handleDifficulty('hard')}>
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
      </FooterArea>
    </PageWrapper>
  );
}
