"use client";

import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { N5Kanji } from '@/data/jlpt';
import type { KanjiData } from '@/data/jlpt';


const StudyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  width: '100%',
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

const KanjiCard = styled(Box)(({ theme }) => ({
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


const KanjiCharacter = styled(Typography)(({ theme }) => ({
  fontSize: '16rem',
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 400,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginTop: theme.spacing(40),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(20),
  },
  marginBottom: theme.spacing(5),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
}));

const ReadingBadge = styled(Box)({
  padding: '8px 16px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: '"Noto Sans JP", sans-serif',
});

const OnYomiBadge = styled(ReadingBadge)({
  backgroundColor: '#fff494',
});

const KunYomiBadge = styled(ReadingBadge)({
  backgroundColor: '#ff9d4d',
});

const ReadingLabel = styled('span')({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#000',
});

const ReadingText = styled('span')({
  fontSize: '1.125rem',
  color: '#000',
});

const Example = styled(Typography)({
  fontSize: '1.25rem',
  color: '#000',
  textAlign: 'center',
  marginTop: '24px',
  fontFamily: '"Noto Sans JP", sans-serif',
});

export default function KanjiPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Select meaning below');
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);
  const correctSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio('/audio/ui/correct-6033.mp3');
  }, []);

  useEffect(() => {
    setKanjiList(N5Kanji);
  }, []);

  useEffect(() => {
    if (kanjiList.length > 0) {
      setCurrentIndex(0);
      setCurrentAnswers(getRandomAnswers(kanjiList[0], kanjiList));
      setShowAnswer(false);
    }
  }, [kanjiList]);

  const getRandomAnswers = (correctKanji: KanjiData, allKanji: KanjiData[], numOptions: number = 4): string[] => {
    // Get the correct meaning
    const correctMeaning = correctKanji.meanings[0];
    
    // Get random incorrect meanings
    const otherMeanings = allKanji
      .filter(k => k !== correctKanji) // Exclude current kanji
      .map(k => k.meanings[0]) // Get first meaning of each
      .filter(m => m !== correctMeaning); // Ensure no duplicates with correct answer
    
    // Shuffle and take numOptions-1 incorrect answers
    const wrongAnswers = [...otherMeanings]
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);
    
    // Combine correct and wrong answers and shuffle
    return [...wrongAnswers, correctMeaning]
      .sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (selectedMeaning: string) => {
    setSelectedAnswer(selectedMeaning);
    const isCorrect = kanjiList[currentIndex].meanings[0] === selectedMeaning;
    setFeedbackMessage(isCorrect ? 'Correct!' : 'Incorrect');
    if (isCorrect && correctSound.current) {
      correctSound.current.currentTime = 0;
      correctSound.current.play();
    }
    setTimeout(handleNext, 1500);
  };

  const handleNext = () => {
    if (currentIndex < kanjiList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setFeedbackMessage('Select meaning below');
      setCurrentAnswers(getRandomAnswers(kanjiList[currentIndex + 1], kanjiList));
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <StudyContainer>
      <Box sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 32px',
        backgroundColor: '#f8fafc',
        zIndex: 10,
      }}>
        <Box sx={{ position: 'relative', width: '100%', mb: 2, display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <CloseButton onClick={() => router.push('/learn')}>
            <Close />
          </CloseButton>
          <Box sx={{
            flex: 1,
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${((currentIndex + 1) / kanjiList.length) * 100}%`,
              backgroundColor: '#89ce00',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>
      </Box>
      {/* Spacer to prevent content from going under fixed header */}
      {kanjiList.length > 0 ? (
        <>
          <KanjiCard>
            <Box sx={{ 
              width: '100%',
              maxWidth: '600px',
              height: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative'
            }}>
              <KanjiCharacter>
                {kanjiList[currentIndex].character}
              </KanjiCharacter>
              <Typography 
                variant="h6"
                sx={{ 
                  color: selectedAnswer 
                    ? kanjiList[currentIndex].meanings[0] === selectedAnswer
                      ? '#00c853'
                      : '#d50000'
                    : '#000000', 
                  mt: 2, 
                  mb: 3,
                  fontWeight: selectedAnswer ? 600 : 400,
                  fontSize: '1.25rem'
                }}
              >
                {feedbackMessage}
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2, 
                width: '100%', 
                maxWidth: '600px',
                px: 2
              }}>
                {currentAnswers.map((meaning, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(meaning)}
                    sx={{
                      backgroundColor: selectedAnswer === meaning
                        ? kanjiList[currentIndex].meanings[0] === meaning
                          ? '#00c853' // More vibrant green
                          : '#d50000' // More vibrant red
                        : '#fff',
                      color: selectedAnswer === meaning ? '#ffffff' : '#000000',
                      opacity: '1 !important',
                      '&.Mui-disabled': {
                        opacity: '1 !important',
                        color: selectedAnswer === meaning ? '#ffffff' : '#000000'
                      },
                      border: '2px solid #000',
                      borderRadius: '12px',
                      padding: '16px',
                      textTransform: 'none',
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: selectedAnswer ? undefined : '#e8e3ff',
                        borderColor: selectedAnswer ? undefined : '#7c4dff'
                      }
                    }}
                    disabled={selectedAnswer !== null}
                  >
                    {meaning}
                  </Button>
                ))}
              </Box>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: '0.875rem',
                  mt: 4,
                  textAlign: 'center'
                }}
              >
                Accuracy: 85%
              </Typography>
            </Box>
          </KanjiCard>
        </>
      ) : null}
    </StudyContainer>
  );
}
