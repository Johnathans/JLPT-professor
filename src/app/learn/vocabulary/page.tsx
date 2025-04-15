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
  Button,
  Switch
} from '@mui/material';
import { VolumeUp, ChevronLeft, ChevronRight, Refresh } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import styles from '@/styles/vocabulary-learn.module.css';
import ContentContainer from '@/components/shared/ContentContainer';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';

const PageContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2)
  },
  '& > *': {
    width: '100%'
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%'
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flex: 1,
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const FlipCardContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  flex: 1,
  width: '100%',
  minHeight: '400px',
  display: 'flex',
  [theme.breakpoints.up('sm')]: {
    minHeight: '450px',
  },
  [theme.breakpoints.up('md')]: {
    flex: 3,
    minHeight: '600px',
  },
}));

const FlipCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isFlipped'
})<{ isFlipped: boolean }>(({ theme, isFlipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
  cursor: 'pointer',
  display: 'flex',
  borderRadius: theme.spacing(2),
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
}));

const CardSide = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translate3d(0, 0, 0)',
  WebkitTransform: 'translate3d(0, 0, 0)',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  padding: '32px'
});

const CardFront = styled(CardSide)({
  transform: 'translate3d(0, 0, 0) rotateY(0)',
  WebkitTransform: 'translate3d(0, 0, 0) rotateY(0)',
});

const CardBack = styled(CardSide)({
  transform: 'translate3d(0, 0, 0) rotateY(180deg)',
  WebkitTransform: 'translate3d(0, 0, 0) rotateY(180deg)',
});

const AnswersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    flex: 2,
  },
}));

const AnswersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const AnswerButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: theme.spacing(2),
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: '#fff',
  border: '1px solid #E2E8F0',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1'
  },
  '&.correct': {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    color: '#166534'
  },
  '&.incorrect': {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    color: '#991B1B'
  }
}));

const ModeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const ModeLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#64748B',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem'
  }
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#F6F3FF',
  color: '#7C4DFF',
  fontWeight: 600,
  height: 24,
}));

export default function VocabularyPage() {
  const { level } = useJlptLevel();
  const [studyMode, setStudyMode] = useState<'word' | 'sentence'>('word');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const vocabularyData = n5VocabularyCombined;
  const currentWord = vocabularyData[currentIndex];
  const total = vocabularyData.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const handleModeChange = (newMode: 'word' | 'sentence') => {
    setStudyMode(newMode);
    setIsFlipped(false); // Reset card to front when changing modes
  };

  const handleAnswerClick = (value: number) => {
    setSelectedAnswer(value);
    setIsCorrect(value >= 3);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabularyData.length);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setIsFlipped(false);
    }, 500);
  };

  const srsOptions = [
    { text: 'Repeat', value: 1, className: '' },
    { text: 'Hard', value: 2, className: '' },
    { text: 'Good', value: 3, className: '' },
    { text: 'Easy', value: 4, className: '' }
  ];

  return (
    <ContentContainer>
      <PageContainer>
        <HeaderContainer>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: '#1A2027',
              fontSize: { xs: '1.75rem', md: '2rem' },
              letterSpacing: '-0.02em',
              mb: 1
            }}>
              Learn Vocabulary
            </Typography>
          </Box>
          <ModeToggle>
            <ModeLabel>Word</ModeLabel>
            <Switch
              checked={studyMode === 'sentence'}
              onChange={() => handleModeChange(studyMode === 'word' ? 'sentence' : 'word')}
              color="primary"
            />
            <ModeLabel>Sentence</ModeLabel>
          </ModeToggle>
        </HeaderContainer>

        <ProgressContainer>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                Daily Progress
              </Typography>
              <LevelChip label={level} size="small" />
            </Stack>
            <Typography variant="h6" sx={{ color: '#7C4DFF', fontWeight: 600 }}>
              {currentIndex + 1}/{total} Words
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={((currentIndex + 1) / total) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#7C4DFF',
                borderRadius: 4
              }
            }}
          />
        </ProgressContainer>

        <MainContent>
          <FlipCardContainer>
            <FlipCard isFlipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)}>
              <CardFront>
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <LevelChip label="N5" size="small" />
                </Box>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle audio
                    }}
                    sx={{
                      color: '#7C4DFF',
                      '&:hover': {
                        backgroundColor: '#F6F3FF'
                      }
                    }}
                  >
                    <VolumeUp />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    p: 4,
                    pt: 8
                  }}
                >
                  {studyMode === 'word' ? (
                    <Stack spacing={2} alignItems="center">
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: {
                            xs: '4rem',
                            sm: '6rem',
                            md: '8rem'
                          },
                          fontWeight: 700,
                          color: '#1A2027',
                          textAlign: 'center',
                          lineHeight: 1.2,
                          fontFamily: '"Noto Sans JP", sans-serif'
                        }}
                      >
                        {currentWord.word}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#64748B',
                          fontWeight: 500,
                          fontFamily: '"Noto Sans JP", sans-serif'
                        }}
                      >
                        {currentWord.reading}
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack spacing={3} sx={{ maxWidth: '80%' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: {
                            xs: '1.5rem',
                            sm: '2rem',
                            md: '2.5rem'
                          },
                          fontWeight: 700,
                          color: '#1A2027',
                          textAlign: 'center',
                          lineHeight: 1.6,
                          fontFamily: '"Noto Sans JP", sans-serif'
                        }}
                      >
                        {currentWord.sentence}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#64748B',
                          textAlign: 'center',
                          fontSize: {
                            xs: '1rem',
                            sm: '1.25rem'
                          },
                          fontFamily: '"Noto Sans JP", sans-serif'
                        }}
                      >
                        {currentWord.sentenceReading}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </CardFront>

              <CardBack>
                <Box
                  sx={{
                    backgroundColor: '#F6F3FF',
                    padding: 4,
                    borderRadius: 2,
                    mb: 4,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#1A2027',
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    {studyMode === 'word' ? currentWord.meaning : currentWord.sentenceMeaning}
                  </Typography>
                  {studyMode === 'word' && (
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#7C4DFF',
                        fontWeight: 600
                      }}
                    >
                      {currentWord.reading}
                    </Typography>
                  )}
                </Box>

                {studyMode === 'word' && currentWord.sentence && (
                  <Box sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#1A2027',
                        fontWeight: 700,
                        mb: 3
                      }}
                    >
                      Example Sentence
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: '#F8FAFC',
                        borderRadius: 2
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#1A2027',
                          mb: 1,
                          fontSize: '1.1rem'
                        }}
                      >
                        {currentWord.sentence}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748B'
                        }}
                      >
                        {currentWord.sentenceReading}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748B',
                          mt: 2
                        }}
                      >
                        {currentWord.sentenceMeaning}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardBack>
            </FlipCard>
          </FlipCardContainer>

          <AnswersContainer>
            <Typography
              variant="h6"
              sx={{
                color: '#1A2027',
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              How well do you know this?
            </Typography>
            <AnswersGrid>
              {srsOptions.map((option, index) => (
                <AnswerButton
                  key={index}
                  fullWidth
                  onClick={() => handleAnswerClick(option.value)}
                  className={option.className}
                  sx={{
                    py: 2,
                    px: 3,
                    fontSize: '1rem'
                  }}
                >
                  {option.text}
                </AnswerButton>
              ))}
            </AnswersGrid>
          </AnswersContainer>
        </MainContent>
      </PageContainer>
    </ContentContainer>
  );
}
