'use client';

import React from 'react';
import { Box } from '@mui/material';

interface ProgressBarProps {
  total: number;
  current: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  current,
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <Box
      sx={{
        flex: 1,
        height: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#27cc56',
          transition: 'width 0.3s ease'
        }}
      />
    </Box>
  );
};

export default ProgressBar;
