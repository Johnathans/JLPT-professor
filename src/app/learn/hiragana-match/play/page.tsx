'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  LinearProgress,
  Grid,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../hiragana-match.module.css';

// Dynamically import the game component with no SSR
const HiraganaMatchGame = dynamic(() => import('../HiraganaMatchGame'), {
  ssr: false,
});

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const BackLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  marginRight: theme.spacing(2),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flex: 1,
  minHeight: 0,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  height: 24,
}));

function HiraganaMatchGameWithParams() {
  const searchParams = useSearchParams();
  const characters = searchParams.get('characters')?.split(',') || ['あ'];
  const [progress, setProgress] = useState(0);
  const total = characters.length; // Total number of hiragana characters

  // Convert characters to groups
  const groups = Array.from(new Set(characters.map(char => {
    // Find which group this character belongs to
    if (char.match(/^[あいうえお]$/)) return 'a';
    if (char.match(/^[かきくけこ]$/)) return 'ka';
    if (char.match(/^[さしすせそ]$/)) return 'sa';
    if (char.match(/^[たちつてと]$/)) return 'ta';
    if (char.match(/^[なにぬねの]$/)) return 'na';
    if (char.match(/^[はひふへほ]$/)) return 'ha';
    if (char.match(/^[まみむめも]$/)) return 'ma';
    if (char.match(/^[やゆよ]$/)) return 'ya';
    if (char.match(/^[らりるれろ]$/)) return 'ra';
    if (char.match(/^[わをん]$/)) return 'wa';
    return 'a'; // Default to 'a' group if not found
  })));

  return (
    <PageContainer>
      <HeaderContainer>
        <BackLink href="/resources/hiragana-match">
          <ArrowBack />
          Back to Settings
        </BackLink>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Hiragana Practice
        </Typography>
        <LevelChip label="Beginner" size="small" />
      </HeaderContainer>

      <ProgressContainer>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(progress / total) * 100}
              sx={{
                backgroundColor: 'rgba(0, 191, 165, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00bfa5'
                }
              }}
            />
          </Grid>
        </Grid>
      </ProgressContainer>

      <MainContent>
        <HiraganaMatchGame 
          groups={groups}
          characterCount={characters.length}
          onProgressUpdate={setProgress}
        />
      </MainContent>
    </PageContainer>
  );
}

export default HiraganaMatchGameWithParams;
