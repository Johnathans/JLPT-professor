'use client';

import React from 'react';
import { Box, Grid, Card, Typography, List, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ReviewListItem from '@/components/dashboard/ReviewListItem';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UnitBlock from '@/components/dashboard/UnitBlock';
import { useJlptData } from '@/hooks/useJlptData';

const VOCAB_STYLE = { fontWeight: 500 };
const KANJI_STYLE = { fontWeight: 500, fontSize: '1.5rem' };
const GRAMMAR_STYLE = { fontWeight: 500 };

const units = [
  {
    title: 'Basic Greetings',
    imageUrl: '/images/greetings.svg',
    wordCount: 25,
    kanjiCount: 10
  },
  {
    title: 'Daily Life',
    imageUrl: '/images/daily-life.svg',
    wordCount: 40,
    kanjiCount: 15
  },
  {
    title: 'Travel & Transport',
    imageUrl: '/images/kim-deokryul-4Jlzdmqg-Pc-unsplash.jpg',
    wordCount: 35,
    kanjiCount: 12
  },
  {
    title: 'Food & Dining',
    imageUrl: '/images/blocks/4306483_asian_bowl_chopsticks_food_noodle_icon.png',
    wordCount: 30,
    kanjiCount: 8
  }
];

export default function DashboardPage() {
  const [mode, setMode] = React.useState('study');
  const [filter, setFilter] = React.useState('all');
  const [selectedLevel, setSelectedLevel] = React.useState('n5');
  const [selectedItems, setSelectedItems] = React.useState<{[key: string]: boolean}>({});

  const { getLevelData, isLoading } = useJlptData('n5');
  const levelData = getLevelData(selectedLevel as 'n5' | 'n4' | 'n3' | 'n2' | 'n1');

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleStart = (unitTitle: string) => {
    console.log(`Starting unit: ${unitTitle}`);
  };

  const handleReview = (unitTitle: string) => {
    console.log(`Reviewing unit: ${unitTitle}`);
  };

  const handleJlptLevelChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedItems({}); // Reset selections when level changes
  };

  const handleItemToggle = React.useCallback((id: string) => {
    requestAnimationFrame(() => {
      setSelectedItems(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    });
  }, []);

  return (
    <DashboardLayout onJlptLevelChange={handleJlptLevelChange}>
      <Box sx={{ p: 3, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
        {/* Mode Toggle */}
        <Box sx={{ mb: 4, backgroundColor: '#F5F5F5', p: 1, borderRadius: 2 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="study mode"
            sx={{
              display: 'flex',
              gap: '8px',
              width: { xs: '100%', sm: 'auto' },
              height: '48px',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '12px !important',
                px: 4,
                flex: { xs: 1, sm: 'none' },
                minWidth: { xs: 0, sm: '120px' },
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#666666',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                textTransform: 'none',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 600,
                  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }
              }
            }}
          >
            <ToggleButton value="study" aria-label="study mode">
              Study
            </ToggleButton>
            <ToggleButton value="review" aria-label="review mode">
              Review
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filter Buttons (Review Mode Only) */}
        {mode === 'review' && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              aria-label="review filter"
              sx={{
                backgroundColor: '#F5F5F5',
                p: '4px',
                borderRadius: '12px',
                gap: '8px',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '8px !important',
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#666666',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: '#FFFFFF',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                  }
                }
              }}
            >
              <ToggleButton value="new">New</ToggleButton>
              <ToggleButton value="learning">Learning</ToggleButton>
              <ToggleButton value="learned">Learned</ToggleButton>
              <ToggleButton value="mastered">Mastered</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {mode === 'study' ? (
          <Grid container spacing={3}>
            {units.map((unit, index) => (
              <Grid item xs={12} sm={6} md={3} key={unit.title}>
                <UnitBlock
                  {...unit}
                  onStart={() => handleStart(unit.title)}
                  onReview={() => handleReview(unit.title)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: '#E8F9FD' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Vocabulary</Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {levelData.vocabulary.map((item, index) => (
                    <ReviewListItem
                      key={index}
                      id={`vocab-${index}`}
                      primary={item.kanji || item.kana}
                      secondary={item.meanings.join(', ')}
                      isSelected={selectedItems[`vocab-${index}`] || false}
                      onToggle={handleItemToggle}
                      primaryStyle={{ fontWeight: 500 }}
                    />
                  ))}
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: '#E8F9FD' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Kanji</Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {levelData.kanji.map((item, index) => (
                    <ReviewListItem
                      key={index}
                      id={`kanji-${index}`}
                      primary={item.character}
                      secondary={item.meanings.join(', ')}
                      isSelected={selectedItems[`kanji-${index}`] || false}
                      onToggle={handleItemToggle}
                      primaryStyle={KANJI_STYLE}
                    />
                  ))}
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: '100%', borderRadius: 2, border: '1px solid', borderColor: '#E8F9FD' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Grammar</Typography>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {levelData.grammar.map((item, index) => (
                    <ReviewListItem
                      key={index}
                      id={`grammar-${index}`}
                      primary={item.pattern}
                      secondary={item.kana}
                      isSelected={selectedItems[`grammar-${index}`] || false}
                      onToggle={handleItemToggle}
                      primaryStyle={{ fontWeight: 500 }}
                    />
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </DashboardLayout>
  );
}
