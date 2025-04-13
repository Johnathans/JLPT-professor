'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

const CalendarWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(20, 1fr)',
  gap: 2,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(15, 1fr)',
  },
}));

const DayCell = styled(Box)<{ intensity: number }>(({ theme, intensity }) => {
  const getColor = (level: number) => {
    switch (level) {
      case 1: return '#e8e3ff';
      case 2: return '#b4a0ff';
      case 3: return '#7c4dff';
      default: return '#f5f5f5';
    }
  };

  return {
    aspectRatio: '1',
    backgroundColor: getColor(intensity),
    borderRadius: '2px',
    width: '100%',
    minWidth: '12px',
    maxWidth: '16px',
  };
});

const Legend = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface StudyCalendarProps {
  data: Array<{
    date: string;
    intensity: number;
  }>;
}

export default function StudyCalendar({ data }: StudyCalendarProps) {
  return (
    <CalendarWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Study Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last 6 Months
        </Typography>
      </Box>
      <CalendarGrid>
        {data.map((day) => (
          <DayCell
            key={day.date}
            intensity={day.intensity}
            title={`${day.date}: ${day.intensity} study sessions`}
          />
        ))}
      </CalendarGrid>
      <Legend>
        <LegendItem>
          <DayCell intensity={0} />
          <Typography variant="caption" color="text.secondary">None</Typography>
        </LegendItem>
        <LegendItem>
          <DayCell intensity={1} />
          <Typography variant="caption" color="text.secondary">Light</Typography>
        </LegendItem>
        <LegendItem>
          <DayCell intensity={2} />
          <Typography variant="caption" color="text.secondary">Medium</Typography>
        </LegendItem>
        <LegendItem>
          <DayCell intensity={3} />
          <Typography variant="caption" color="text.secondary">Heavy</Typography>
        </LegendItem>
      </Legend>
    </CalendarWrapper>
  );
}
