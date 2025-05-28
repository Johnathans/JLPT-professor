'use client';

import React, { useState, useMemo, useCallback, memo, ReactElement } from 'react';

import StudyModeModal from './StudyModeModal';
import VirtualizedGrid from './VirtualizedGrid';
import {
  Box,
  Typography,
  Button,
  SelectChangeEvent,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ReviewItem {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  status: string;
}

interface ReviewData {
  vocabulary: ReviewItem[];
  kanji: ReviewItem[];
  grammar: ReviewItem[];
}

interface ReviewTableProps {
  data: ReviewData;
  filter: string;
  onFilterChange: (filter: string) => void;
  onSelectionChange: (selectedItems: string[]) => void;
  onMarkAsKnown: (selectedItems: string[]) => void;
  onStartReview: (selectedItems: string[]) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'known':
      return '#4CAF50';
    case 'learning':
      return '#FFC107';
    case 'new':
      return '#27cc56';
    default:
      return '#757575';
  }
};

const ReviewTable = memo(function ReviewTable({
  data, 
  filter, 
  onFilterChange,
  onSelectionChange,
  onMarkAsKnown,
  onStartReview
}: ReviewTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [studyModalOpen, setStudyModalOpen] = React.useState(false);

  // Move filteredData into useMemo to prevent unnecessary recalculations
  const filteredData = useMemo(() => data[filter as keyof ReviewData] || [], [data, filter]);

  const handleSelectAll = useCallback(() => {
    const allIds = filteredData.map(item => item.id);
    onSelectionChange(allIds);
    setSelectedItems(allIds);
  }, [filteredData, onSelectionChange]);

  const handleItemSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSelected = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      onSelectionChange(newSelected);
      return newSelected;
    });
  }, [onSelectionChange]);

  const onItemClick = useCallback((id: string) => {
    handleItemSelect(id);
  }, [handleItemSelect]);

  const renderTableContent = (items: ReviewItem[]): ReactElement => {
    const gridItems = items.map(item => ({
      id: item.id,
      character: item.word,
      reading: item.reading,
      meaning: item.meaning,
      type: (item.reading ? 'vocabulary' : 'kanji') as 'vocabulary' | 'kanji'
    }));
    return (
      <Box sx={{ height: 'calc(100vh - 250px)', width: '100%', mx: 1 }}>
        <VirtualizedGrid
          items={gridItems}
          onItemClick={onItemClick}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h1" sx={{ color: '#000', fontSize: '2.5rem', fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
        Review
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, ml: 1, gap: 2 }}>
        <FormControl sx={{ 
          minWidth: 240,
          '& .MuiOutlinedInput-root.MuiInputBase-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent'
            },
            height: '48px',
            fontSize: '1rem',
            backgroundColor: '#fff',
            borderRadius: '4px',
            borderBottom: '4px solid #e0e0e0',
            transition: 'all 0.2s ease',
            '& fieldset': {
              border: 'none'
            },
            '&:hover': {
              borderBottom: '4px solid #bdbdbd',
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            },
            '&.Mui-focused': {
              borderBottom: '4px solid #27cc56',
              backgroundColor: '#fff'
            }
          },
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            color: '#666666',
            '&.Mui-focused': {
              color: '#27cc56'
            }
          },
          '& .MuiSelect-select': {
            py: 1.5,
            px: 2
          },
          '& .MuiMenuItem-root': {
            fontSize: '1rem',
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.02)'
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(39, 204, 86, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(39, 204, 86, 0.12)'
              }
            }
          }
        }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => onFilterChange(e.target.value)}
            MenuProps={{
              sx: {
                '& .MuiPaper-root': {
                  borderRadius: '4px',
                  mt: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                },
                '& .MuiMenuItem-root': {
                  fontSize: '1rem',
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.06)'
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="vocabulary">Vocabulary ({data.vocabulary.length})</MenuItem>
            <MenuItem value="kanji">Kanji ({data.kanji.length})</MenuItem>
            <MenuItem value="grammar">Grammar ({data.grammar.length})</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1, mr: -1 }}>
          <Button
            variant="text"
            onClick={handleSelectAll}
            disabled={!filteredData.length}
            sx={{ 
              color: '#666666',
              bgcolor: '#fff',
              border: 'none',
              borderBottom: '4px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '1rem',
              py: 1.5,
              px: 3,
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderBottom: '4px solid #bdbdbd',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)'
              },
              '&.Mui-focused': {
                bgcolor: '#fff',
                borderBottom: '4px solid #27cc56'
              }
            }}
          >
            Select All
          </Button>
          <Button
            variant="text"
            onClick={() => onMarkAsKnown(selectedItems)}
            disabled={!selectedItems.length}
            sx={{ 
              bgcolor: '#fff',
              borderBottom: '4px solid #e0e0e0',
              borderRadius: '4px',
              color: '#666666',
              fontSize: '1rem',
              py: 1.5,
              px: 3,
              '&:hover': { 
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderBottom: '4px solid #bdbdbd'
              }
            }}
          >
            <CheckCircleOutlineIcon sx={{ mr: 1 }} />
            Mark as Known
          </Button>
          <Button
            variant="contained"
            onClick={() => onStartReview(selectedItems)}
            disabled={!selectedItems.length}
            sx={{ 
              bgcolor: '#27cc56',
              borderBottom: '4px solid #1fb848',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1rem',
              py: 1.5,
              px: 3,
              '&:hover': { 
                bgcolor: '#1fb848',
                borderBottom: '4px solid #1a9f3d'
              }
            }}
          >
            <PlayArrowIcon sx={{ mr: 1 }} />
            Start Review
          </Button>
        </Box>
      </Box>

      {filteredData.length > 0 ? renderTableContent(filteredData) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for this section
          </Typography>
        </Box>
      )}

      <StudyModeModal
        open={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
        onModeSelect={(mode: string) => {
          setStudyModalOpen(false);
          onStartReview(selectedItems);
        }}
      />
    </Box>
  );
});

ReviewTable.displayName = 'ReviewTable';
export default ReviewTable;
