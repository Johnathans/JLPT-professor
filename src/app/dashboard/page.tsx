'use client';

import { Box, Grid, Typography } from '@mui/material';
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
    imageUrl: '/images/food.svg',
    wordCount: 30,
    kanjiCount: 8
  }
];

export default function DashboardPage() {
  const handleStart = (unitTitle: string) => {
    console.log(`Starting unit: ${unitTitle}`);
  };

  const handleReview = (unitTitle: string) => {
    console.log(`Reviewing unit: ${unitTitle}`);
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#000000' }}>
          Learning Path
        </Typography>
        
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
