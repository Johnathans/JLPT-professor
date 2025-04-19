"use client";

import { useState } from 'react';
import { Box, Typography, Button, Stack, IconButton, Menu, MenuItem, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { VolumeUp, PlayArrow, Pause } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import LearnLayout from '@/components/learn/LearnLayout';

const ListeningCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  padding: '32px',
  backgroundColor: '#fff',
  borderRadius: '24px',
  [theme.breakpoints.down('sm')]: {
    minHeight: '400px',
    padding: '24px',
    borderRadius: '16px',
  }
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#7c4dff',
  color: '#fff',
  width: '64px',
  height: '64px',
  marginBottom: theme.spacing(3),
  '&:hover': {
    backgroundColor: '#5e35b1',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '32px'
  }
}));

const AnswerOption = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  margin: '8px 0',
  padding: theme.spacing(2),
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff',
  },
}));

const sampleListening = {
  audio: '/audio/conversation1.mp3',
  question: 'What did the woman order?',
  options: [
    { id: 'a', text: 'Coffee' },
    { id: 'b', text: 'Tea' },
    { id: 'c', text: 'Orange juice' },
    { id: 'd', text: 'Water' },
  ],
  correctAnswer: 'b',
};

export default function ListeningPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(45);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studyMode, setStudyMode] = useState('flashcard');

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // Add audio play/pause logic here
  };

  const handleAnswer = () => {
    setIsAnswered(true);
    setProgress((prev) => Math.min(prev + 5, 100));
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setIsAnswered(false);
    setIsPlaying(false);
  };

  const handleModeSelect = (newMode: string) => {
    setStudyMode(newMode);
  };

  const isCorrect = selectedAnswer === sampleListening.correctAnswer;

  return (
    <LearnLayout
      progress={progress}
      mode={studyMode}
      onModeSelect={handleModeSelect}
      showDifficulty={false}
    >
      <ListeningCard elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <PlayButton onClick={handlePlayAudio}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </PlayButton>

          <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
            {sampleListening.question}
          </Typography>

          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            sx={{ width: '100%' }}
          >
            <Stack spacing={2}>
              {sampleListening.options.map((option) => (
                <AnswerOption
                  key={option.id}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  disabled={isAnswered}
                />
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </ListeningCard>

      {isAnswered ? (
        <Box sx={{ mt: 3, width: '100%', maxWidth: '600px' }}>
          <Typography
            variant="h6"
            align="center"
            color={isCorrect ? 'success.main' : 'error.main'}
            sx={{ mb: 2 }}
          >
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </Typography>
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNext}
          >
            Next Question
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnswer}
          disabled={!selectedAnswer}
          sx={{ mt: 3, width: '100%', maxWidth: '600px' }}
        >
          Check Answer
        </Button>
      )}
    </LearnLayout>
  );
}
