'use client';

import { Box, CircularProgress, Typography, styled, LinearProgress, Tabs, Tab, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
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

const StyledSelect = styled(Select<StudyMode>)(({ theme }) => ({
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
  marginBottom: theme.spacing(1)
}));

const SrsLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: '#666',
  width: '32px'
});

const SrsCount = styled(Typography)({
  fontSize: '0.75rem',
  color: '#666',
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
  const [tabValue, setTabValue] = useState(0);
  const [mode, setMode] = useState<StudyMode>('flashcard');
  const router = useRouter();

  const handleModeChange = (event: SelectChangeEvent<StudyMode>) => {
    setMode(event.target.value as StudyMode);
  };

  return (
    <>
      <MobileHeader>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard')}
          sx={{ 
            color: '#7c4dff',
            minWidth: 'auto',
            p: 1
          }}
        >
          <Typography 
            sx={{ 
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Dashboard
          </Typography>
        </Button>
        <StyledSelect
          value={mode}
          onChange={handleModeChange}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 200 }}
        >
          <MenuItem value="flashcard">Flashcards</MenuItem>
          <MenuItem value="writing">Writing Practice</MenuItem>
          <MenuItem value="match">Matching Game</MenuItem>
        </StyledSelect>
      </MobileHeader>

      <Sidebar>
        <NavigationSection>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/dashboard')}
            sx={{
              color: '#7c4dff',
              justifyContent: 'flex-start',
              px: 2
            }}
          >
            Back to Dashboard
          </Button>
          <StyledSelect
            value={mode}
            onChange={handleModeChange}
            fullWidth
            size="small"
          >
            <MenuItem value="flashcard">Flashcards</MenuItem>
            <MenuItem value="writing">Writing Practice</MenuItem>
            <MenuItem value="match">Matching Game</MenuItem>
          </StyledSelect>
        </NavigationSection>

        <StyledTabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <StyledTab label="This Round" />
          <StyledTab label="Overall" />
        </StyledTabs>

        <MasterySection>
          <Box sx={{ position: 'relative', width: 80, height: 80 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{
                color: '#e8e3ff',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <CircularProgress
              variant="determinate"
              value={confidence}
              size={80}
              thickness={4}
              sx={{
                color: '#7c4dff',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#7c4dff',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {confidence}%
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500 }}>
            {tabValue === 0 ? 'Round Progress' : 'Overall Mastery'}
          </Typography>
        </MasterySection>

        <SrsSection>
          <SectionTitle>SRS Status</SectionTitle>
          <SrsBar>
            <SrsLabel>New</SrsLabel>
            <LinearProgress 
              variant="determinate" 
              value={(srsStats.new / 50) * 100} 
              sx={{ 
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e8e3ff',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#7c4dff'
                }
              }} 
            />
            <SrsCount>{srsStats.new}</SrsCount>
          </SrsBar>
          <SrsBar>
            <SrsLabel>学習</SrsLabel>
            <LinearProgress 
              variant="determinate" 
              value={(srsStats.learning / 50) * 100}
              sx={{ 
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#fff3e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#ff9100'
                }
              }} 
            />
            <SrsCount>{srsStats.learning}</SrsCount>
          </SrsBar>
          <SrsBar>
            <SrsLabel>完了</SrsLabel>
            <LinearProgress 
              variant="determinate" 
              value={(srsStats.graduated / 50) * 100}
              sx={{ 
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0f2f1',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00bfa5'
                }
              }} 
            />
            <SrsCount>{srsStats.graduated}</SrsCount>
          </SrsBar>
        </SrsSection>

        <ProgressSection>
          <SectionTitle>Study Time</SectionTitle>
          <TimeDisplay>1:28</TimeDisplay>
        </ProgressSection>
      </Sidebar>
    </>
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
