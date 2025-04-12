'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  LinearProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Chip,
  Button
} from '@mui/material';
import { VolumeUp, ChevronLeft, ChevronRight, Refresh } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import styles from '@/styles/kanji-learn.module.css';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI, KanjiData } from '@/data/jlpt-kanji-complete';
import { createKanjiQuestion } from '@/utils/kanji-compounds';
import { KanjiQuestion } from '@/types/kanji';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flex: 1,
  minHeight: 0,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const FlipCardContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  flex: 1,
  minHeight: 0,
}));

interface FlipCardProps {
  isFlipped: boolean;
}

const FlipCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFlipped'
})<FlipCardProps>(({ theme, isFlipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
  cursor: 'pointer',
}));

const CardSide = styled(Card)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  pointerEvents: 'none', // Prevent mouse events on card faces
}));

const CardFront = styled(CardSide)({
  transform: 'translate3d(0, 0, 0) rotateY(0)',
  WebkitTransform: 'translate3d(0, 0, 0) rotateY(0)',
});

const CardBack = styled(CardSide)({
  transform: 'translate3d(0, 0, 0) rotateY(180deg)',
  WebkitTransform: 'translate3d(0, 0, 0) rotateY(180deg)',
});

const ExampleCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
  }
}));

const AnswersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  flex: 1,
  minHeight: 0,
  [theme.breakpoints.up('md')]: {
    maxWidth: '40%',
  },
}));

const AnswerButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  justifyContent: 'flex-start',
  textAlign: 'left',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
  }
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  height: 24,
}));

export default function KanjiPage() {
  const { level } = useJlptLevel();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const kanjiData = {
    'N5': N5_KANJI,
    'N4': N4_KANJI,
    'N3': N3_KANJI,
    'N2': N2_KANJI,
    'N1': N1_KANJI,
  }[level] || N5_KANJI;

  const [currentKanji, setCurrentKanji] = useState<KanjiQuestion>(() => 
    createKanjiQuestion(kanjiData[0])
  );

  const srsOptions = [
    { text: "Repeat", value: 1, className: styles.notYetButton },
    { text: "Hard", value: 2, className: styles.hardButton },
    { text: "Good", value: 3, className: styles.notBadButton },
    { text: "Easy", value: 4, className: styles.easyButton }
  ];

  useEffect(() => {
    const newKanji = createKanjiQuestion(kanjiData[currentIndex]);
    setCurrentKanji(newKanji);
  }, [level, currentIndex, kanjiData]);

  const progress = Math.round((currentIndex / kanjiData.length) * 100);
  const streak = 23;
  const total = kanjiData.length;
  const current = currentIndex + 1;

  const handleFlip = useCallback(() => {
    if (!isFlipping) {
      setIsFlipping(true);
      setIsFlipped(prev => !prev);
      setTimeout(() => setIsFlipping(false), 600);
    }
  }, [isFlipping]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % kanjiData.length);
    setIsFlipped(false);
  }, [kanjiData.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + kanjiData.length) % kanjiData.length);
    setIsFlipped(false);
  }, [kanjiData.length]);

  const handleAnswerClick = (value: number) => {
    // Here we can later implement SRS logic based on the value
    // For now, just move to next card
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Kanji Practice
        </Typography>
        <LevelChip label={level} size="small" />
      </HeaderContainer>

      <ProgressContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress • {current}/{total} Kanji
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              sx={{
                backgroundColor: 'rgba(0, 191, 165, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00bfa5'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={4} justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {progress}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Mastered
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {streak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Streak
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </ProgressContainer>

      <MainContent>
        <FlipCardContainer>
          <FlipCard 
            isFlipped={isFlipped} 
            onClick={handleFlip}
          >
            <CardFront>
              <Box sx={{ 
                position: 'relative', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    left: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto'  
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '8rem', sm: '10rem', md: '12rem' }, 
                    lineHeight: 1.2,
                    fontFamily: '"Noto Sans JP", sans-serif',
                    mb: 2,
                    pointerEvents: 'none'  
                  }}
                >
                  {currentKanji.kanji}
                </Typography>

                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    right: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto'  
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, pointerEvents: 'auto' }}>
                <IconButton 
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle audio
                  }}
                  sx={{ 
                    backgroundColor: (theme) => theme.palette.primary.light,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: 'white',
                    },
                    pointerEvents: 'auto'  
                  }}
                >
                  <VolumeUp />
                </IconButton>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Reading
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {currentKanji.reading}
                  </Typography>
                </Grid>
              </Grid>
            </CardFront>

            <CardBack>
              <Box sx={{ 
                backgroundColor: '#e8e3ff',
                padding: 2,
                borderRadius: 2,
                mb: 3
              }}>
                <Typography variant="h4" align="center" gutterBottom>
                  {currentKanji.meaning}
                </Typography>
                <Typography variant="h5" align="center" color="primary" gutterBottom>
                  {currentKanji.reading}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Common Words:
                </Typography>
                {currentKanji.compounds.filter(c => c.correct).map((compound, i) => (
                  <Box key={i} sx={{ 
                    mb: 2,
                    p: 1.5,
                    borderLeft: '3px solid',
                    borderColor: 'primary.light',
                    backgroundColor: 'background.paper',
                    position: 'relative'
                  }}>
                    <Box sx={{ pr: 4 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
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
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle audio
                      }}
                    >
                      <VolumeUp fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </CardBack>
          </FlipCard>
        </FlipCardContainer>

        <AnswersContainer>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            How well do you know this?
          </Typography>
          {srsOptions.map((option, index) => (
            <AnswerButton
              key={index}
              fullWidth
              variant="text"
              color="inherit"
              onClick={() => handleAnswerClick(option.value)}
              className={`${styles.answerButton} ${option.className}`}
            >
              {option.text}
            </AnswerButton>
          ))}
        </AnswersContainer>
      </MainContent>
    </PageContainer>
  );
}
