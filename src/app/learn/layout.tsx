'use client';

import { Box, CircularProgress, Typography, styled, LinearProgress, Tabs, Tab, Button, Select, MenuItem, SelectChangeEvent, ButtonGroup } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowBack } from '@mui/icons-material';

type StudyMode = 'flashcard' | 'writing' | 'match';

const LayoutRoot = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
});

const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  backgroundColor: '#f8fafc',
  overflow: 'auto',
  padding: theme.spacing(1),
  marginLeft: 240,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1),
    marginLeft: 0
  }
}));

const Sidebar = styled('div')(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: 240,
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0,0,0,0.08)',
  overflow: 'hidden',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const MobileHeader = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const NavigationSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#fff',
  '& .MuiSelect-select': {
    padding: theme.spacing(1, 2),
  }
}));

const StyledTabs = styled(Tabs)({
  minHeight: 36,
  '& .MuiTabs-indicator': {
    backgroundColor: '#7c4dff'
  }
});

const StyledTab = styled(Tab)({
  minHeight: 36,
  padding: '6px 12px',
  fontSize: '0.875rem',
  textTransform: 'none',
  fontWeight: 500,
  color: '#666',
  '&.Mui-selected': {
    color: '#7c4dff',
    fontWeight: 600
  }
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#666',
  marginBottom: theme.spacing(2)
}));

const MasterySection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px'
});

const SrsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
});

const SrsBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2)
}));

const SrsLabel = styled(Typography)({
  fontSize: '0.875rem',
  color: '#1f2937',
  fontWeight: 500,
  width: '60px'
});

const SrsCount = styled(Typography)({
  fontSize: '0.875rem',
  color: '#1f2937',
  fontWeight: 500,
  marginLeft: 'auto'
});

const ProgressSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

const TimeDisplay = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#7c4dff',
  textAlign: 'center',
  marginTop: '8px'
});

const LevelButton = styled(Button)(({ theme }) => ({
  padding: '6px 12px',
  minWidth: '48px',
  fontSize: '0.875rem',
  color: '#666',
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#7c4dff',
  },
  '&.active': {
    backgroundColor: '#7c4dff',
    color: '#fff',
    borderColor: '#7c4dff',
    '&:hover': {
      backgroundColor: '#6b3fff',
    }
  }
}));

function SidebarComponent({ 
  confidence = 0,
  srsStats = {
    new: 12,
    learning: 34,
    graduated: 8,
    buried: 2,
    suspended: 0
  }
}) {
  const [level, setLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const router = useRouter();

  return (
    <Sidebar>
      <NavigationSection>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard')}
          sx={{ 
            color: '#7c4dff',
            minWidth: 'auto',
            p: 1,
            mb: 2
          }}
        >
          Dashboard
        </Button>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#666', fontWeight: 500 }}>
            JLPT Level
          </Typography>
          <ButtonGroup variant="outlined" fullWidth>
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((jlptLevel) => (
              <LevelButton
                key={jlptLevel}
                className={level === jlptLevel ? 'active' : ''}
                onClick={() => setLevel(jlptLevel as 'N5' | 'N4' | 'N3' | 'N2' | 'N1')}
              >
                {jlptLevel}
              </LevelButton>
            ))}
          </ButtonGroup>
        </Box>
      </NavigationSection>

      <SrsSection>
        <SectionTitle>SRS Status</SectionTitle>
        <SrsBar>
          <SrsLabel>New</SrsLabel>
          <LinearProgress 
            variant="determinate" 
            value={(srsStats.new / 50) * 100} 
            sx={{ 
              flexGrow: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e8e3ff',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#7c4dff'
              }
            }} 
          />
          <SrsCount>{srsStats.new}</SrsCount>
        </SrsBar>
        <SrsBar>
          <SrsLabel>Learning</SrsLabel>
          <LinearProgress 
            variant="determinate" 
            value={(srsStats.learning / 50) * 100}
            sx={{ 
              flexGrow: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#fff3e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ff9100'
              }
            }} 
          />
          <SrsCount>{srsStats.learning}</SrsCount>
        </SrsBar>
        <SrsBar>
          <SrsLabel>Mastered</SrsLabel>
          <LinearProgress 
            variant="determinate" 
            value={(srsStats.graduated / 50) * 100}
            sx={{ 
              flexGrow: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e0f2f1',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#00bfa5'
              }
            }} 
          />
          <SrsCount>{srsStats.graduated}</SrsCount>
        </SrsBar>
      </SrsSection>

      <Box sx={{ mt: 3 }}>
        <SectionTitle>Reviews</SectionTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ color: '#7c4dff', fontWeight: 500 }}>
            Due now: 15
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Due later today: 8
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Due tomorrow: 23
          </Typography>
        </Box>
      </Box>
    </Sidebar>
  );
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutRoot>
      <SidebarComponent confidence={20} srsStats={{ new: 12, learning: 34, graduated: 8, buried: 2, suspended: 0 }} />
      <MainContent>
        {children}
      </MainContent>
    </LayoutRoot>
  );
}
