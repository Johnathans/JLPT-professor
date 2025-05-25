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
    icon: <CompareArrows sx={{ fontSize: 48, color: '#59CE8F' }} />
  },
  {
    id: 'multi-match',
    title: 'Multi Match',
    description: 'Challenge yourself by matching multiple pairs simultaneously',
    icon: <School sx={{ fontSize: 48, color: '#59CE8F' }} />
  },
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Traditional flashcard-style learning with spaced repetition',
    icon: <FlashOn sx={{ fontSize: 48, color: '#59CE8F' }} />
  },
  {
    id: 'sentence',
    title: 'Sentence Learning',
    description: 'Learn words in context with example sentences',
    icon: <TextFields sx={{ fontSize: 48, color: '#59CE8F' }} />
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
          {studyModes.map((mode) => (
            <Grid item xs={12} sm={6} key={mode.id}>
              <Paper
                elevation={0}
                onClick={() => onModeSelect(mode.id)}
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: '#E8F9FD',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#59CE8F',
                    bgcolor: 'rgba(89, 206, 143, 0.04)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {mode.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {mode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mode.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StudyModeModal;
