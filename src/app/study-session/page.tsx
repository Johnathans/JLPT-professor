'use client';

import { useEffect } from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';
import { useStudySession, Exercise } from '@/contexts/StudySessionContext';
import KanjiWarmup from '@/components/exercises/KanjiWarmup';
import VocabularyExercise from '@/components/exercises/VocabularyExercise';
import WritingPractice from '@/components/exercises/WritingPractice';

// Styled Components
const SessionContainer = styled(Box)(({ theme }) => ({
  maxWidth: 'calc(1400px - 280px)',
  margin: '0 auto',
  padding: theme.spacing(3),
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(124, 77, 255, 0.12)',
  '.MuiLinearProgress-bar': {
    backgroundColor: '#7c4dff',
    borderRadius: 4,
  },
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#7c4dff',
  border: '1px solid rgba(124, 77, 255, 0.5)',
  padding: '10px 24px',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)',
    border: '1px solid #7c4dff',
  },
}));

const ExerciseContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
}));

const exercises: Exercise[] = [
  {
    id: 1,
    type: 'kanji',
    title: 'Kanji Warmup',
    icon: '漢',
    duration: 5,
    items: 10,
  },
  {
    id: 2,
    type: 'vocabulary',
    title: 'New Vocabulary',
    icon: '語',
    duration: 10,
    items: 5,
  },
  {
    id: 3,
    type: 'writing',
    title: 'Writing Practice',
    icon: '書',
    duration: 5,
    items: 3,
  },
  {
    id: 4,
    type: 'review',
    title: 'Review Sprint',
    icon: '復',
    duration: 5,
    items: 15,
  },
];

export default function StudySession() {
  const router = useRouter();
  const { 
    state: { session },
    startSession,
    completeExercise,
    nextExercise: nextEx,
    previousExercise: prevEx,
    completeSession,
    resetSession
  } = useStudySession();

  useEffect(() => {
    // Start a new session if there isn't one
    if (!session) {
      startSession(exercises);
    }
  }, [session, startSession]);

  // Redirect to dashboard if no session
  if (!session) {
    return null;
  }

  const currentExercise = session.exercises[session.currentExercise];
  const isLastExercise = session.currentExercise === session.exercises.length - 1;

  const handleNext = () => {
    if (!currentExercise.completed) {
      // In a real app, we'd get this score from the exercise component
      completeExercise(currentExercise.id, 100);
    }

    if (isLastExercise) {
      completeSession();
      router.push('/dashboard');
    } else {
      nextEx();
    }
  };

  const handlePrevious = () => {
    prevEx();
  };

  const renderExerciseContent = () => {
    switch (currentExercise.type) {
      case 'kanji':
        return (
          <KanjiWarmup
            onComplete={(score) => {
              completeExercise(currentExercise.id, score);
              nextEx();
            }}
          />
        );
      case 'vocabulary':
        return (
          <VocabularyExercise
            onComplete={(score) => {
              completeExercise(currentExercise.id, score);
              nextEx();
            }}
          />
        );
      case 'writing':
        return (
          <WritingPractice
            onComplete={(score) => {
              completeExercise(currentExercise.id, score);
              nextEx();
            }}
          />
        );
      case 'review':
        // TODO: Add review component
        return (
          <Box sx={{ 
            height: 300,
            backgroundColor: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ color: '#6F767E' }}>
              Review Exercise (Coming Soon)
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <SessionContainer>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {currentExercise.title}
          </Typography>
          <Typography sx={{ color: '#6F767E', fontSize: '0.875rem' }}>
            Exercise {session.currentExercise + 1} of {session.exercises.length}
          </Typography>
        </Box>
        <ProgressBar variant="determinate" value={session.progress} />
      </Box>

      <ExerciseContainer>
        <Box sx={{ 
          width: 80,
          height: 80,
          borderRadius: 16,
          backgroundColor: 'rgba(124, 77, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontFamily: '"Noto Sans JP", sans-serif',
          color: '#7c4dff',
          mb: 3
        }}>
          {currentExercise.icon}
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {currentExercise.title}
        </Typography>
        <Typography sx={{ color: '#6F767E', mb: 4 }}>
          {currentExercise.items} items • {currentExercise.duration} mins
        </Typography>

        {/* Exercise specific content */}
        <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
          {renderExerciseContent()}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {session.currentExercise > 0 && (
            <NavigationButton
              startIcon={<ArrowBack />}
              onClick={handlePrevious}
            >
              Previous
            </NavigationButton>
          )}
          {!currentExercise.completed && (
            <NavigationButton
              endIcon={isLastExercise ? <CheckCircle /> : <ArrowForward />}
              onClick={handleNext}
              sx={isLastExercise ? {
                backgroundColor: '#7c4dff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#6b42e0',
                },
              } : {}}
            >
              {isLastExercise ? 'Complete Session' : 'Skip Exercise'}
            </NavigationButton>
          )}
        </Box>
      </ExerciseContainer>
    </SessionContainer>
  );
}
