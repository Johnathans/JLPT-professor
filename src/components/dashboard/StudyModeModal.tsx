'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import {
  School,
  FlashOn,
  TextFields,
  CompareArrows,
  Close
} from '@mui/icons-material';

export interface StudyModeModalProps {
  open: boolean;
  onClose: () => void;
  onModeSelect: (mode: string) => void;
}

const studyModes = [
  {
    id: 'single-match',
    title: 'Single Match',
    description: 'Match words with their correct meanings one at a time',
    icon: <CompareArrows sx={{ fontSize: 48, color: '#333' }} />
  },
  {
    id: 'multi-match',
    title: 'Multi Match',
    description: 'Challenge yourself by matching multiple pairs simultaneously',
    icon: <School sx={{ fontSize: 48, color: '#333' }} />
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Traditional flashcard-style learning with spaced repetition',
    icon: <FlashOn sx={{ fontSize: 48, color: '#333' }} />
  },
  {
    id: 'sentence',
    title: 'Sentence Learning',
    description: 'Learn words in context with example sentences',
    icon: <TextFields sx={{ fontSize: 48, color: '#333' }} />
  },
  {
    id: 'reading',
    title: 'Reading Practice',
    description: 'Practice reading comprehension with short passages',
    icon: <School sx={{ fontSize: 48, color: '#333' }} />
  },
  {
    id: 'listening',
    title: 'Listening Practice',
    description: 'Improve your listening skills with audio exercises',
    icon: <TextFields sx={{ fontSize: 48, color: '#333' }} />
  }
];

const StudyModeModal: React.FC<StudyModeModalProps> = ({
  open,
  onClose,
  onModeSelect
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 3, pr: 6, '& .MuiTypography-root': { fontWeight: 600 } }}>
        Select Study Mode
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: '#666666'
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {studyModes.map((mode, index) => (
            <Grid item xs={12} sm={6} md={4} key={mode.id}>
              <Paper
                elevation={0}
                onClick={() => onModeSelect(mode.id)}
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    color: '#666',
                    fontSize: '0.875rem'
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Box sx={{ mb: 2, mt: 2 }}>
                  {mode.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {mode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mode.description}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Typography
                    sx={{
                      color: '#333',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Read More
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StudyModeModal;
