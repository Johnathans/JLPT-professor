'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  styled,
} from '@mui/material';
import { X as CloseIcon } from 'react-feather';
import FlameIcon from '@mui/icons-material/LocalFireDepartment';

const weekDays = [
  { key: 'sun', label: 'S' },
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
];

const CircleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

interface CircleProps {
  active?: boolean;
  isToday?: boolean;
}

const Circle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isToday',
})<CircleProps>(({ theme, active, isToday }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: active ? '#e8f5e9' : '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? '#2e7d32' : '#757575',
  fontWeight: 600,
  ...(isToday && {
    border: '2px dashed #27cc56',
  }),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[100],
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#27cc56',
  },
}));

interface StreakModalProps {
  open: boolean;
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  timeRemaining: string;
  activeDays: number[];
}

const StreakModal: React.FC<StreakModalProps> = ({
  open,
  onClose,
  currentStreak,
  longestStreak,
  timeRemaining,
  activeDays,
}) => {
  const today = new Date().getDay();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#fff',
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
          Your Streak
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <CircleContainer>
          {weekDays.map((day, index) => (
            <Circle
              key={day.key}
              active={activeDays.includes(index)}
              isToday={index === today}
            >
              {day.label}
            </Circle>
          ))}
        </CircleContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
          <FlameIcon sx={{ color: '#27cc56', fontSize: 48 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            {currentStreak} day streak
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{ 
            color: '#666',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            p: 2,
            borderRadius: 2,
            fontSize: '0.95rem'
          }}
        >
          Complete at least one review session each day to maintain your streak. Practice consistently to master Japanese faster!
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default StreakModal;
