"use client";

import { Box, Grid, Typography, Card, CircularProgress, Button, Stack, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { useEffect, useState } from 'react';
import { Module, ModuleProgress as ModuleProgressType, DailyStudyPlan as DailyStudyPlanType } from '@/types/module';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LocalFireDepartment, School, MenuBook, Headphones } from '@mui/icons-material';

const PageWrapper = styled('div')({
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  display: 'flex',
  flexDirection: 'column',
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: '#fff',
  border: '1px solid #e2e8f0',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#fff',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#f1f5f9',
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: '#7c4dff',
  }
}));

const StudyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#1a2027',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  border: '1px solid #e2e8f0',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  }
}));

const studyTypes = [
  {
    title: 'Kanji',
    icon: School,
    description: 'Master Japanese characters',
    path: '/learn/kanji',
    color: '#7c4dff'
  },
  {
    title: 'Vocabulary',
    icon: MenuBook,
    description: 'Build your word power',
    path: '/learn/vocabulary',
    color: '#00bfa5'
  },
  {
    title: 'Listening',
    icon: Headphones,
    description: 'Improve comprehension',
    path: '/learn/listening',
    color: '#ff9100'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { level: currentLevel, userId } = useJlptLevel();
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [progress, setProgress] = useState({
    kanji: 0,
    vocabulary: 0,
    grammar: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        // Fetch study streak
        const { data: streakData } = await supabase
          .from('user_stats')
          .select('study_streak')
          .eq('user_id', userId)
          .single();
        
        setStudyStreak(streakData?.study_streak || 0);

        // Fetch reviews due today
        const now = new Date().toISOString();
        const { count: reviewCount } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lte('next_review', now);

        setTotalReviews(reviewCount || 0);

        // Fetch progress for each type
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (progressData) {
          setProgress({
            kanji: progressData.kanji_progress || 0,
            vocabulary: progressData.vocabulary_progress || 0,
            grammar: progressData.grammar_progress || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <WelcomeCard>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <LocalFireDepartment sx={{ fontSize: 40, color: '#ff9100' }} />
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom color="#1a2027">
                {studyStreak} Day Streak!
              </Typography>
              <Typography color="text.secondary">
                You have {totalReviews} reviews due today
              </Typography>
            </Box>
          </Stack>
          <ProgressBar variant="determinate" value={30} />
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            30% towards your daily goal
          </Typography>
        </WelcomeCard>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a2027' }}>
          Study Decks
        </Typography>

        <Grid container spacing={3} mb={4}>
          {studyTypes.map((type) => (
            <Grid item xs={12} md={4} key={type.title}>
              <StatsCard>
                <Box sx={{ mb: 2 }}>
                  <type.icon sx={{ fontSize: 32, color: type.color, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600} color="#1a2027">
                    {type.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {type.description}
                  </Typography>
                  <ProgressBar 
                    variant="determinate" 
                    value={progress[type.title.toLowerCase() as keyof typeof progress] || 0}
                    sx={{
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: type.color,
                      }
                    }}
                  />
                </Box>
                <Box sx={{ mt: 'auto' }}>
                  <StudyButton
                    fullWidth
                    onClick={() => router.push(type.path)}
                    sx={{
                      '&:hover': {
                        borderColor: type.color,
                        color: type.color,
                      }
                    }}
                  >
                    Start Studying
                  </StudyButton>
                </Box>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1a2027' }}>
          Recent Activity
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StatsCard>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2027' }}>
                Reviews Due Today
              </Typography>
              {/* Review schedule component will be added here */}
            </StatsCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsCard>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a2027' }}>
                Study Stats
              </Typography>
              {/* Study statistics component will be added here */}
            </StatsCard>
          </Grid>
        </Grid>
      </ContentWrapper>
    </PageWrapper>
  );
}
