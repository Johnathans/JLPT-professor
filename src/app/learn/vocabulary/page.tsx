import { useState } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import Layout from '@/components/Layout';
import Flashcard from '@/components/Flashcard';
import { styled } from '@mui/material/styles';

const ProgressIndicator = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.primary.light,
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
}));

export default function VocabularyPage() {
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
      },
    },
    // Add more vocabulary items
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    // Handle SRS logic here
    if (direction === 'right') {
      // Mark as correct
    } else {
      // Mark for review
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const progress = (currentIndex / sampleVocabulary.length) * 100;

  return (
    <Layout maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        Vocabulary Practice
      </Typography>

      <StatsContainer>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <Typography variant="h6">
            {currentIndex}/{sampleVocabulary.length}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Mastered
          </Typography>
          <Typography variant="h6">
            {Math.floor(progress)}%
          </Typography>
        </Box>
      </StatsContainer>

      <Box mb={2}>
        <ProgressIndicator variant="determinate" value={progress} />
      </Box>

      {currentIndex < sampleVocabulary.length && (
        <Flashcard
          front={sampleVocabulary[currentIndex].front}
          back={sampleVocabulary[currentIndex].back}
          onSwipe={handleSwipe}
        />
      )}

      {currentIndex >= sampleVocabulary.length && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h2" gutterBottom>
            Great job! 🎉
          </Typography>
          <Typography variant="body1" color="textSecondary">
            You've completed this vocabulary set.
          </Typography>
        </Box>
      )}
    </Layout>
  );
}
