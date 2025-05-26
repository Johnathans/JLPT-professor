'use client';

import React, { useState, useMemo, useCallback, memo, ReactElement } from 'react';

import StudyModeModal from './StudyModeModal';
import VirtualizedTable from './VirtualizedTable';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  SelectChangeEvent,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';


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
      return '#59CE8F';
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

  const renderTableContent = (items: ReviewItem[]): ReactElement => {
    return (
      <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', display: 'flex' }}>
        <VirtualizedTable
          items={items}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          getStatusColor={getStatusColor}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <MenuItem value="vocabulary">Vocabulary ({data.vocabulary.length})</MenuItem>
            <MenuItem value="kanji">Kanji ({data.kanji.length})</MenuItem>
            <MenuItem value="grammar">Grammar ({data.grammar.length})</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleSelectAll}
            disabled={!filteredData.length}
          >
            Select All
          </Button>
          <Button
            variant="contained"
            onClick={() => onMarkAsKnown(selectedItems)}
            disabled={!selectedItems.length}
          >
            Mark as Known
          </Button>
          <Button
            variant="contained"
            onClick={() => onStartReview(selectedItems)}
            disabled={!selectedItems.length}
          >
            Start Review
          </Button>
        </Box>
      </Box>

      <Tabs
        value={filter}
        onChange={(_, newValue) => onFilterChange(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontSize: '1.2rem',
            fontWeight: 700,
            '&.Mui-selected': {
              color: '#00c2b2',
              fontWeight: 700,
            },
          },
        }}
      >
        <Tab label="Vocabulary" value="vocabulary" />
        <Tab label="Kanji" value="kanji" />
        <Tab label="Grammar" value="grammar" />
      </Tabs>

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
