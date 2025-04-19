"use client";

import { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Typography, Grid, Paper } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { KanjiData as KanjiDataBasic, N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji-complete';
import { KanjiQuestion, KanjiData } from '@/types/kanji';
import { createKanjiQuestion } from '@/utils/kanji-compounds';
import LearnLayout, { FlipCard, MainText, SubText, MeaningText } from '@/components/learn/LearnLayout';

type StudyMode = 'flashcard' | 'match' | 'writing';
type ExtendedKanjiData = KanjiQuestion;

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
    ? '#ecfdf5' // Light success green
    : isWrongMatch
    ? '#fef2f2' // Light error red
    : isSelected 
    ? '#e8e3ff'
    : '#fff',
  border: `1px solid ${
    isMatched 
      ? '#34d399' // Medium success green
      : isWrongMatch
      ? '#fca5a5' // Medium error red
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

const CompoundCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  '&:last-child': {
    marginBottom: 0
  }
}));

interface MatchTileData {
  id: string;
  content: string;
  type: 'kanji' | 'meaning';
  matched: boolean;
}

interface GameStats {
  currentRound: number;
  totalRounds: number;
  matchesFound: number;
  totalMatches: number;
}

const convertToExtendedKanjiData = (basic: KanjiDataBasic): ExtendedKanjiData => {
  const question = createKanjiQuestion({
    ...basic,
    id: Math.floor(Math.random() * 1000000),
    onyomi: [],
    onyomi_katakana: [],
    kunyomi: [],
    kunyomi_hiragana: [],
    examples: []
  });
  return question;
};

export default function KanjiPage() {
  const { level } = useJlptLevel();
  const [progress, setProgress] = useState(30);
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcard');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentKanji, setCurrentKanji] = useState<ExtendedKanjiData | null>(null);
  const [matchTiles, setMatchTiles] = useState<MatchTileData[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    currentRound: 1,
    totalRounds: 10,
    matchesFound: 0,
    totalMatches: 3
  });
  const [wrongMatch, setWrongMatch] = useState<string[]>([]);

  const startNewRound = useCallback(() => {
    const kanjiList = {
      'N5': N5_KANJI,
      'N4': N4_KANJI,
      'N3': N3_KANJI,
      'N2': N2_KANJI,
      'N1': N1_KANJI
    }[level] || N5_KANJI;

    // Get 3 random kanji for the round
    const matchKanji = [...kanjiList]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(k => ({
        kanji: k.kanji,
        meaning: k.meaning
      }));

    const tiles: MatchTileData[] = [
      ...matchKanji.map(k => ({
        id: `k-${k.kanji}`,
        content: k.kanji,
        type: 'kanji' as const,
        matched: false
      })),
      ...matchKanji.map(k => ({
        id: `m-${k.kanji}`,
        content: k.meaning,
        type: 'meaning' as const,
        matched: false
      }))
    ].sort(() => Math.random() - 0.5);

    setMatchTiles(tiles);
    setSelectedTile(null);
  }, [level]);

  useEffect(() => {
    if (studyMode === 'flashcard') {
      const kanjiList = {
        'N5': N5_KANJI,
        'N4': N4_KANJI,
        'N3': N3_KANJI,
        'N2': N2_KANJI,
        'N1': N1_KANJI
      }[level] || N5_KANJI;

      const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
      setCurrentKanji(convertToExtendedKanjiData(randomKanji));
    } else if (studyMode === 'match') {
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
  }, [level, studyMode, startNewRound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleDifficulty = (difficulty: 'forgot' | 'hard' | 'good' | 'easy') => {
    setProgress((prev) => Math.min(prev + 10, 100));
    setIsFlipped(false);
    // Load next kanji
  };

  const handleModeSelect = (mode: string) => {
    if (mode === 'match') {
      setStudyMode('match');
    } else if (mode === 'writing') {
      setStudyMode('writing');
    } else {
      setStudyMode('flashcard');
    }
  };

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
          
          // If all matches found in current round
          if (newMatchesFound === prev.totalMatches) {
            // If this was the last round
            if (prev.currentRound === prev.totalRounds) {
              setTimerActive(false);
            } else {
              // Start new round
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentKanji && studyMode === 'flashcard') return null;

  return (
    <LearnLayout 
      progress={progress}
      mode={studyMode === 'match' ? 'Match Game' : studyMode === 'writing' ? 'Writing' : 'Flashcards'}
      onModeSelect={handleModeSelect}
      onDifficulty={handleDifficulty}
      showDifficulty={studyMode === 'flashcard'}
    >
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
                      fontSize: tile.type === 'kanji' ? '2rem' : '1rem',
                      fontWeight: 500,
                      fontFamily: tile.type === 'kanji' ? '"Noto Sans JP", sans-serif' : 'inherit'
                    }}
                  >
                    {tile.content}
                  </Typography>
                </MatchTile>
              </Grid>
            ))}
          </MatchGrid>
        </MatchContainer>
      ) : studyMode === 'flashcard' && currentKanji ? (
        <FlipCard 
          onClick={() => setIsFlipped(!isFlipped)}
          sx={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
            '& > *': {
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }
          }}
        >
          <div style={{ transform: 'rotateY(0)' }}>
            <MainText>{currentKanji.kanji}</MainText>
            <SubText>{currentKanji.reading}</SubText>
          </div>
          <div style={{ transform: 'rotateY(180deg)' }}>
            <Box sx={{ width: '100%', maxHeight: '100%', overflow: 'auto', p: 3 }}>
              <MeaningText sx={{ mb: 4 }}>{currentKanji.meaning}</MeaningText>
              
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Common Words
              </Typography>
              
              {currentKanji.compounds.filter(c => c.correct).map((compound, i) => (
                <CompoundCard key={i}>
                  <Box sx={{ pr: 5 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5 }}>
                      {compound.word}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {compound.reading} - {compound.meaning}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.lighter'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle audio
                    }}
                  >
                    <VolumeUp fontSize="small" />
                  </IconButton>
                </CompoundCard>
              ))}
            </Box>
          </div>
        </FlipCard>
      ) : null}
    </LearnLayout>
  );
}
