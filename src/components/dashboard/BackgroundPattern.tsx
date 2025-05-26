'use client';

import React from 'react';
import { Box } from '@mui/material';

const commonKanji = '日本語学校先生学生友達家族仕事会社電車駅店食事';

const BackgroundPattern: React.FC = () => {
  const generateRandomKanji = () => {
    return commonKanji[Math.floor(Math.random() * commonKanji.length)];
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        opacity: 0.04,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            transform: `rotate(${Math.random() * 90 - 45}deg)`,
          }}
        >
          {generateRandomKanji()}
        </Box>
      ))}
    </Box>
  );
};

export default BackgroundPattern;
