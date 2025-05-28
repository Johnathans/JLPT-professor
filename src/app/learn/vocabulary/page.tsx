"use client";

import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { N5Vocabulary } from '@/data/jlpt';
import type { VocabularyData } from '@/data/jlpt';

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

const VocabCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '680px',
  height: '100%',
  position: 'relative',
  padding: theme.spacing(4),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const VocabText = styled(Typography)(({ theme }) => ({
  fontSize: 'min(8rem, 15vw)',
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 400,
  color: '#1a1a1a',
  lineHeight: 1.2,
  marginTop: '18vh',
  marginBottom: theme.spacing(4),
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  maxWidth: '90vw',
  textAlign: 'center',
  wordBreak: 'keep-all',
  [theme.breakpoints.down('sm')]: {
    fontSize: 'min(4rem, 15vw)',
    marginTop: '15vh'
  }
}));

export default function VocabularyPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Select meaning below');
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [vocabList, setVocabList] = useState<VocabularyData[]>([]);
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio('/audio/ui/ui_correct_button2-103167 (1).mp3');
    incorrectSound.current = new Audio('/audio/ui/button_10-190436.mp3');
  }, []);

  useEffect(() => {
    setVocabList(N5Vocabulary);
  }, []);

  useEffect(() => {
    if (vocabList.length > 0) {
      setCurrentIndex(0);
      setCurrentAnswers(getRandomAnswers(vocabList[0], vocabList));
      setShowAnswer(false);
    }
  }, [vocabList]);

  const getRandomAnswers = (correctVocab: VocabularyData, allVocab: VocabularyData[], numOptions: number = 4): string[] => {
    // Get the correct meaning
    const correctMeaning = correctVocab.meanings[0];
    
    // Get random incorrect meanings
    const otherMeanings = allVocab
      .filter(v => v !== correctVocab) // Exclude current vocab
      .map(v => v.meanings[0]) // Get first meaning of each
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
    const isCorrect = vocabList[currentIndex].meanings[0] === selectedMeaning;
    setFeedbackMessage(isCorrect ? 'Correct!' : 'Incorrect');
    if (isCorrect) {
      if (correctSound.current) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      }
    } else {
      if (incorrectSound.current) {
        incorrectSound.current.currentTime = 0;
        incorrectSound.current.play();
      }
    }
    setTimeout(handleNext, 1500);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < vocabList.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setFeedbackMessage('Select meaning below');
      setCurrentAnswers(getRandomAnswers(vocabList[nextIndex], vocabList));
    }
  };

  return (
    <StudyContainer>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
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
              width: `${((currentIndex + 1) / vocabList.length) * 100}%`,
              backgroundColor: '#7c4dff',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>
      </Box>
      {vocabList.length > 0 ? (
        <>
          <VocabCard>
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
              <VocabText>
                {vocabList[currentIndex].kana}
              </VocabText>
              {selectedAnswer && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Noto Sans JP", sans-serif',
                      color: '#1a1a1a',
                    }}
                  >
                    {vocabList[currentIndex].meanings[0]}
                  </Typography>
                  {vocabList[currentIndex].kanji && (
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        color: '#1a1a1a',
                      }}
                    >
                      {vocabList[currentIndex].kanji}
                    </Typography>
                  )}
                </Box>
              )}
              <Typography 
                variant="h6"
                sx={{ 
                  color: selectedAnswer 
                    ? vocabList[currentIndex].meanings[0] === selectedAnswer
                      ? '#00c853'
                      : '#d50000'
                    : '#000000', 
                  mb: 3,
                  fontWeight: selectedAnswer ? 600 : 400,
                  fontSize: '1.25rem'
                }}
              >
                {feedbackMessage}
              </Typography>
              <Box sx={{ 
                position: 'fixed',
                bottom: '5vh',
                left: '50%',
                transform: 'translateX(-50%)',
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
                        ? vocabList[currentIndex].meanings[0] === meaning
                          ? '#27cc56'
                          : '#d50000'
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
            </Box>
          </VocabCard>
        </>
      ) : null}
    </StudyContainer>
  );
}
