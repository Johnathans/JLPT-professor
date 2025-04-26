import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import DrawingCanvas from '@/components/common/DrawingCanvas';
import KanjiStrokeAnimation from '@/components/common/KanjiStrokeAnimation';
import { useKanji } from '@/hooks/useKanji';
import type { Stroke, Point } from '@/types/kanji';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  maxWidth: 600,
  margin: '0 auto',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

interface WritingPracticeProps {
  onComplete: (score: number) => void;
}

export default function WritingPractice({ onComplete }: WritingPracticeProps) {
  const { kanji, isLoading, error } = useKanji();
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (kanji.length > 0) {
      setCurrentKanjiIndex(0);
      setCurrentStrokeIndex(0);
      setScore(0);
    }
  }, [kanji]);

  if (isLoading) {
    return (
      <StyledBox>
        <Typography>Loading kanji practice...</Typography>
      </StyledBox>
    );
  }

  if (error || kanji.length === 0) {
    return (
      <StyledBox>
        <Typography color="error">
          {error || 'No kanji data available'}
        </Typography>
      </StyledBox>
    );
  }

  const currentKanji = kanji[currentKanjiIndex];

  const handleStrokeComplete = (strokes: Point[][]) => {
    if (strokes.length === currentKanji.strokes.length) {
      // Move to next kanji
      if (currentKanjiIndex + 1 < kanji.length) {
        setCurrentKanjiIndex(currentKanjiIndex + 1);
        setCurrentStrokeIndex(0);
        setScore(score + 1);
      } else {
        // Practice complete
        onComplete(score + 1);
      }
    } else {
      // Update current stroke index
      setCurrentStrokeIndex(strokes.length);
    }
  };

  const handleShowAnimation = () => {
    setShowAnimation(true);
  };

  const handleAnimationEnd = () => {
    setShowAnimation(false);
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Write the Kanji: {currentKanji.character}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Stroke {currentStrokeIndex + 1} of {currentKanji.strokes.length}
      </Typography>
      
      {showAnimation ? (
        <KanjiStrokeAnimation
          strokes={currentKanji.strokes}
          onComplete={handleAnimationEnd}
          width={400}
          height={400}
        />
      ) : (
        <DrawingCanvas
          width={400}
          height={400}
          strokes={currentKanji.strokes}
          onStrokeComplete={handleStrokeComplete}
        />
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <StyledButton
          variant="contained"
          onClick={handleShowAnimation}
          disabled={showAnimation}
        >
          Show Animation
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={() => onComplete(score)}
          color="secondary"
        >
          Skip Exercise
        </StyledButton>
      </Box>
    </StyledBox>
  );
}
