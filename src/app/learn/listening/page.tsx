"use client";

import { useState } from 'react';
import { Box, Typography, Button, Stack, IconButton, Menu, MenuItem, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { VolumeUp, PlayArrow, Pause } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import LearnLayout from '@/components/learn/LearnLayout';

const ListeningCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '680px',
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

const DictationInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  fontSize: '1rem',
  fontFamily: '"Noto Sans JP", sans-serif',
  '&:focus': {
    outline: 'none',
    borderColor: '#7c4dff',
    boxShadow: '0 0 0 2px rgba(124, 77, 255, 0.1)',
  },
}));

const WordButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  fontSize: '1rem',
  fontFamily: '"Noto Sans JP", sans-serif',
  textTransform: 'none',
  border: '1px solid #e2e8f0',
  color: theme.palette.text.primary,
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff',
  },
  '&.selected': {
    backgroundColor: '#e8e3ff',
    borderColor: '#7c4dff',
    color: '#7c4dff',
  }
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
  dictation: {
    text: 'コーヒーを一つお願いします',
    words: ['コーヒー', 'を', '一つ', 'お願いします'],
  }
};

export default function ListeningPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(45);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [studyMode, setStudyMode] = useState('qa'); // 'qa', 'dictation-type', 'dictation-tap'
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState([...sampleListening.dictation.words].sort(() => Math.random() - 0.5));

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
    setTypedAnswer('');
    setSelectedWords([]);
    setAvailableWords([...sampleListening.dictation.words].sort(() => Math.random() - 0.5));
    setIsAnswered(false);
    setIsPlaying(false);
  };

  const handleModeSelect = (newMode: string) => {
    setStudyMode(newMode);
    handleNext();
  };

  const handleWordSelect = (word: string) => {
    if (!isAnswered) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word));
    }
  };

  const handleUndoWord = (index: number) => {
    if (!isAnswered) {
      const word = selectedWords[index];
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
      setAvailableWords([...availableWords, word]);
    }
  };

  const isCorrect = studyMode === 'qa' 
    ? selectedAnswer === sampleListening.correctAnswer
    : studyMode === 'dictation-type'
    ? typedAnswer === sampleListening.dictation.text
    : selectedWords.join('') === sampleListening.dictation.words.join('');

  return (
    <LearnLayout
      progress={progress}
      mode={studyMode === 'qa' ? 'Question & Answer' : studyMode === 'dictation-type' ? 'Dictation (Type)' : 'Dictation (Tap)'}
      onModeSelect={handleModeSelect}
      showDifficulty={false}
    >
      <ListeningCard elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <PlayButton onClick={handlePlayAudio}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </PlayButton>

          {studyMode === 'qa' && (
            <>
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
            </>
          )}

          {studyMode === 'dictation-type' && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <DictationInput
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Type what you hear..."
                disabled={isAnswered}
              />
            </Box>
          )}

          {studyMode === 'dictation-tap' && (
            <Box sx={{ width: '100%', mt: 3 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Your Answer:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ minHeight: '48px', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  {selectedWords.map((word, index) => (
                    <WordButton
                      key={index}
                      onClick={() => handleUndoWord(index)}
                      className="selected"
                      disabled={isAnswered}
                    >
                      {word}
                    </WordButton>
                  ))}
                </Stack>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Available Words:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {availableWords.map((word, index) => (
                  <WordButton
                    key={index}
                    onClick={() => handleWordSelect(word)}
                    disabled={isAnswered}
                  >
                    {word}
                  </WordButton>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </ListeningCard>

      {isAnswered ? (
        <Box sx={{ mt: 3, width: '100%', maxWidth: '680px' }}>
          <Typography
            variant="h6"
            align="center"
            color={isCorrect ? 'success.main' : 'error.main'}
            sx={{ mb: 2 }}
          >
            {isCorrect ? 'Correct!' : 'Incorrect'}
            {!isCorrect && studyMode !== 'qa' && (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Correct answer: {sampleListening.dictation.text}
              </Typography>
            )}
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
          disabled={studyMode === 'qa' ? !selectedAnswer : studyMode === 'dictation-type' ? !typedAnswer : selectedWords.length === 0}
          sx={{ mt: 3, width: '100%', maxWidth: '680px' }}
        >
          Check Answer
        </Button>
      )}
    </LearnLayout>
  );
}
