'use client';

import React from 'react';
import { Box, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UnitBlock from '@/components/dashboard/UnitBlock';

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
    imageUrl: '/images/travel.svg',
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

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: string) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleStart = (unitTitle: string) => {
    console.log(`Starting unit: ${unitTitle}`);
  };

  const handleReview = (unitTitle: string) => {
    console.log(`Reviewing unit: ${unitTitle}`);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3, bgcolor: '#FFFFFF' }}>
        <Box sx={{ mb: 4 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="study mode"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              bgcolor: '#F5F5F5',
              p: '4px',
              borderRadius: '16px',
              gap: '8px',
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
                  bgcolor: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 600,
                  boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.5)'
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
      </Box>
    </DashboardLayout>
  );
}
