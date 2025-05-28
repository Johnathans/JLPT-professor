'use client';

import React, { useState } from 'react';
import { Box, Card, Typography, Button, Avatar } from '@mui/material';
import { MenuBook, School, Assignment, Language } from '@mui/icons-material';
import UnitPreviewModal from './UnitPreviewModal';
import BackgroundPattern from './BackgroundPattern';

interface Word {
  id: string;
  kanji?: string;
  kana: string;
  meaning: string;
}

interface UnitBlockProps {
  isLast?: boolean;
  title: string;
  imageUrl: string;
  wordCount: number;
  kanjiCount: number;
  color?: string;
  hasStarted?: boolean;
  words: Word[];
  onStart: (knownWordIds: string[]) => void;
  index?: number;
}

const icons = {
  vocabulary: <MenuBook />,
  grammar: <School />,
  kanji: <Assignment />,
  reading: <Language />
};

const UnitBlock: React.FC<UnitBlockProps> = ({
  title,
  imageUrl,
  wordCount,
  kanjiCount,
  hasStarted = false,
  words,
  onStart,
  index = 1,
  isLast = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
        ml: 4,
        pb: 6,
        mb: 3,
        p: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '-16px',
          top: '24px',
          bottom: isLast ? '24px' : 0,
          width: '2px',
          backgroundColor: hasStarted ? '#27cc56' : '#e0e0e0',
          zIndex: 0
        },
        '& .MuiAvatar-root': {
          marginRight: 3,
          marginTop: 2,
          width: 60,
          height: 60,
          borderRadius: 2,
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      {/* Timeline Node */}
      <Box
        sx={{
          position: 'absolute',
          left: '-20px',
          top: '20px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: hasStarted ? '#27cc56' : 'white',
          border: '2px solid',
          borderColor: hasStarted ? '#27cc56' : '#e0e0e0',
          zIndex: 1
        }}
      />

      {/* Unit Image */}
      <Avatar
        src={imageUrl}
        variant="square"
        alt={title}
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          '&:hover': {
            '& .unit-title': {
              color: '#2dde98'
            }
          }
        }}
      >
        {/* Unit Number */}
        <Typography
          sx={{
            color: '#666',
            fontSize: '0.875rem',
            mb: 1,
            fontWeight: 500
          }}
        >
          Unit {String(index).padStart(2, '0')}
        </Typography>

        {/* Title */}
        <Typography
          className="unit-title"
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#1a1a1a',
            mb: 1,
            fontSize: '1.25rem',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s'
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: '#666',
            fontSize: '0.875rem',
            mb: 3,
            lineHeight: 1.4
          }}
        >
          {wordCount} words with example sentences and audio
        </Typography>

        {/* Icon and Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            mt: 2
          }}
        >
          <Box
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                color: hasStarted ? '#27cc56' : '#666'
              }
            }}
          >
            {icons.vocabulary}
          </Box>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outlined"
            sx={{
              color: hasStarted ? '#27cc56' : '#666',
              borderColor: hasStarted ? '#27cc56' : '#e0e0e0',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              py: 1,
              minWidth: '120px',
              '&:hover': {
                borderColor: '#27cc56',
                color: '#27cc56',
                backgroundColor: 'rgba(39, 204, 86, 0.04)'
              }
            }}
          >
            {hasStarted ? 'Continue' : 'Start Unit'}
          </Button>
        </Box>
      </Box>

      <UnitPreviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        words={words}
        onStart={onStart}
        hasStarted={hasStarted}
      />
    </Box>
  );
};

export default UnitBlock;
