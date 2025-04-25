'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Paper, 
  Radio, 
  RadioGroup,
  FormControlLabel,
  Button,
  TextField,
  Card,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import { 
  VolumeUp,
  CheckCircle,
} from '@mui/icons-material';
import LearnLayout from '@/components/learn/LearnLayout';
import React from 'react';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '680px',
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(2, 3),
}));

const ReadingCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: '#fff',
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

const BlankInput = styled(TextField)(({ theme }) => ({
  width: '120px',
  margin: '0 8px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7c4dff',
    },
  },
}));

const SentenceCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff',
  },
  '&.selected': {
    backgroundColor: '#e8e3ff',
    border: '1px solid #7c4dff',
  },
}));

const OrderChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#7c4dff',
  color: '#fff',
  fontWeight: 'bold',
}));

const OptionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  textTransform: 'none',
  minWidth: '80px',
  flex: '1 0 auto',
  maxWidth: '150px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  color: '#1a1a1a',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff',
  },
  '&.selected': {
    backgroundColor: '#e8e3ff',
    borderColor: '#7c4dff',
    color: '#5e35b1',
  },
  '&.correct': {
    backgroundColor: '#4caf50',
    borderColor: '#2e7d32',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  '&.incorrect': {
    backgroundColor: '#f44336',
    borderColor: '#c62828',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#e53935',
    },
  },
}));

const BlankSpan = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  margin: theme.spacing(0, 0.5),
  minWidth: '60px',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
  backgroundColor: '#fff',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease-in-out',
  '&.filled': {
    backgroundColor: '#e8e3ff',
    borderColor: '#7c4dff',
    color: '#5e35b1',
  },
}));

const QuestionText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  letterSpacing: '0.01em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string; }[];
  correctAnswer: string;
}

interface FillBlankQuestion {
  id: string;
  text: string;
  blanks: { id: string; answer: string; options: string[]; }[];
}

interface SentenceOrderQuestion {
  id: string;
  sentences: { id: string; text: string; }[];
  correctOrder: string[];
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    text: "山田さんは毎朝6時に起きて、公園でジョギングをします。その後、シャワーを浴びて会社に行きます。\n\n質問：山田さんは朝何をしますか？",
    options: [
      { id: 'a', text: '公園で寝ます' },
      { id: 'b', text: '公園でジョギングをします' },
      { id: 'c', text: '公園で本を読みます' },
      { id: 'd', text: '公園で朝ご飯を食べます' },
    ],
    correctAnswer: 'b',
  },
  {
    id: '2',
    text: "田中さんは休みの日に図書館で本を読みます。\n\n質問：田中さんはどこで本を読みますか？",
    options: [
      { id: 'a', text: '家で' },
      { id: 'b', text: '公園で' },
      { id: 'c', text: '図書館で' },
      { id: 'd', text: 'カフェで' },
    ],
    correctAnswer: 'c',
  }
];

const sampleFillBlanks: FillBlankQuestion[] = [
  {
    id: '1',
    text: "私は__1__に__2__へ行きます。",
    blanks: [
      {
        id: '1',
        answer: '電車',
        options: ['電車', 'バス', '自転車', 'タクシー'],
      },
      {
        id: '2',
        answer: '学校',
        options: ['学校', '会社', '公園', '病院'],
      },
    ],
  },
  {
    id: '2',
    text: "__1__で__2__を食べます。",
    blanks: [
      {
        id: '1',
        answer: '家',
        options: ['家', '公園', 'レストラン', '学校'],
      },
      {
        id: '2',
        answer: '朝ご飯',
        options: ['朝ご飯', '昼ご飯', '晩ご飯', 'おやつ'],
      },
    ],
  }
];

