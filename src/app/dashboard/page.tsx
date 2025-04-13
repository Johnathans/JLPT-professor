'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  LinearProgress,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  BookOpen, 
  GraduationCap, 
  PenTool,
  Headphones,
  Play,
  Trophy,
} from 'lucide-react';
import StudyCalendar from '@/components/StudyCalendar';
import ProfessorCharacter from '@/components/ProfessorCharacter';
import ReviewSchedule from '@/components/ReviewSchedule';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

const PageContainer = styled(Box)(({ theme }) => ({
  width: 'calc(1600px - 280px)', 
  maxWidth: '100%',
  margin: '0 auto',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: '#fff',
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: '8px !important',
    margin: '0 4px',
    padding: '6px 18px',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: '#7c4dff',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#6c3fff',
      },
    },
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
}));

const ProgressCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const IconCircle = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: '#e8e3ff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#7c4dff',
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: 'auto',
}));

// Use a fixed date for mock data to avoid hydration mismatches
const FIXED_DATE = '2025-04-12';
const mockStudyData = Array.from({ length: 180 }).map((_, i) => {
  const date = new Date(FIXED_DATE);
  date.setDate(date.getDate() - (179 - i));
  return {
    date: date.toISOString().split('T')[0],
    intensity: i % 4,
  };
});

const stats = [
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    icon: <BookOpen size={24} />,
    total: 2136,
    completed: 523,
    reviewsDue: 48,
  },
  {
    id: 'kanji',
    title: 'Kanji',
    icon: <PenTool size={24} />,
    total: 1026,
    completed: 284,
    reviewsDue: 32,
  },
  {
    id: 'grammar',
    title: 'Grammar',
    icon: <GraduationCap size={24} />,
    total: 186,
    completed: 42,
    reviewsDue: 15,
  },
  {
    id: 'listening',
    title: 'Listening',
    icon: <Headphones size={24} />,
    total: 524,
    completed: 128,
    reviewsDue: 24,
  },
];

const upcomingReviews = [
  { time: '30 minutes', count: 28 },
  { time: '1 hour', count: 15 },
  { time: '4 hours', count: 42 },
];

export default function Dashboard() {
  const { level: currentLevel, setLevel } = useJlptLevel();
  
  const handleLevelChange = (event: React.MouseEvent<HTMLElement>, newLevel: string) => {
    if (newLevel !== null) {
      setLevel(newLevel as 'N5' | 'N4' | 'N3' | 'N2' | 'N1');
    }
  };

  const totalReviewsDue = stats.reduce((acc, stat) => acc + stat.reviewsDue, 0);
  const streakDays = 23; 

  return (
    <PageContainer>
      <ProfessorCharacter 
        message={`Welcome back! You have ${totalReviewsDue} items to review.`}
        submessage={`Keep up your ${streakDays}-day study streak!`}
      />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
              Current Level
            </Typography>
            <StyledToggleButtonGroup
              value={currentLevel}
              exclusive
              onChange={handleLevelChange}
              aria-label="JLPT Level"
            >
              <ToggleButton value="N5">N5</ToggleButton>
              <ToggleButton value="N4">N4</ToggleButton>
              <ToggleButton value="N3">N3</ToggleButton>
              <ToggleButton value="N2">N2</ToggleButton>
              <ToggleButton value="N1">N1</ToggleButton>
            </StyledToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {totalReviewsDue > 0 && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Play />}
                sx={{
                  backgroundColor: '#7c4dff',
                  '&:hover': {
                    backgroundColor: '#6c3fff',
                  },
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 4,
                }}
              >
                Start Reviews ({totalReviewsDue})
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#7c4dff',
                color: '#7c4dff',
                '&:hover': {
                  borderColor: '#6c3fff',
                  backgroundColor: '#e8e3ff',
                },
                borderRadius: '12px',
                textTransform: 'none',
                px: 4,
              }}
            >
              Take {currentLevel} Practice Test
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} key={stat.id}>
              <ProgressCard elevation={0}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconCircle>
                    {stat.icon}
                  </IconCircle>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {stat.completed} of {stat.total} items mastered
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stat.completed / stat.total) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e8e3ff',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#7c4dff',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {stat.reviewsDue > 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    backgroundColor: '#e8e3ff',
                    p: 1.5,
                    borderRadius: 2,
                    color: '#7c4dff',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Play size={18} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {stat.reviewsDue} items due for review
                      </Typography>
                    </Box>
                  </Box>
                )}

                <ButtonGroup>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      flexGrow: 1,
                      borderColor: '#e0e0e0',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: '#7c4dff',
                        backgroundColor: '#e8e3ff',
                      }
                    }}
                  >
                    Study New
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ 
                      flexGrow: 1,
                      borderColor: '#e0e0e0',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: '#7c4dff',
                        backgroundColor: '#e8e3ff',
                      }
                    }}
                  >
                    Practice
                  </Button>
                </ButtonGroup>
              </ProgressCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StatsCard elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Trophy size={20} color="#7c4dff" />
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Study Activity
              </Typography>
            </Box>
            <StudyCalendar data={mockStudyData} />
          </StatsCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <ReviewSchedule items={upcomingReviews} />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
