'use client';

import React, { useState } from 'react';
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

const ReviewTable: React.FC<ReviewTableProps> = ({ 
  data, 
  filter, 
  onFilterChange, 
  onSelectionChange,
  onMarkAsKnown,
  onStartReview
}) => {
  const [studyModalOpen, setStudyModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getFilteredData = (items: ReviewItem[]) => {
    if (filter === 'all') return items;
    return items.filter(item => item.status === filter);
  };

  const renderTableContent = (items: ReviewItem[]) => {
    const filteredItems = getFilteredData(items);
    
    return (
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          border: '1px solid',
          borderColor: '#E8F9FD',
          borderRadius: 2,
          height: 'calc(100vh - 300px)',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ bgcolor: '#f8f9fa' }}>
                <Checkbox
                  indeterminate={Object.keys(selectedItems).length > 0 && 
                    Object.keys(selectedItems).length < filteredItems.length}
                  checked={filteredItems.length > 0 && 
                    Object.keys(selectedItems).length === filteredItems.length}
                  onChange={(event) => {
                    const newSelected = event.target.checked
                      ? filteredItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
                      : {};
                    setSelectedItems(newSelected);
                    onSelectionChange?.(Object.keys(newSelected));
                  }}
                  sx={{
                    color: '#E8F9FD',
                    '&.Mui-checked': {
                      color: '#59CE8F',
                    },
                    '&.MuiCheckbox-indeterminate': {
                      color: '#59CE8F',
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Character/Pattern</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Reading/Meaning</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => {
              const statusColor = getStatusColor(item.status);
              return (
                <TableRow 
                  key={item.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(0, 0, 0, 0.02)'
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const newSelected = { ...selectedItems };
                    if (newSelected[item.id]) {
                      delete newSelected[item.id];
                    } else {
                      newSelected[item.id] = true;
                    }
                    setSelectedItems(newSelected);
                    onSelectionChange?.(Object.keys(newSelected));
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!selectedItems[item.id]}
                      sx={{
                        color: '#E8F9FD',
                        '&.Mui-checked': {
                          color: '#59CE8F',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        fontSize: currentTab === 1 ? '1.5rem' : '1rem',
                        fontWeight: 500
                      }}
                    >
                      {item.primary}
                    </Typography>
                    {item.secondary && (
                      <Typography variant="body2" color="textSecondary">
                        {item.secondary}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.meanings.join(', ')}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status}
                      size="small"
                      sx={{
                        bgcolor: statusColor.bg,
                        color: statusColor.text,
                        fontWeight: 500,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'learning', label: 'Learning' },
    { value: 'learned', label: 'Learned' },
    { value: 'mastered', label: 'Mastered' }
  ];

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            flex: 1,
            mr: 2,
            '& .MuiTabs-indicator': {
              backgroundColor: '#59CE8F',
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: '#666666',
              minHeight: 48,
              padding: '12px 24px',
              '&:hover': {
                color: '#59CE8F',
                opacity: 1
              },
              '&.Mui-selected': {
                color: '#59CE8F'
              }
            }
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Vocabulary</span>
                <Chip 
                  label={data.vocabulary.length} 
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.75rem',
                    bgcolor: currentTab === 0 ? '#59CE8F' : '#E8F9FD',
                    color: currentTab === 0 ? 'white' : '#666666',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Kanji</span>
                <Chip 
                  label={data.kanji.length} 
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.75rem',
                    bgcolor: currentTab === 1 ? '#59CE8F' : '#E8F9FD',
                    color: currentTab === 1 ? 'white' : '#666666',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Grammar</span>
                <Chip 
                  label={data.grammar.length} 
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.75rem',
                    bgcolor: currentTab === 2 ? '#59CE8F' : '#E8F9FD',
                    color: currentTab === 2 ? 'white' : '#666666',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              </Box>
            } 
          />
        </Tabs>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleFilterClick}
            size="small"
            sx={{
              ml: 2,
              border: '1px solid',
              borderColor: filter === 'all' ? '#E8F9FD' : '#59CE8F',
              p: 1,
              color: filter === 'all' ? '#666666' : '#59CE8F',
              '&:hover': {
                borderColor: '#59CE8F',
                bgcolor: 'rgba(89, 206, 143, 0.04)'
              }
            }}
          >
            <FilterList fontSize="small" />
          </IconButton>
          {filter !== 'all' && (
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: '#59CE8F',
                borderRadius: '50%',
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translate(25%, -25%)',
                border: '2px solid white'
              }}
            />
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: '#E8F9FD',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                borderRadius: 1,
                mx: 0.5,
                my: 0.25,
                '&:hover': {
                  bgcolor: 'rgba(89, 206, 143, 0.04)'
                }
              }
            },
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem 
              key={option.value} 
              selected={filter === option.value}
              onClick={() => {
                handleFilterClose();
                onFilterChange(option.value);
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {filter === option.value && <Check sx={{ color: '#59CE8F' }} />}
              </ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box sx={{ position: 'relative', height: 'calc(100vh - 300px)' }}>
        <Box hidden={currentTab !== 0}>
          {renderTableContent(data.vocabulary)}
        </Box>
        <Box hidden={currentTab !== 1}>
          {renderTableContent(data.kanji)}
        </Box>
        <Box hidden={currentTab !== 2}>
          {renderTableContent(data.grammar)}
        </Box>

        {/* Action Buttons */}
        {Object.keys(selectedItems).length > 0 && (
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid',
              borderColor: '#E8F9FD',
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => onMarkAsKnown?.(Object.keys(selectedItems))}
              sx={{
                flex: 1,
                maxWidth: 300,
                textTransform: 'none',
                borderColor: '#59CE8F',
                color: '#59CE8F',
                '&:hover': {
                  borderColor: '#4AB57E',
                  bgcolor: 'rgba(89, 206, 143, 0.04)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleOutline />
                Mark as Known
              </Box>
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => setStudyModalOpen(true)}
              sx={{
                flex: 1,
                maxWidth: 300,
                textTransform: 'none',
                bgcolor: '#59CE8F',
                color: 'white',
                '&:hover': {
                  bgcolor: '#4AB57E'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayArrow />
                Start Review
              </Box>
            </Button>
          </Box>
        )}
      </Box>
      <StudyModeModal
        open={studyModalOpen}
        onClose={() => setStudyModalOpen(false)}
        onModeSelect={(mode) => {
          setStudyModalOpen(false);
          onStartReview?.(Object.keys(selectedItems));
        }}
      />
    </Box>
  );
};

export default ReviewTable;
