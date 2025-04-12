'use client';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import { format, eachDayOfInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const CalendarWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(15px, 1fr))',
  gap: '4px',
  marginTop: theme.spacing(2),
}));

const CalendarCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'intensity',
})<{ intensity?: number }>(({ theme, intensity = 0 }) => {
  const getBackgroundColor = () => {
    switch (intensity) {
      case 0:
        return theme.palette.grey[100];
      case 1:
        return theme.palette.primary.light;
      case 2:
        return theme.palette.primary.main;
      case 3:
        return theme.palette.primary.dark;
      default:
        return theme.palette.grey[100];
    }
  };

  return {
    width: '15px',
    height: '15px',
    borderRadius: '2px',
    backgroundColor: getBackgroundColor(),
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  };
});

interface StudyDay {
  date: string;
  intensity: number;
}

interface StudyCalendarProps {
  studyData: StudyDay[];
}

export default function StudyCalendar({ studyData }: StudyCalendarProps) {
  const [calendarData, setCalendarData] = useState<StudyDay[]>([]);

  useEffect(() => {
    const endDate = new Date();
    const startDate = subMonths(startOfMonth(endDate), 5);
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate }).map(
      date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const studyDay = studyData.find(d => d.date === dateStr);
        return {
          date: dateStr,
          intensity: studyDay?.intensity || 0,
        };
      }
    );

    setCalendarData(allDays);
  }, [studyData]);

  return (
    <CalendarWrapper>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>Study Activity</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Last 6 months of activity
      </Typography>
      <CalendarGrid>
        {calendarData.map((day) => (
          <CalendarCell
            key={day.date}
            intensity={day.intensity}
            title={`${day.date}: ${day.intensity} studies`}
          />
        ))}
      </CalendarGrid>
    </CalendarWrapper>
  );
}
