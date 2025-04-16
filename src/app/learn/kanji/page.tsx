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
  Button,
  Switch
} from '@mui/material';
import { VolumeUp, ChevronLeft, ChevronRight, Refresh, School, MenuBook } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import styles from '@/styles/kanji-learn.module.css';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { KanjiData as KanjiDataBasic, N5_KANJI, N4_KANJI, N3_KANJI, N2_KANJI, N1_KANJI } from '@/data/jlpt-kanji-complete';
import { KanjiQuestion, KanjiData, CompoundWord } from '@/types/kanji';
import { createKanjiQuestion } from '@/utils/kanji-compounds';
import ContentContainer from '@/components/shared/ContentContainer';

type ExtendedKanjiData = KanjiQuestion;

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
  display: 'flex',
}));

const CardSide = styled(Card)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
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
  color: '#1A2027',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  whiteSpace: 'normal',
  lineHeight: 1.2,
  '&:hover': {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1'
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '80px',
    padding: theme.spacing(1.5),
    fontSize: '0.9rem'
  }
}));

const CompoundCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
  border: '1px solid #E2E8F0',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#F8FAFC'
  }
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  height: 24,
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

interface FlipCardProps {
  isFlipped: boolean;
}

export default function KanjiPage() {
  const { level } = useJlptLevel();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [studyMode, setStudyMode] = useState<'single' | 'compounds'>('single');
  const [currentCompoundIndex, setCurrentCompoundIndex] = useState(0);
  
  const kanjiData = {
    'N5': N5_KANJI,
    'N4': N4_KANJI,
    'N3': N3_KANJI,
    'N2': N2_KANJI,
    'N1': N1_KANJI,
  }[level] || N5_KANJI;

  const [currentKanji, setCurrentKanji] = useState<ExtendedKanjiData>(convertToExtendedKanjiData(N5_KANJI[0]));

  const srsOptions = [
    { text: "Repeat", value: 1, className: styles.notYetButton },
    { text: "Hard", value: 2, className: styles.hardButton },
    { text: "Good", value: 3, className: styles.notBadButton },
    { text: "Easy", value: 4, className: styles.easyButton }
  ];

  useEffect(() => {
    const newKanji = convertToExtendedKanjiData(kanjiData[currentIndex]);
    setCurrentKanji(newKanji);
  }, [level, currentIndex, kanjiData]);

  const progress = Math.round((currentIndex / kanjiData.length) * 100);
  const streak = 23;
  const total = kanjiData.length;
  const current = currentIndex + 1;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

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

  const handleModeChange = (newMode: 'single' | 'compounds') => {
    setStudyMode(newMode);
    setIsFlipped(false); // Reset card to front when changing modes
  };

  return (
    <ContentContainer maxWidth="lg" sx={{ pb: { xs: 10, md: 3 } }}>
      <PageContainer>
        <Box sx={{ width: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1A2027',
                fontSize: { xs: '1.75rem', md: '2rem' },
                letterSpacing: '-0.02em'
              }}
            >
              Learn Kanji
            </Typography>
            
            <ModeToggle>
              <ModeLabel>Single</ModeLabel>
              <Switch
                checked={studyMode === 'compounds'}
                onChange={(e) => handleModeChange(e.target.checked ? 'compounds' : 'single')}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#7C4DFF',
                    '&:hover': {
                      backgroundColor: 'rgba(124, 77, 255, 0.08)'
                    }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#7C4DFF'
                  }
                }}
              />
              <ModeLabel>Compounds</ModeLabel>
            </ModeToggle>
          </Stack>

          <ProgressContainer>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#1A2027',
                mb: 1
              }}
            >
              Daily Progress
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#7C4DFF',
                mb: 2
              }}
            >
              {current}/{total} Kanji
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#F6F3FF',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#7C4DFF',
                  borderRadius: 4
                }
              }}
            />
          </ProgressContainer>
        </Box>

        <MainContent>
          <FlipCardContainer>
            <FlipCard 
              isFlipped={isFlipped} 
              onClick={handleFlip}
            >
              <CardFront>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 4 }}
                >
                  <LevelChip label={`N${currentKanji.level}`} size="small" />
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
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 0
                  }}
                >
                  {studyMode === 'single' ? (
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: {
                          xs: '6rem',
                          sm: '8rem',
                          md: '12rem'
                        },
                        fontWeight: 700,
                        color: '#1A2027',
                        textAlign: 'center',
                        lineHeight: 1.2
                      }}
                    >
                      {currentKanji.kanji}
                    </Typography>
                  ) : (
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: {
                          xs: '3rem',
                          sm: '4rem',
                          md: '5rem'
                        },
                        fontWeight: 700,
                        color: '#1A2027',
                        textAlign: 'center'
                      }}
                    >
                      {currentKanji.compounds[currentCompoundIndex]?.word || currentKanji.kanji}
                    </Typography>
                  )}
                </Box>
              </CardFront>

              <CardBack>
                {studyMode === 'single' ? (
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
                      {currentKanji.meaning}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#7C4DFF',
                        fontWeight: 600
                      }}
                    >
                      {currentKanji.reading}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#1A2027',
                        fontWeight: 700,
                        mb: 3
                      }}
                    >
                      Common Words
                    </Typography>

                    {currentKanji.compounds.filter(c => c.correct).map((compound, i) => (
                      <CompoundCard key={i}>
                        <Box sx={{ pr: 5 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              color: '#1A2027',
                              mb: 0.5
                            }}
                          >
                            {compound.word}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#637381'
                            }}
                          >
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
                            color: '#7C4DFF',
                            '&:hover': {
                              backgroundColor: '#F6F3FF'
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
                mb: 2,
                textAlign: { xs: 'center', md: 'left' }
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
