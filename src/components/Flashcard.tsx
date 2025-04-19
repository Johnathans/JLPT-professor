'use client';

import { useState } from 'react';
import { Card, Typography, Box, IconButton } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const FlashcardContainer = styled(motion.div)(({ theme }) => ({
  perspective: '1000px',
  width: '100%',
  aspectRatio: '3/2',
  cursor: 'pointer',
  marginBottom: theme.spacing(2),
}));

const FlashcardInner = styled(motion(Card))(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
}));

const AudioButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  color: theme.palette.primary.main,
}));

interface FlashcardProps {
  front: {
    text: string;
    subtext?: string;
    audio?: string;
  };
  back: {
    text: string;
    subtext?: string;
    examples?: Array<{
      japanese: string;
      english: string;
    }>;
  };
  onSwipe?: (direction: 'left' | 'right') => void;
}

export default function Flashcard({ front, back, onSwipe }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (direction: number) => {
    if (direction > 0) {
      onSwipe?.('right');
    } else if (direction < 0) {
      onSwipe?.('left');
    }
  };

  return (
    <FlashcardContainer
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset }) => handleSwipe(offset.x)}
    >
      <AnimatePresence mode="wait">
        <FlashcardInner
          onClick={handleFlip}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          {!isFlipped ? (
            <Box>
              {front.audio && (
                <AudioButton size="small">
                  <VolumeUp />
                </AudioButton>
              )}
              <Typography variant="h2" gutterBottom>
                {front.text}
              </Typography>
              {front.subtext && (
                <Typography variant="body2" color="textSecondary">
                  {front.subtext}
                </Typography>
              )}
            </Box>
          ) : (
            <Box style={{ transform: 'rotateY(180deg)' }}>
              <Typography variant="h3" gutterBottom>
                {back.text}
              </Typography>
              {back.subtext && (
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {back.subtext}
                </Typography>
              )}
              {back.examples && (
                <Box mt={2}>
                  {back.examples.map((example, index) => (
                    <Box key={index} mb={1}>
                      <Typography variant="body2">
                        {example.japanese}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {example.english}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </FlashcardInner>
      </AnimatePresence>
    </FlashcardContainer>
  );
}
