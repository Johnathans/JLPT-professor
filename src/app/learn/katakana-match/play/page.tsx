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

// Dynamically import the game component with no SSR
const KatakanaMatchGame = dynamic(() => import('../KatakanaMatchGame'), {
  ssr: false,
});

// Import KATAKANA_SETS directly from a new constants file to avoid SSR issues
const KATAKANA_SETS = {
  a: ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ka: ['カ', 'キ', 'ク', 'ケ', 'コ'],
  sa: ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ta: ['タ', 'チ', 'ツ', 'テ', 'ト'],
  na: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ha: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ma: ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ya: ['ヤ', 'ユ', 'ヨ'],
  ra: ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  wa: ['ワ', 'ヲ', 'ン'],
};

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

function KatakanaMatchGameWithParams() {
  const searchParams = useSearchParams();
  const characters = searchParams.get('characters')?.split(',') || ['ア'];
  const [progress, setProgress] = useState(0);
  const total = characters.length; // Total number of katakana characters to practice

  // Convert characters to groups
  const groups = Array.from(new Set(characters.map(char => {
    for (const [group, chars] of Object.entries(KATAKANA_SETS)) {
      if (chars.includes(char)) {
        return group;
      }
    }
    return 'a'; // Default to 'a' group if not found
  })));

  return (
    <PageContainer>
      <HeaderContainer>
        <BackLink href="/resources/katakana-match">
          <ArrowBack />
          Back to Settings
        </BackLink>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Katakana Practice
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
        <KatakanaMatchGame 
          groups={groups}
          characterCount={characters.length}
          onProgressUpdate={setProgress}
        />
      </MainContent>
    </PageContainer>
  );
}

export default KatakanaMatchGameWithParams;
