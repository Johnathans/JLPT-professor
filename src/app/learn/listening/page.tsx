import { useState } from 'react';
import { Card, Typography, Box, Button, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/AudioPlayer';
import Image from 'next/image';
import { styled } from '@mui/material/styles';

const ListeningCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '200px',
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const AnswerOption = styled(FormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function ListeningPage() {
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  // Sample listening content (will be fetched from Supabase in production)
  const sampleListening = {
    audioUrl: '/sample-audio.mp3',
    imageUrl: '/sample-image.jpg',
    transcript: '公園で子供たちが遊んでいます。',
    translation: 'Children are playing in the park.',
    options: [
      { id: 'a', text: '公園で子供たちが遊んでいます。' },
      { id: 'b', text: '公園で大人たちが話しています。' },
      { id: 'c', text: '公園で犬が走っています。' },
      { id: 'd', text: '公園は空いています。' },
    ],
    correctAnswer: 'a',
  };

  return (
    <Layout maxWidth="md">
      <Typography variant="h1" gutterBottom>
        Listening Practice
      </Typography>
      
      <ListeningCard>
        <ImageContainer>
          <Image
            src={sampleListening.imageUrl}
            alt="Listening exercise"
            fill
            style={{ objectFit: 'cover' }}
          />
        </ImageContainer>
        
        <Box mb={3}>
          <AudioPlayer src={sampleListening.audioUrl} />
        </Box>
        
        <RadioGroup
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
        >
          <Grid container spacing={2}>
            {sampleListening.options.map((option) => (
              <Grid item xs={12} key={option.id}>
                <AnswerOption
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
        
        <Box mt={3}>
          <Button
            variant="outlined"
            onClick={() => setShowTranscript(!showTranscript)}
            fullWidth
          >
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </Button>
          
          {showTranscript && (
            <Box mt={2}>
              <Typography variant="body1">
                {sampleListening.transcript}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {sampleListening.translation}
              </Typography>
            </Box>
          )}
        </Box>
      </ListeningCard>
    </Layout>
  );
}
