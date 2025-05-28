'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface Word {
  id: string;
  kanji?: string;
  kana: string;
  meaning: string;
}

interface UnitPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  words: Word[];
  onStart: (knownWordIds: string[]) => void;
  hasStarted?: boolean;
}

const UnitPreviewModal: React.FC<UnitPreviewModalProps> = ({
  open,
  onClose,
  title,
  words,
  onStart,
  hasStarted = false
}) => {
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());

  const handleToggleWord = (wordId: string) => {
    setKnownWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  const handleMarkAllKnown = () => {
    setKnownWords(new Set(words.map(word => word.id)));
  };

  const handleStart = () => {
    onStart(Array.from(knownWords));
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#FFFFFF'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666666', mt: 0.5 }}>
            {words.length} words and phrases
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#666666' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="text"
            onClick={handleMarkAllKnown}
            sx={{
              color: '#3b82f6',
              '&:hover': {
                bgcolor: 'rgba(59, 130, 246, 0.04)'
              }
            }}
          >
            Mark all as known
          </Button>
        </Box>

        <List sx={{ mb: 3 }}>
          {words.map((word) => (
            <ListItem
              key={word.id}
              disablePadding
              sx={{ 
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Checkbox
                  checked={knownWords.has(word.id)}
                  onChange={() => handleToggleWord(word.id)}
                  sx={{
                    color: '#E8F9FD',
                    '&.Mui-checked': {
                      color: '#27cc56'
                    }
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {word.kanji && (
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {word.kanji}
                      </Typography>
                    )}
                    <Typography 
                      sx={{ 
                        fontSize: word.kanji ? '0.875rem' : '1.1rem',
                        color: word.kanji ? '#666666' : 'inherit'
                      }}
                    >
                      {word.kana}
                    </Typography>
                  </Box>
                }
                secondary={word.meaning}
                secondaryTypographyProps={{
                  sx: { color: '#666666' }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleStart}
            sx={{
              bgcolor: hasStarted ? '#3b82f6' : '#27cc56',
              color: 'white',
              px: 4,
              '&:hover': {
                bgcolor: hasStarted ? '#2563eb' : '#4AB57E'
              }
            }}
          >
            {hasStarted ? 'Continue learning' : 'Start learning'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UnitPreviewModal;