const sampleSentenceOrder: SentenceOrderQuestion[] = [
  {
    id: '1',
    sentences: [
      { id: 's1', text: '朝ご飯を食べました。' },
      { id: 's2', text: '歯を磨きました。' },
      { id: 's3', text: '6時に起きました。' },
      { id: 's4', text: 'シャワーを浴びました。' },
    ],
    correctOrder: ['s3', 's4', 's2', 's1'],
  },
  {
    id: '2',
    sentences: [
      { id: 's1', text: '宿題をしました。' },
      { id: 's2', text: '学校に行きました。' },
      { id: 's3', text: '朝ご飯を食べました。' },
      { id: 's4', text: '起きました。' },
    ],
    correctOrder: ['s4', 's3', 's2', 's1'],
  }
];

export default function ReadingPage() {
  const [progress, setProgress] = useState(45);
  const [studyMode, setStudyMode] = useState('reading-qa');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [selectedSentences, setSelectedSentences] = useState<string[]>([]);

  const handleModeSelect = (newMode: string) => {
    setStudyMode(newMode);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setIsAnswered(false);
    setBlankAnswers({});
    setSelectedSentences([]);
  };

  const handleAnswer = () => {
    setIsAnswered(true);
    setProgress((prev) => Math.min(prev + 5, 100));
  };

  const handleNext = () => {
    const maxIndex = studyMode === 'reading-qa' 
      ? sampleQuestions.length - 1
      : studyMode === 'fill-blank'
      ? sampleFillBlanks.length - 1
      : sampleSentenceOrder.length - 1;

    setCurrentQuestionIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Loop back to the first question
      }
      return prev + 1;
    });
    setSelectedAnswer('');
    setIsAnswered(false);
    setBlankAnswers({});
    setSelectedSentences([]);
  };

  const handleBlankChange = (blankId: string, value: string) => {
    setBlankAnswers((prev) => ({
      ...prev,
      [blankId]: value,
    }));
  };

  const handleSentenceClick = (sentenceId: string) => {
    if (isAnswered) return;
    
    setSelectedSentences((prev) => {
      if (prev.includes(sentenceId)) {
        return prev.filter(id => id !== sentenceId);
      } else {
        return [...prev, sentenceId];
      }
    });
  };

  const getCurrentQuestion = () => {
    let questions;
    switch (studyMode) {
      case 'reading-qa':
        questions = sampleQuestions;
        break;
      case 'fill-blank':
        questions = sampleFillBlanks;
        break;
      case 'sentence-order':
        questions = sampleSentenceOrder;
        break;
      default:
        questions = sampleQuestions;
    }
    
    // If we're at the end, loop back to the first question
    const index = currentQuestionIndex % questions.length;
    const question = questions[index];
    
    // Add defensive check
    if (!question) {
      console.error('No question found:', { studyMode, currentQuestionIndex, index, questionsLength: questions.length });
      // Return a default question as fallback
      return sampleQuestions[0];
    }
    
    return question;
  };

  const isCorrect = () => {
    const question = getCurrentQuestion();
    if (!question) return false;

    switch (studyMode) {
      case 'reading-qa':
        return selectedAnswer === (question as Question).correctAnswer;
      case 'fill-blank':
        return (question as FillBlankQuestion).blanks.every(
          blank => blankAnswers[blank.id] === blank.answer
        );
      case 'sentence-order':
        return selectedSentences.join(',') === 
               (question as SentenceOrderQuestion).correctOrder.join(',');
      default:
        return false;
    }
  };

  return (
    <LearnLayout
      progress={progress}
      mode={studyMode === 'reading-qa' ? 'Reading Q&A' : 
            studyMode === 'fill-blank' ? 'Fill in the Blank' : 
            'Sentence Order'}
      onModeSelect={handleModeSelect}
      showDifficulty={false}
    >
      <PageContainer>
        {studyMode === 'reading-qa' && (
          <Box>
            <ReadingCard>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                {(getCurrentQuestion() as Question).text}
              </Typography>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              >
                <Stack spacing={1}>
                  {(getCurrentQuestion() as Question).options?.map((option) => (
                    <AnswerOption
                      key={option?.id || 'default'}
                      value={option?.id || ''}
                      control={<Radio />}
                      label={option?.text || ''}
                      disabled={isAnswered}
                    />
                  ))}
                </Stack>
              </RadioGroup>
            </ReadingCard>
          </Box>
        )}

        {studyMode === 'fill-blank' && (
          <Box>
            <ReadingCard>
              <QuestionText paragraph>
                {(getCurrentQuestion() as FillBlankQuestion).text?.split('__').map((part, index, array) => {
                  if (index === array.length - 1) return part;
                  const question = getCurrentQuestion() as FillBlankQuestion;
                  const blank = question.blanks?.[index];
                  if (!blank) return part;
                  
                  return (
                    <React.Fragment key={blank.id || index}>
                      {part}
                      <BlankSpan className={blankAnswers[blank.id] ? 'filled' : ''}>
                        {blankAnswers[blank.id] || '＿'}
                      </BlankSpan>
                    </React.Fragment>
                  );
                })}
              </QuestionText>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                  タップして空欄を埋めてください:
                </Typography>
                {(getCurrentQuestion() as FillBlankQuestion).blanks?.map((blank, blankIndex) => (
                  <Box key={blank.id} sx={{ mb: 3 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mb: 1.5, 
                        display: 'block', 
                        color: 'text.secondary',
                        fontSize: '0.85rem',
                        fontWeight: 500 
                      }}
                    >
                      空欄 {blankIndex + 1}:
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      flexWrap="wrap" 
                      useFlexGap 
                      sx={{ 
                        gap: 1.5,
                        justifyContent: { xs: 'space-between', sm: 'flex-start' }
                      }}
                    >
                      {blank.options?.map((option) => (
                        <OptionButton
                          key={option}
                          variant="outlined"
                          onClick={() => handleBlankChange(blank.id, option)}
                          className={
                            isAnswered
                              ? option === blank.answer
                                ? 'correct'
                                : blankAnswers[blank.id] === option
                                ? 'incorrect'
                                : ''
                              : blankAnswers[blank.id] === option
                              ? 'selected'
                              : ''
                          }
                          disabled={isAnswered}
                        >
                          {option}
                        </OptionButton>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </ReadingCard>
          </Box>
        )}

        {studyMode === 'sentence-order' && (
          <Box>
            <ReadingCard>
              <Typography variant="subtitle1" gutterBottom>
                Tap the sentences in the correct order:
              </Typography>
              <Stack spacing={1}>
                {(getCurrentQuestion() as SentenceOrderQuestion).sentences?.map((sentence) => (
                  <SentenceCard
                    key={sentence?.id || 'default'}
                    onClick={() => sentence?.id && handleSentenceClick(sentence.id)}
                    className={sentence?.id && selectedSentences.includes(sentence.id) ? 'selected' : ''}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {sentence?.id && selectedSentences.includes(sentence.id) && (
                        <OrderChip
                          size="small"
                          label={selectedSentences.indexOf(sentence.id) + 1}
                          sx={{ mr: 2 }}
                        />
                      )}
                      <Typography>{sentence?.text || ''}</Typography>
                      {sentence?.id && selectedSentences.includes(sentence.id) && (
                        <CheckCircle sx={{ ml: 'auto', color: '#7c4dff' }} />
                      )}
                    </Box>
                  </SentenceCard>
                ))}
              </Stack>
            </ReadingCard>
          </Box>
        )}

        {isAnswered ? (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography
              variant="h6"
              color={isCorrect() ? 'success.main' : 'error.main'}
              gutterBottom
            >
              {isCorrect() ? '正解です！' : '不正解です。'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{ mt: 2 }}
            >
              Next Question
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnswer}
            disabled={
              studyMode === 'reading-qa' ? !selectedAnswer :
              studyMode === 'fill-blank' ? Object.keys(blankAnswers).length !== 
                (getCurrentQuestion() as FillBlankQuestion).blanks?.length :
              studyMode === 'sentence-order' ? selectedSentences.length !==
                (getCurrentQuestion() as SentenceOrderQuestion).sentences?.length :
              false
            }
            sx={{ mt: 3 }}
            fullWidth
          >
            Check Answer
          </Button>
        )}
      </PageContainer>
    </LearnLayout>
  );
}
