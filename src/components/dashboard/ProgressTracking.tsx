'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface ProgressTrackingProps {
  wordsKnown: number;
  totalWords: number;
  kanjiKnown: number;
  totalKanji: number;
  dailyProgress: number[];
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({
  wordsKnown,
  totalWords,
  kanjiKnown,
  totalKanji,
  dailyProgress
}) => {
  const overallProgress = Math.round(((wordsKnown + kanjiKnown) / (totalWords + totalKanji)) * 100);

  return (
    <Box sx={{ width: 280, p: 3 }}>
      {/* Overall Progress Circle */}
      <Box sx={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4 
      }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={120}
          thickness={4}
          sx={{ 
            color: 'rgba(45, 222, 152, 0.12)',
            position: 'absolute'
          }}
        />
        <CircularProgress
          variant="determinate"
          value={overallProgress}
          size={120}
          thickness={4}
          sx={{ 
            color: '#2dde98',
            position: 'absolute'
          }}
        />
        <Box sx={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: '#1a1a1a',
            fontSize: '2.5rem',
            lineHeight: 1
          }}>
            {overallProgress}%
          </Typography>
          <Typography sx={{ 
            color: '#666',
            fontSize: '0.875rem',
            mt: 0.5
          }}>
            Complete
          </Typography>
        </Box>
      </Box>

      {/* Daily Progress */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ 
          fontSize: '0.875rem', 
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 2 
        }}>
          Daily Progress
        </Typography>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1
        }}>
          {dailyProgress.map((progress, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                height: 80,
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: `${progress}%`,
                  bgcolor: '#2dde98',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Words and Kanji Progress */}
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ 
            fontSize: '0.875rem',
            color: '#666',
            mb: 1
          }}>
            Words Known
          </Typography>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'baseline',
            gap: 1
          }}>
            <Typography sx={{ 
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1a1a1a'
            }}>
              {wordsKnown}
            </Typography>
            <Typography sx={{ 
              fontSize: '0.875rem',
              color: '#666'
            }}>
              / {totalWords}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ 
            fontSize: '0.875rem',
            color: '#666',
            mb: 1
          }}>
            Kanji Known
          </Typography>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'baseline',
            gap: 1
          }}>
            <Typography sx={{ 
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1a1a1a'
            }}>
              {kanjiKnown}
            </Typography>
            <Typography sx={{ 
              fontSize: '0.875rem',
              color: '#666'
            }}>
              / {totalKanji}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressTracking;
