'use client';

import React from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Flag } from '@mui/icons-material';

interface FeedbackBannerProps {
  isCorrect: boolean;
  xpGained: number;
  onWhyClick: () => void;
  onContinue: () => void;
}

const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  xpGained,
  onWhyClick,
  onContinue,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: isCorrect ? 'rgba(39, 204, 86, 0.1)' : 'rgba(255, 94, 94, 0.1)',
        py: 3,
        px: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        mt: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '1.125rem',
            color: isCorrect ? '#27cc56' : '#ff5e5e',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {isCorrect ? 'Correct!' : 'Incorrect'}{' '}
          {isCorrect && (
            <Typography
              component="span"
              sx={{
                color: '#27cc56',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              +{xpGained} XP
            </Typography>
          )}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onWhyClick}
          sx={{
            textTransform: 'none',
            borderColor: isCorrect ? 'rgba(39, 204, 86, 0.5)' : 'rgba(255, 94, 94, 0.5)',
            color: isCorrect ? '#27cc56' : '#ff5e5e',
            '&:hover': {
              borderColor: isCorrect ? '#27cc56' : '#ff5e5e',
              bgcolor: isCorrect ? 'rgba(39, 204, 86, 0.04)' : 'rgba(255, 94, 94, 0.04)',
            },
          }}
        >
          Why?
        </Button>
        <Button
          variant="contained"
          onClick={onContinue}
          size="large"
          sx={{
            textTransform: 'none',
            bgcolor: isCorrect ? '#27cc56' : '#ff5e5e',
            px: 4,
            py: 1,
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: isCorrect ? '#1eb84b' : '#ff4545',
            },
          }}
        >
          Continue
        </Button>
        <IconButton
          size="small"
          sx={{
            color: '#666',
            '&:hover': {
              color: '#000',
            },
          }}
        >
          <Flag fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FeedbackBanner;
