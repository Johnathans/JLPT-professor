'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Clock } from 'lucide-react';

const ScheduleContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
}));

const ScheduleItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
}));

interface ScheduleItemType {
  time: string;
  count: number;
}

interface ReviewScheduleProps {
  items: ScheduleItemType[];
}

export default function ReviewSchedule({ items }: ReviewScheduleProps) {
  return (
    <ScheduleContainer>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        Upcoming Reviews
      </Typography>
      {items.map((item, index) => (
        <ScheduleItem key={index}>
          <Clock size={20} color="#7c4dff" />
          <Typography>
            <strong>{item.count}</strong> items in <strong>{item.time}</strong>
          </Typography>
        </ScheduleItem>
      ))}
    </ScheduleContainer>
  );
}
