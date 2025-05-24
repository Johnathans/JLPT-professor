import { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, Checkbox, Grid, Pagination, useMediaQuery, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from '@/app/dashboard/page.module.css';
import { JLPT_DATA } from '@/data/jlpt';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

interface GrammarGridProps {
  renderSelectionButtons?: (buttons: React.ReactNode) => void;
}

export default function GrammarGrid({ renderSelectionButtons }: GrammarGridProps) {
  const { level } = useJlptLevel();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const itemsPerPage = isDesktop ? 12 : 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    setSelectedItems([]);
  }, [level]);
  
  const levelKey = level.toLowerCase() as keyof typeof JLPT_DATA.grammar;
  const allGrammar = JLPT_DATA.grammar[levelKey];
  const totalPages = Math.ceil(allGrammar.length / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGrammar = allGrammar.slice(startIndex, endIndex);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleSelect = (index: number) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    if (renderSelectionButtons && selectedItems.length > 0) {
      renderSelectionButtons(
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
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
              borderColor: '#7c4dff',
              color: '#7c4dff',
              '&:hover': {
                borderColor: '#6b42e0',
                bgcolor: 'rgba(124, 77, 255, 0.04)'
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
    <>
      <Grid container spacing={2}>
        {currentGrammar.map((item, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card 
              elevation={0}
              onClick={() => handleSelect(index)}
              sx={{ 
                cursor: 'pointer',
                position: 'relative',
                bgcolor: selectedItems.includes(index) ? '#f8f9fa' : 'white',
                border: '2px solid #333',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
            >
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                color: selectedItems.includes(index) ? '#7c4dff' : '#e0e0e0'
              }}>
                <Checkbox 
                  checked={selectedItems.includes(index)}
                  sx={{ 
                    '&.Mui-checked': {
                      color: '#7c4dff'
                    }
                  }}
                />
              </Box>

              <Box sx={{ p: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1, 
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: '2.5rem'
                  }}
                >
                  {item.pattern}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ mb: 0.5 }}
                >
                  {item.kana}
                </Typography>
              </Box>
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
    </>
  );
}
