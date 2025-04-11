'use client';

import { useState, useCallback } from 'react';
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
import styles from '@/styles/vocabulary-learn.module.css';

const PageContainer = styled(Box)(({ theme }) => ({
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
  pointerEvents: 'none',
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

export default function VocabularyPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample vocabulary data (will be fetched from Supabase)
  const sampleVocabulary = [
    {
      front: {
        text: '食べる',
        subtext: 'たべる',
        audio: '/audio/taberu.mp3',
      },
      back: {
        text: 'to eat',
        examples: [
          {
            japanese: '私は寿司を食べます。',
            english: 'I eat sushi.',
          },
          {
            japanese: '朝ごはんを食べましたか？',
            english: 'Did you eat breakfast?',
          },
        ],
        answers: [
          { text: 'to eat', correct: true },
          { text: 'to drink', correct: false },
          { text: 'to cook', correct: false },
          { text: 'to buy', correct: false },
        ],
      },
    },
    // Add more vocabulary items
  ];

  const total = sampleVocabulary.length;
  const current = currentIndex + 1;

  const handleFlip = useCallback(() => {
    if (!isFlipping) {
      setIsFlipping(true);
      setIsFlipped(prev => !prev);
      setTimeout(() => setIsFlipping(false), 600);
    }
  }, [isFlipping]);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    // Handle SRS logic here
    if (direction === 'right') {
      // Mark as correct
    } else {
      // Mark for review
    }
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const progress = 65;
  const streak = 23;

  return (
    <PageContainer>
      <HeaderContainer>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Vocabulary Practice
        </Typography>
        <LevelChip label="N5" size="small" />
      </HeaderContainer>

      <ProgressContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress • {current}/{total} Vocabulary
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(current/total) * 100} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: (theme) => theme.palette.primary.light,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: (theme) => theme.palette.primary.main,
                },
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
                alignItems: 'center',
                pointerEvents: 'none',
              }}>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    left: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto',
                    color: 'text.disabled',
                    opacity: 0.6,
                    '&:hover': {
                      color: 'text.primary',
                      opacity: 1,
                      backgroundColor: 'transparent'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwipe('left');
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '4rem', sm: '5rem', md: '6rem' }, 
                    lineHeight: 1.2,
                    fontFamily: '"Noto Sans JP", sans-serif',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {sampleVocabulary[currentIndex].front.text}
                </Typography>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: '"Noto Sans JP", sans-serif',
                    color: 'text.secondary',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    textAlign: 'center'
                  }}
                >
                  {sampleVocabulary[currentIndex].front.subtext}
                </Typography>

                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    right: 16, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'auto',
                    color: 'text.disabled',
                    opacity: 0.6,
                    '&:hover': {
                      color: 'text.primary',
                      opacity: 1,
                      backgroundColor: 'transparent'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwipe('right');
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 'auto', mb: 3, pointerEvents: 'auto' }}>
                <IconButton 
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle audio
                  }}
                  sx={{ 
                    backgroundColor: (theme) => theme.palette.primary.light,
                    width: 36,
                    height: 36,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: 'white',
                    }
                  }}
                >
                  <VolumeUp sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </CardFront>

            <CardBack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
                  {sampleVocabulary[currentIndex].front.text}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton
                  onClick={handleFlip}
                  size="small"
                  sx={{ 
                    backgroundColor: (theme) => theme.palette.grey[100],
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.grey[200],
                    },
                  }}
                >
                  <Refresh />
                </IconButton>
              </Stack>

              <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Example Usage
              </Typography>
              <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
                {sampleVocabulary[currentIndex].back.examples.map((example, index) => (
                  <ExampleCard key={index}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {example.japanese}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {example.reading}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {example.english}
                    </Typography>
                  </ExampleCard>
                ))}
              </Stack>
            </CardBack>
          </FlipCard>
        </FlipCardContainer>

        <AnswersContainer>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Select the meaning
          </Typography>
          {sampleVocabulary[currentIndex].back.answers.map((answer, index) => (
            <AnswerButton
              key={index}
              fullWidth
              variant="text"
              color="inherit"
              className={styles.answerButton}
              sx={{
                py: 1.5,
                px: 2,
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {answer.text}
            </AnswerButton>
          ))}
        </AnswersContainer>
      </MainContent>
    </PageContainer>
  );
}
