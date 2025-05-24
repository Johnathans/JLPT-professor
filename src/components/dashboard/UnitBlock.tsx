'use client';

import React from 'react';
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import { PlayArrow, Refresh } from '@mui/icons-material';

interface UnitBlockProps {
  title: string;
  imageUrl: string;
  wordCount: number;
  kanjiCount: number;
  color?: string;
  onStart?: () => void;
  onReview?: () => void;
}

const UnitBlock: React.FC<UnitBlockProps> = ({
  title,
  imageUrl,
  wordCount,
  kanjiCount,
  color = '#7c4dff',
  onStart,
  onReview
}) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        bgcolor: 'white',
        border: '1px solid',
        borderColor: '#E8F9FD',
        color: '#000000',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#59CE8F',
          boxShadow: '0 4px 20px rgba(89, 206, 143, 0.15)'
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
          {title}
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            {wordCount} Words
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666' }}>
            {kanjiCount} Kanji
          </Typography>
        </Stack>
      </Box>

      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: '60%',
            height: 'auto',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.9
          }}
        />
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={onStart}
          sx={{
            bgcolor: '#59CE8F',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#4AB57E',
              boxShadow: 'none'
            }
          }}
        >
          Start
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onReview}
          sx={{
            borderColor: '#E8F9FD',
            color: '#000000',
            '&:hover': {
              borderColor: '#59CE8F',
              bgcolor: 'transparent'
            }
          }}
        >
          Review
        </Button>
      </Stack>
    </Card>
  );
};

export default UnitBlock;
