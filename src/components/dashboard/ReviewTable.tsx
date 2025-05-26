'use client';

import React, { useState, useMemo, useCallback, memo, ReactElement } from 'react';
import VirtualizedTable from './VirtualizedTable';
import StudyModeModal from './StudyModeModal';
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
  Chip,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton
} from '@mui/material';
import { FilterList, Check, PlayArrow, CheckCircleOutline } from '@mui/icons-material';

interface ReviewItem {
  id: string;
  primary: string;
  secondary?: string;
  meanings: string[];
  status: 'new' | 'learning' | 'learned' | 'mastered';
}

interface ReviewData {
  vocabulary: ReviewItem[];
  kanji: ReviewItem[];
  grammar: ReviewItem[];
}

interface ReviewData {
  vocabulary: ReviewItem[];
  kanji: ReviewItem[];
  grammar: ReviewItem[];
  [key: number]: ReviewItem[];
}

interface ReviewTableProps {
  data: ReviewData;
  filter: string;
  onFilterChange: (filter: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onMarkAsKnown?: (selectedIds: string[]) => void;
  onStartReview?: (selectedIds: string[]) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return { bg: '#E8F9FD', text: '#333333' };
    case 'learning':
      return { bg: '#FFF4E5', text: '#B76E00' };
    case 'learned':
      return { bg: '#E6F4EA', text: '#1E8E3E' };
    case 'mastered':
      return { bg: '#E8F0FE', text: '#1A73E8' };
    default:
      return { bg: '#E8F9FD', text: '#333333' };
  }
};

const ReviewTable = memo(({ 
  data, 
  filter, 
  onFilterChange, 
  onSelectionChange,
  onMarkAsKnown,
  onStartReview
}: ReviewTableProps): ReactElement => {
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  // Map currentTab index to data key
  const tabToKey = ['vocabulary', 'kanji', 'grammar'] as const;
  const currentData = data[tabToKey[currentTab]] || [];

  // Memoize selected items count
  const selectedCount = useMemo(() => Object.keys(selectedItems).length, [selectedItems]);

  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleFilterClose = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number): void => {
    setCurrentTab(newValue);
  }, []);

  const getFilteredData = useCallback((items: ReviewItem[]) => {
    if (filter === 'all') return items;
    return items.filter(item => item.status === filter);
  }, [filter]);

  const renderTableContent = useCallback((items: ReviewItem[]): ReactElement => {
    const filteredItems = useMemo(() => getFilteredData(items), [items, getFilteredData]);
    
    const handleItemSelect = useCallback((id: string, checked: boolean) => {
      const newSelected = { ...selectedItems };
      if (checked) {
        newSelected[id] = true;
      } else {
        delete newSelected[id];
      }
      setSelectedItems(newSelected);
      onSelectionChange?.(Object.keys(newSelected));
    }, [selectedItems, onSelectionChange]);

    const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newSelected = event.target.checked
        ? filteredItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
        : {};
      setSelectedItems(newSelected);
      onSelectionChange?.(Object.keys(newSelected));
    }, [filteredItems, onSelectionChange]);
    
    return (
      <>
        <Paper 
          elevation={0}
          sx={{ 
            border: '1px solid #E8F9FD',
            borderRadius: 2,
            height: 'calc(100vh - 300px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 1, 
            borderBottom: '1px solid #E8F9FD',
            bgcolor: '#f8f9fa'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Checkbox
                indeterminate={selectedCount > 0 && selectedCount < filteredItems.length}
                checked={selectedCount > 0 && selectedCount === filteredItems.length}
                onChange={handleSelectAll}
                sx={{
                  color: '#757575',
                  '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                    color: '#59CE8F',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(89, 206, 143, 0.08)'
                  }
                }}
              />
              <Box sx={{ width: '30%', fontWeight: 600, pl: 3 }}>Character/Pattern</Box>
              <Box sx={{ width: '50%', fontWeight: 600, pl: 1 }}>Meaning</Box>
              <Box sx={{ width: '20%', fontWeight: 600, textAlign: 'center' }}>Status</Box>
              <IconButton onClick={handleFilterClick}>
                <FilterList />
              </IconButton>
            </Box>
          </Box>
          
          <VirtualizedTable
            items={filteredItems}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            getStatusColor={getStatusColor}
          />
        </Paper>
        {selectedCount > 0 && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 3,
            mb: 2,
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              onClick={() => onMarkAsKnown?.(Object.keys(selectedItems))}
              startIcon={<CheckCircleOutline />}
              size="large"
              sx={{
                minWidth: '160px',
                bgcolor: '#757575',
                '&:hover': {
                  bgcolor: '#616161'
                }
              }}
            >
              Mark as Known
            </Button>
            <Button
              variant="contained"
              onClick={() => setStudyModalOpen(true)}
              startIcon={<PlayArrow />}
              size="large"
              sx={{
                minWidth: '160px',
                bgcolor: '#59CE8F',
                '&:hover': {
                  bgcolor: '#4CAF50'
                }
              }}
            >
              Start Review
            </Button>
          </Box>
        )}
      </>
    );
  }, [filter, selectedItems, selectedCount, onSelectionChange, getFilteredData, onMarkAsKnown, handleFilterClick, setStudyModalOpen]);

  const filterOptions = useMemo(() => [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'learning', label: 'Learning' },
    { value: 'learned', label: 'Learned' },
    { value: 'mastered', label: 'Mastered' }
  ], []);

  const statusFilters = useMemo(() => [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'learning', label: 'Learning' },
    { value: 'learned', label: 'Learned' },
    { value: 'mastered', label: 'Mastered' }
  ], []);

  const handleFilterChange = useCallback((value: string): void => {
    onFilterChange(value);
    handleFilterClose();
  }, [onFilterChange, handleFilterClose]);

  return (
    <Box sx={{ width: '100%' }}>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          mb: 2,
          '& .MuiTabs-indicator': {
            backgroundColor: '#59CE8F',
          },
          '& .MuiTab-root': {
            color: '#424242',
            fontSize: '1.2rem',
            fontWeight: 700,
            '&.Mui-selected': {
              color: '#59CE8F',
              fontWeight: 700,
            },
          },
        }}
      >
        <Tab label="Vocabulary" />
        <Tab label="Kanji" />
        <Tab label="Grammar" />
      </Tabs>

      {currentData.length > 0 ? renderTableContent(currentData) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for this section
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
      >
        {filterOptions.map(({ value, label }) => (
          <MenuItem
            key={value}
            onClick={() => {
              handleFilterChange(value);
              handleFilterClose();
            }}
          >
            <ListItemIcon>
              {filter === value && <Check sx={{ color: '#59CE8F' }} />}
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>

      <StudyModeModal
        open={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
        onModeSelect={(mode: string) => {
          setStudyModalOpen(false);
          onStartReview?.(Object.keys(selectedItems));
        }}
      />
    </Box>
  );
});

export default ReviewTable;
