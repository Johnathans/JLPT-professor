import React from 'react';
import { Box, Typography, Button, styled, CircularProgress, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import Link from 'next/link';
import { JlptLevel, StudyMode } from '@/types/study';

// Define the props for the StudySummary component
interface StudySummaryProps {
  isDarkMode: boolean;
  jlptLevel: JlptLevel;
  studyMode: StudyMode;
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number; // in seconds
  studiedItems: Array<{
    id: string;
    question: string;
    answer: string;
    userAnswer?: string;
    isCorrect: boolean;
  }>;
  onRestart: () => void;
}

// Styled components
const SummaryContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>(({ darkMode }) => ({
  maxWidth: '900px',
  margin: '0 auto',
  padding: '24px',
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRadius: '12px',
  boxShadow: darkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
  border: darkMode ? '1px solid #333' : 'none',
}));

const ScoreCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>(({ darkMode }) => ({
  position: 'relative',
  width: '160px',
  height: '160px',
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StatCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkMode',
})<{ darkMode: boolean }>(({ darkMode }) => ({
  backgroundColor: darkMode ? '#2d2d2d' : '#f3f0ff',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minWidth: '100px',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '16px',
  minWidth: '180px',
  height: '48px',
  '@media (max-width: 600px)': {
    minWidth: '140px',
    fontSize: '14px',
  }
}));

const ItemRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'darkMode' && prop !== 'isCorrect',
})<{ darkMode: boolean; isCorrect?: boolean }>(({ darkMode, isCorrect }) => ({
  padding: '12px 16px',
  borderRadius: '8px',
  marginBottom: '8px',
  backgroundColor: isCorrect 
    ? (darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)')
    : (darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)'),
  border: `1px solid ${isCorrect 
    ? (darkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)') 
    : (darkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.2)')}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

// Helper function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Main component
const StudySummary: React.FC<StudySummaryProps> = ({
  isDarkMode,
  jlptLevel,
  studyMode,
  totalAnswered,
  correctAnswers,
  accuracy,
  timeSpent,
  studiedItems,
  onRestart
}) => {
  // Calculate points (2 points per correct answer)
  const points = correctAnswers * 2;
  
  // Group items by mastery level
  const mastered = studiedItems.filter(item => item.isCorrect);
  const needsReview = studiedItems.filter(item => !item.isCorrect);
  
  // Get study mode display name
  const getStudyModeDisplay = (mode: StudyMode): string => {
    const modeMap: Record<StudyMode, string> = {
      'vocabulary': 'Vocabulary Quiz',
      'sentences': 'Sentence Quiz',
      'kanji-meaning': 'Kanji Meaning Quiz',
      'kanji-onyomi': 'Kanji Onyomi Quiz',
      'kanji-kunyomi': 'Kanji Kunyomi Quiz',
      'kanji-match': 'Kanji Matching',
      'flashcard-vocabulary': 'Vocabulary Flashcards',
      'flashcard-sentences': 'Sentence Flashcards',
      'flashcard-kanji': 'Kanji Flashcards'
    };
    return modeMap[mode] || mode;
  };

  return (
    <SummaryContainer darkMode={isDarkMode}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: isDarkMode ? '#fff' : '#1f2937',
            fontWeight: 700,
            mb: 1
          }}
        >
          Study Session Complete
        </Typography>
        <Box 
          sx={{ 
            display: 'inline-block',
            backgroundColor: '#7c4dff',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '4px 12px',
            borderRadius: '4px',
            mb: 2
          }}
        >
          {jlptLevel.toUpperCase()}
        </Box>
        <Typography 
          sx={{ 
            color: isDarkMode ? '#aaa' : '#6b7280',
            fontSize: '18px'
          }}
        >
          {getStudyModeDisplay(studyMode)}
        </Typography>
      </Box>

      {/* Score Circle */}
      <ScoreCircle darkMode={isDarkMode}>
        <CircularProgress
          variant="determinate"
          value={accuracy}
          size={160}
          thickness={6}
          sx={{
            color: '#7c4dff',
            position: 'absolute',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Box sx={{ 
          position: 'absolute', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: isDarkMode ? '#fff' : '#1f2937',
              lineHeight: 1
            }}
          >
            {points}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '16px', 
              color: isDarkMode ? '#aaa' : '#6b7280'
            }}
          >
            pts
          </Typography>
        </Box>
      </ScoreCircle>

      {/* Stats */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        flexWrap: 'wrap',
        '@media (max-width: 600px)': {
          gap: 1,
        }
      }}>
        <StatCard darkMode={isDarkMode}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#7c4dff',
              mb: 1
            }}
          >
            {correctAnswers}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '14px', 
              color: isDarkMode ? '#aaa' : '#6b7280',
              textAlign: 'center'
            }}
          >
            Correct
          </Typography>
        </StatCard>

        <StatCard darkMode={isDarkMode}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: isDarkMode ? '#f44336' : '#e53935',
              mb: 1
            }}
          >
            {totalAnswered - correctAnswers}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '14px', 
              color: isDarkMode ? '#aaa' : '#6b7280',
              textAlign: 'center'
            }}
          >
            Incorrect
          </Typography>
        </StatCard>

        <StatCard darkMode={isDarkMode}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#7c4dff',
              mb: 1
            }}
          >
            {accuracy}%
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '14px', 
              color: isDarkMode ? '#aaa' : '#6b7280',
              textAlign: 'center'
            }}
          >
            Accuracy
          </Typography>
        </StatCard>

        <StatCard darkMode={isDarkMode}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#7c4dff',
              mb: 1
            }}
          >
            {formatTime(timeSpent)}
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '14px', 
              color: isDarkMode ? '#aaa' : '#6b7280',
              textAlign: 'center'
            }}
          >
            Time
          </Typography>
        </StatCard>
      </Box>

      {/* Items Review */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: isDarkMode ? '#fff' : '#1f2937',
            mb: 2
          }}
        >
          Mastered ({mastered.length})
        </Typography>
        
        <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 3 }}>
          {mastered.length > 0 ? (
            mastered.map((item) => (
              <ItemRow key={item.id} darkMode={isDarkMode} isCorrect={true}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                  <Box>
                    <Typography sx={{ 
                      fontWeight: 600, 
                      color: isDarkMode ? '#fff' : '#1f2937',
                      fontSize: '16px'
                    }}>
                      {item.question}
                    </Typography>
                    <Typography sx={{ 
                      color: isDarkMode ? '#aaa' : '#6b7280',
                      fontSize: '14px'
                    }}>
                      {item.answer}
                    </Typography>
                  </Box>
                </Box>
              </ItemRow>
            ))
          ) : (
            <Typography sx={{ 
              color: isDarkMode ? '#aaa' : '#6b7280',
              fontStyle: 'italic'
            }}>
              No items mastered in this session.
            </Typography>
          )}
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: isDarkMode ? '#fff' : '#1f2937',
            mb: 2
          }}
        >
          Needs Review ({needsReview.length})
        </Typography>
        
        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
          {needsReview.length > 0 ? (
            needsReview.map((item) => (
              <ItemRow key={item.id} darkMode={isDarkMode} isCorrect={false}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CancelIcon sx={{ color: '#f44336', mr: 2 }} />
                  <Box>
                    <Typography sx={{ 
                      fontWeight: 600, 
                      color: isDarkMode ? '#fff' : '#1f2937',
                      fontSize: '16px'
                    }}>
                      {item.question}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ 
                        color: isDarkMode ? '#aaa' : '#6b7280',
                        fontSize: '14px'
                      }}>
                        Correct: {item.answer}
                      </Typography>
                      {item.userAnswer && (
                        <Typography sx={{ 
                          color: '#f44336',
                          fontSize: '14px',
                          ml: 2
                        }}>
                          Your answer: {item.userAnswer}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </ItemRow>
            ))
          ) : (
            <Typography sx={{ 
              color: isDarkMode ? '#aaa' : '#6b7280',
              fontStyle: 'italic'
            }}>
              No items need review in this session.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Actions */}
      <Divider sx={{ mb: 3, borderColor: isDarkMode ? '#333' : '#e5e7eb' }} />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Link href="/dashboard" passHref>
          <ActionButton 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: '#7c4dff',
              borderColor: '#7c4dff',
              '&:hover': {
                borderColor: '#6b42e0',
                backgroundColor: 'rgba(124, 77, 255, 0.04)'
              }
            }}
          >
            Dashboard
          </ActionButton>
        </Link>
        
        <ActionButton 
          variant="contained"
          startIcon={<ReplayIcon />}
          onClick={onRestart}
          sx={{ 
            backgroundColor: '#7c4dff',
            '&:hover': {
              backgroundColor: '#6b42e0'
            }
          }}
        >
          Study Again
        </ActionButton>
      </Box>
    </SummaryContainer>
  );
};

export default StudySummary;
