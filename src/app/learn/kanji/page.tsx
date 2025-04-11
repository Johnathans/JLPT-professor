import { useState } from 'react';
import { Typography, Box, LinearProgress, Card } from '@mui/material';
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

const ContextCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

export default function KanjiPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample kanji data (will be fetched from Supabase)
  const sampleKanji = [
    {
      front: {
        text: '食',
        subtext: 'しょく、た(べる)',
        audio: '/audio/shoku.mp3',
      },
      back: {
        text: 'to eat, food',
        subtext: 'Readings: しょく (on), た(べる) (kun)',
        examples: [
          {
            japanese: '食事',
            english: 'meal (しょくじ)',
          },
          {
            japanese: '食べ物',
            english: 'food (たべもの)',
          },
        ],
      },
      context: {
        compounds: ['食事', '食堂', '食品'],
        sentences: [
          {
            japanese: '毎日三食食べます。',
            english: 'I eat three meals every day.',
          },
        ],
      },
    },
    // Add more kanji items
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

  const progress = (currentIndex / sampleKanji.length) * 100;

  return (
    <Layout maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        Kanji Practice
      </Typography>

      <StatsContainer>
        <Box>
          <Typography variant="body2" color="textSecondary">
            Progress
          </Typography>
          <Typography variant="h6">
            {currentIndex}/{sampleKanji.length}
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

      {currentIndex < sampleKanji.length && (
        <>
          <Flashcard
            front={sampleKanji[currentIndex].front}
            back={sampleKanji[currentIndex].back}
            onSwipe={handleSwipe}
          />

          <ContextCard>
            <Typography variant="h6" gutterBottom>
              Common Compounds
            </Typography>
            {sampleKanji[currentIndex].context.compounds.map((compound, index) => (
              <Typography key={index} variant="body2" gutterBottom>
                {compound}
              </Typography>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Example Sentences
            </Typography>
            {sampleKanji[currentIndex].context.sentences.map((sentence, index) => (
              <Box key={index} mb={1}>
                <Typography variant="body2">
                  {sentence.japanese}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sentence.english}
                </Typography>
              </Box>
            ))}
          </ContextCard>
        </>
      )}

      {currentIndex >= sampleKanji.length && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h2" gutterBottom>
            Great job! 🎉
          </Typography>
          <Typography variant="body1" color="textSecondary">
            You've completed this kanji set.
          </Typography>
        </Box>
      )}
    </Layout>
  );
}
