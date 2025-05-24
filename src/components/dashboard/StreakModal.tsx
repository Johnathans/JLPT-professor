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
  backgroundColor: theme.palette.grey[50],
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
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
  backgroundColor: active ? theme.palette.primary.light : theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  fontWeight: 600,
  ...(isToday && {
    border: `2px dashed ${theme.palette.warning.main}`,
  }),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[100],
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#4caf50',
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
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlameIcon sx={{ color: '#ff9100', fontSize: 24 }} />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Your streak
          </Typography>
        </Box>
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
        {timeRemaining && (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 3,
              color: 'text.primary',
              fontWeight: 500,
            }}
          >
            {timeRemaining} remaining to start your streak!
          </Typography>
        )}

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

        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Current
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </Typography>
              <Box sx={{ 
                bgcolor: '#e8f5e9', 
                p: 0.5, 
                borderRadius: '50%',
                display: 'flex'
              }}>
                <Box component="span" role="img" aria-label="checkmark">
                  ✓
                </Box>
              </Box>
            </Box>
            <StyledLinearProgress
              variant="determinate"
              value={(currentStreak / 7) * 100}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Longest
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </Typography>
            <StyledLinearProgress
              variant="determinate"
              value={(longestStreak / 7) * 100}
            />
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          Each day watch a video, practice a conversation, learn or review words to
          keep your streak growing.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default StreakModal;
