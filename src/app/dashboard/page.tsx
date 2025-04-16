'use client';

import { Box, Grid, Typography, Card, CircularProgress, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import ContentContainer from '@/components/shared/ContentContainer';
import { useEffect, useState } from 'react';
import { Module, ModuleProgress as ModuleProgressType, DailyStudyPlan as DailyStudyPlanType } from '@/types/module';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const initialProgressItems = [
  {
    title: 'Kanji',
    progress: 0,
    count: '0 learned',
    reviewsDue: 0,
    color: '#7C4DFF',
    bgColor: '#F6F3FF'
  },
  {
    title: 'Vocabulary',
    progress: 0,
    count: '0 words',
    reviewsDue: 0,
    color: '#00BFA5',
    bgColor: '#E6F7F5'
  },
  {
    title: 'Grammar',
    progress: 0,
    count: '0 points',
    reviewsDue: 0,
    color: '#FF9100',
    bgColor: '#FFF4E5'
  },
  {
    title: 'Listening',
    progress: 0,
    count: '0 exercises',
    reviewsDue: 0,
    color: '#1890FF',
    bgColor: '#E6F4FF'
  }
];

export default function Dashboard() {
  const router = useRouter();
  const { level: currentLevel, userId } = useJlptLevel();
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgressType | null>(null);
  const [studyPlan, setStudyPlan] = useState<DailyStudyPlanType | null>(null);
  const [progressItems, setProgressItems] = useState(initialProgressItems);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        // Get total items for each category
        const { count: kanjiCount } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('type', 'kanji');

        const { count: vocabCount } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('type', 'vocabulary');

        const { count: grammarCount } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('type', 'grammar');

        // Get items due for review
        const now = new Date().toISOString();
        const { count: kanjiReviews } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('type', 'kanji')
          .lte('next_review', now);

        const { count: vocabReviews } = await supabase
          .from('srs_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('type', 'vocabulary')
          .lte('next_review', now);

        // Update progress items with actual data
        setProgressItems([
          {
            title: 'Kanji',
            progress: Math.round((kanjiCount || 0) / 100 * 100), // Assuming 100 kanji total for N5
            count: `${kanjiCount || 0} learned`,
            reviewsDue: kanjiReviews || 0,
            color: '#7C4DFF',
            bgColor: '#F6F3FF'
          },
          {
            title: 'Vocabulary',
            progress: Math.round((vocabCount || 0) / 200 * 100), // Assuming 200 vocab total for N5
            count: `${vocabCount || 0} words`,
            reviewsDue: vocabReviews || 0,
            color: '#00BFA5',
            bgColor: '#E6F7F5'
          },
          {
            title: 'Grammar',
            progress: Math.round((grammarCount || 0) / 50 * 100), // Assuming 50 grammar points total for N5
            count: `${grammarCount || 0} points`,
            reviewsDue: 0,
            color: '#FF9100',
            bgColor: '#FFF4E5'
          },
          {
            title: 'Listening',
            progress: 0,
            count: '0 exercises',
            reviewsDue: 0,
            color: '#1890FF',
            bgColor: '#E6F4FF'
          }
        ]);

      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      const { data: progress, error: progressError } = await supabase
        .from('module_progress')
        .select('*')
        .eq('userId', userId)
        .eq('status', 'in_progress')
        .single();

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return;
      }

      setModuleProgress(progress);

      if (progress?.moduleId) {
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', progress.moduleId)
          .single();

        if (moduleError) {
          console.error('Error fetching module:', moduleError);
          return;
        }

        setCurrentModule(module);
      }

      // Fetch study plan
      const { data: plan, error: planError } = await supabase
        .from('daily_study_plans')
        .select('*')
        .eq('userId', userId)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (planError && planError.code !== 'PGRST116') {
        console.error('Error fetching study plan:', planError);
      }

      setStudyPlan(plan);
    };

    fetchData();
  }, [userId]);

  return (
    <ContentContainer>
      <Box sx={{ py: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#1A2027',
            mb: 4,
            fontSize: '2rem',
            letterSpacing: '-0.02em'
          }}
        >
          Course Progress
        </Typography>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {progressItems.map((item) => (
            <Grid item xs={12} sm={6} key={item.title}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 2,
                  bgcolor: '#fff',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '280px',
                  transition: 'box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)'
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#1A2027',
                      fontWeight: 700,
                      mb: 2,
                      letterSpacing: '-0.01em',
                      fontSize: '1.5rem'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#637381',
                      mb: 1,
                      fontSize: '1rem'
                    }}
                  >
                    {item.count}
                  </Typography>
                  {item.reviewsDue > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#637381',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '1rem'
                      }}
                    >
                      {item.reviewsDue} reviews due today
                    </Typography>
                  )}
                </Box>

                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: 4
                }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={120}
                      thickness={4}
                      sx={{
                        color: '#F4F6F8',
                        position: 'absolute',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round'
                        }
                      }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={item.progress}
                      size={120}
                      thickness={4}
                      sx={{
                        color: item.color,
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round'
                        }
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: item.color,
                          fontWeight: 600
                        }}
                      >
                        {item.progress}%
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() => router.push(`/learn/${item.title.toLowerCase()}`)}
                    sx={{
                      width: '100%',
                      color: '#212B36',
                      borderColor: '#E2E8F0',
                      bgcolor: '#fff',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                        borderColor: '#CBD5E1'
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 1.5
                    }}
                  >
                    Keep Studying
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#212B36',
                mb: 3
              }}
            >
              Recent Activity
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Due for Review</Typography>
                  {/* List of items due for review */}
                  {/* Kanji and vocabulary with SRS intervals */}
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>New Content</Typography>
                  {/* New lessons available */}
                  {/* Reading passages and listening exercises */}
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#212B36',
                mb: 3
              }}
            >
              Study Streak
            </Typography>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              {/* Calendar heatmap showing study streak */}
              {/* Daily goals and achievements */}
            </Card>
          </Grid>
        </Grid>

        {studyPlan && (
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#212B36',
                mb: 3
              }}
            >
              Today's Study Plan
            </Typography>
            {/* Study plan content will be implemented later */}
          </Box>
        )}
      </Box>
    </ContentContainer>
  );
}
