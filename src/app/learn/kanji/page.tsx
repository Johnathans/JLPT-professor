"use client";

import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { N5Kanji } from '@/data/jlpt';
import type { KanjiData } from '@/data/jlpt';
import FeedbackBanner from '@/components/learn/FeedbackBanner';
import ProgressBar from '@/components/learn/ProgressBar';


const StudyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'relative',
  width: 'calc(100% + 32px)',
  margin: 0,
  marginLeft: '-16px',
  marginRight: '-16px',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
  paddingTop: '24px',
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
  width: '100%',
  maxWidth: '600px',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(6, 0, 0, 0),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(5),
}));

const KanjiCharacter = styled(Typography)(({ theme }) => ({
  fontSize: '15rem',
  lineHeight: 1,
  fontFamily: '"Noto Sans JP", sans-serif',
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
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [kanjiList, setKanjiList] = useState<KanjiData[]>([]);
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio('/audio/ui/ui_correct_button2-103167 (1).mp3');
    incorrectSound.current = new Audio('/audio/ui/button_10-190436.mp3');
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
    
    if (isCorrect && correctSound.current) {
      correctSound.current.currentTime = 0;
      correctSound.current.play();
    } else if (!isCorrect && incorrectSound.current) {
      incorrectSound.current.currentTime = 0;
      incorrectSound.current.play();
    }
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < kanjiList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentAnswers(getRandomAnswers(kanjiList[currentIndex + 1], kanjiList));
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <StudyContainer>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bgcolor: '#ffffff',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <Box sx={{ 
          position: 'relative', 
          width: '100%',
          maxWidth: '800px',
          mx: 'auto',
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          px: 2
        }}>
          <CloseButton onClick={() => router.push('/learn')}>
            <Close />
          </CloseButton>
          <ProgressBar 
            total={kanjiList.length} 
            current={currentIndex}
          />
        </Box>
      </Box>
      {/* Spacer to prevent content from going under fixed header */}
      {kanjiList.length > 0 ? (
        <>
          <KanjiCard>
            <KanjiCharacter>
              {kanjiList[currentIndex].character}
            </KanjiCharacter>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 2, 
              width: '100%', 
              maxWidth: '600px',
              px: 6,
              pb: showFeedback ? 0 : 6
            }}>
              {currentAnswers.map((meaning, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(meaning)}
                  disabled={selectedAnswer !== null}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000000',
                    opacity: '1 !important',
                    '&.Mui-disabled': {
                      opacity: '1 !important',
                      color: selectedAnswer === meaning ? '#ffffff' : '#666666',
                      backgroundColor: selectedAnswer === meaning
                        ? kanjiList[currentIndex].meanings[0] === meaning
                          ? '#27cc56'
                          : '#ff5e5e'
                        : '#fff',
                      boxShadow: selectedAnswer === meaning ? 'none' : '0 2px 0 rgba(0, 0, 0, 0.1)'
                    },
                    border: '1px solid rgba(0, 0, 0, 0.15)',
                    borderBottom: '2px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    padding: '14px',
                    paddingBottom: '16px',
                    textTransform: 'none',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transform: 'translateY(0)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      borderColor: 'rgba(0, 0, 0, 0.2)',
                      borderBottomColor: 'rgba(0, 0, 0, 0.25)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)'
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      borderBottomColor: 'rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  {meaning}
                </Button>
              ))}
            </Box>
            {showFeedback && (
              <Box sx={{ 
                width: '100%',
                mt: 6
              }}>
                <FeedbackBanner
                  isCorrect={kanjiList[currentIndex].meanings[0] === selectedAnswer}
                  xpGained={15}
                  onWhyClick={() => setShowAnswer(true)}
                  onContinue={handleNext}
                />
              </Box>
            )}
          </KanjiCard>
        </>
      ) : null}
    </StudyContainer>
  );
}
