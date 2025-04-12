'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress, 
  Grid,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  BookOpen, 
  GraduationCap, 
  PenTool,
  ChevronRight,
  Headphones,
  Target,
  Trophy
} from 'lucide-react';
import StudyCalendar from '@/components/StudyCalendar';
import { useJlptLevel } from '@/contexts/JlptLevelContext';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(4),
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

const StatsChip = styled(Paper)(({ theme }) => ({
  padding: '0.5rem 1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '999px',
  background: theme.palette.primary.light,
  color: theme.palette.primary.main,
  border: 'none',
  fontWeight: 500,
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: theme.palette.primary.light,
  borderRadius: '999px',
  border: 'none',
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: '999px',
    padding: '0.5rem 1rem',
    color: theme.palette.primary.main,
    fontWeight: 500,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
    '& .MuiLinearProgress-root': {
      transform: 'scaleX(1.02)',
    },
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(124, 77, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
  },
}));

// Sample data - will be fetched from backend
const mockStudyData = [
  ...Array.from({ length: 180 }).map((_, i) => ({
    date: new Date(Date.now() - (179 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    intensity: Math.floor(Math.random() * 4),
  })),
];

export default function Dashboard() {
  const { level: currentLevel, setLevel } = useJlptLevel();
  
  const handleLevelChange = (event: React.MouseEvent<HTMLElement>, newLevel: string) => {
    if (newLevel !== null) {
      setLevel(newLevel as 'N5' | 'N4' | 'N3' | 'N2' | 'N1');
    }
  };

  const stats = [
    {
      title: 'Reading',
      icon: BookOpen,
      progress: 65,
      items: '13/20 stories completed',
    },
    {
      title: 'Kanji',
      icon: PenTool,
      progress: 45,
      items: '45/100 kanji mastered',
    },
    {
      title: 'Vocabulary',
      icon: GraduationCap,
      progress: 30,
      items: '300/1000 words learned',
    },
    {
      title: 'Listening',
      icon: Headphones,
      progress: 55,
      items: '11/20 lessons completed',
    },
  ];

  return (
    <PageContainer>
      <WelcomeCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
              Welcome back, John!
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Current Goal: JLPT {currentLevel}
            </Typography>
          </Box>
          <StyledToggleButtonGroup
            value={currentLevel}
            exclusive
            onChange={handleLevelChange}
            aria-label="JLPT Level"
          >
            <ToggleButton value="N5" aria-label="N5">
              N5
            </ToggleButton>
            <ToggleButton value="N4" aria-label="N4">
              N4
            </ToggleButton>
            <ToggleButton value="N3" aria-label="N3">
              N3
            </ToggleButton>
            <ToggleButton value="N2" aria-label="N2">
              N2
            </ToggleButton>
            <ToggleButton value="N1" aria-label="N1">
              N1
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>
        <StyledLinearProgress variant="determinate" value={45} />
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          45% towards JLPT {currentLevel}
        </Typography>
      </WelcomeCard>

      <ProgressSection>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Progress
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatsCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <stat.icon size={20} color="#7c4dff" />
                    <Typography variant="h6">{stat.title}</Typography>
                  </Box>
                  <IconButton size="small">
                    <ChevronRight size={20} />
                  </IconButton>
                </Box>
                <StyledLinearProgress variant="determinate" value={stat.progress} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {stat.items}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {stat.progress}%
                  </Typography>
                </Box>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </ProgressSection>

      <Box sx={{ mb: 4 }}>
        <StudyCalendar studyData={mockStudyData} />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Continue Learning
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                p: 3, 
                borderRadius: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: 'primary.main',
              }}
              startIcon={<BookOpen size={24} />}
            >
              Continue Reading: "Morning in the Park"
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ 
                p: 3, 
                borderRadius: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  background: 'primary.light',
                },
              }}
              startIcon={<PenTool size={24} />}
            >
              Practice Kanji: 10 new characters
            </Button>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
