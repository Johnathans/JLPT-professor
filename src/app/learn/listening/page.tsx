'use client';

import { useState } from 'react';
import { Card, Typography, Box, Button, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnswerOption = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  margin: 0,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  width: '100%',
}));

const sampleListening = {
  id: '1',
  title: 'Daily Conversation',
  audio: '/audio/conversation1.mp3',
  image: '/images/cafe.jpg',
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
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = () => {
    setIsAnswered(true);
  };

  const isCorrect = selectedAnswer === sampleListening.correctAnswer;

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Listening Practice
      </Typography>

      <Card sx={{ mb: 4, p: 3 }}>
        <Box
          component="img"
          src={sampleListening.image}
          alt="Listening context"
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 3,
          }}
        />

        <Typography variant="h6" gutterBottom>
          {sampleListening.question}
        </Typography>

        <RadioGroup
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
        >
          <Box sx={{ display: 'grid', gap: 2 }}>
            {sampleListening.options.map((option) => (
              <AnswerOption
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                disabled={isAnswered}
              />
            ))}
          </Box>
        </RadioGroup>

        {!isAnswered && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            sx={{ mt: 3 }}
          >
            Check Answer
          </Button>
        )}

        {isAnswered && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
              variant="h6"
              color={isCorrect ? 'success.main' : 'error.main'}
              gutterBottom
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isCorrect
                ? 'Great job! Let\'s try another one.'
                : `The correct answer was: ${
                    sampleListening.options.find(
                      (opt) => opt.id === sampleListening.correctAnswer
                    )?.text
                  }`}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSelectedAnswer('');
                setIsAnswered(false);
              }}
              sx={{ mt: 2 }}
            >
              Next Question
            </Button>
          </Box>
        )}
      </Card>
    </PageContainer>
  );
}
