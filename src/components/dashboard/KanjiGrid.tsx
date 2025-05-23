'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { useMediaQuery, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { JLPT_DATA } from '@/data/jlpt';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

export interface KanjiGridProps {
  renderSelectionButtons?: (buttons: React.ReactNode) => void;
}

interface KanjiData {
  character: string;
  meanings: string[];
}

export default function KanjiGrid({ renderSelectionButtons }: KanjiGridProps) {
  const { level } = useJlptLevel();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const itemsPerPage = isDesktop ? 15 : 6;
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const levelKey = level.toLowerCase() as keyof typeof JLPT_DATA.kanji;
  const allKanji = JLPT_DATA.kanji[levelKey];
  const totalPages = Math.ceil(allKanji.length / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKanji = allKanji.slice(startIndex, endIndex);

  const handleSelect = (index: number) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setSelectedItems([]);
  };

  useEffect(() => {
    setPage(1);
    setSelectedItems([]);
  }, [level]);

  useEffect(() => {
    if (renderSelectionButtons && selectedItems.length > 0) {
      renderSelectionButtons(
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Poppins',
            fontSize: '0.875rem',
            color: '#666'
          }}>
            {selectedItems.length} items selected
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            sx={{ 
              bgcolor: 'white',
              borderColor: '#7c4dff',
              color: '#7c4dff',
              '&:hover': { 
                bgcolor: 'rgba(124, 77, 255, 0.04)',
                borderColor: '#6b42e0',
                color: '#6b42e0'
              }
            }}
          >
            Study Selected
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: 'white',
              borderColor: '#7c4dff',
              color: '#7c4dff',
              '&:hover': {
                bgcolor: 'rgba(124, 77, 255, 0.04)',
                borderColor: '#6b42e0',
                color: '#6b42e0'
              }
            }}
          >
            Mark as Known
          </Button>
        </Box>
      );
    } else if (renderSelectionButtons) {
      renderSelectionButtons(null);
    }
  }, [selectedItems.length, renderSelectionButtons]);

  return (
    <Box>
      <Grid container spacing={2}>
        {currentKanji.map((kanji, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={startIndex + index}>
            <Card 
              elevation={0}
              onClick={() => handleSelect(startIndex + index)}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedItems.includes(startIndex + index) ? '#7c4dff' : '#e0e0e0',
                '&:hover': {
                  borderColor: '#7c4dff',
                  bgcolor: 'rgba(124, 77, 255, 0.04)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 700 }}>
                  {kanji.character}
                </Typography>
                <Checkbox 
                  checked={selectedItems.includes(startIndex + index)}
                  onChange={() => handleSelect(startIndex + index)}
                  sx={{ 
                    color: '#7c4dff',
                    '&.Mui-checked': {
                      color: '#7c4dff'
                    }
                  }}
                />
              </Box>
              <Typography sx={{ mt: 1, color: '#666' }}>
                {kanji.meanings.join(', ')}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isDesktop && totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{ 
              '& .MuiPaginationItem-root': { fontFamily: 'Poppins' },
              '& .Mui-selected': { bgcolor: '#7c4dff !important' }
            }} 
          />
        </Box>
      )}
    </Box>
  );
}
