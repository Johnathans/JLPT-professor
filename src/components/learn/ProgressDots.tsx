'use client';

import React from 'react';
import { Box } from '@mui/material';

interface ProgressDotsProps {
  total: number;
  current: number;
  maxVisible?: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
  total,
  current,
  maxVisible = 10,
}) => {
  // Calculate which dots to show if we have more than maxVisible
  const getVisibleDots = () => {
    if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i);
    
    // Always show first and last dots
    const dots = [0, total - 1];
    
    // Calculate middle dots around current position
    const middleStart = Math.max(1, Math.min(current - 1, total - maxVisible + 1));
    const middleEnd = Math.min(total - 2, middleStart + maxVisible - 3);
    
    for (let i = middleStart; i <= middleEnd; i++) {
      dots.push(i);
    }
    
    return dots.sort((a, b) => a - b);
  };

  const visibleDots = getVisibleDots();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        flex: 1,
      }}
    >
      {visibleDots.map((index, arrayIndex) => {
        const isGap = arrayIndex > 0 && visibleDots[arrayIndex - 1] !== index - 1;
        
        return (
          <React.Fragment key={index}>
            {isGap && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 0.5,
                }}
              >
                •••
              </Box>
            )}
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                ...(index === current
                  ? {
                      bgcolor: '#27cc56',
                      transform: 'scale(1.2)',
                    }
                  : index < current
                  ? {
                      bgcolor: '#27cc56',
                      opacity: 0.3,
                    }
                  : {
                      bgcolor: '#e0e0e0',
                    }),
              }}
            />
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default ProgressDots;
