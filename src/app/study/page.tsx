'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton, styled, Menu, MenuItem, Typography, Divider } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Help from '@mui/icons-material/Help';
import TuneIcon from '@mui/icons-material/Tune';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useJlptLevel } from '@/hooks/useJlptLevel';
import { useColorMode } from '@/contexts/ThemeContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from '@/styles/dashboard.module.css';

const LayoutRoot = styled('div')(({ theme, darkMode }: { theme?: any, darkMode: boolean }) => ({
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: darkMode ? '#121212' : '#f3f4f6',
  transition: 'background-color 0.2s ease'
}));

const Sidebar = styled(Box)(({ expanded, darkMode }: { expanded: boolean, darkMode: boolean }) => ({
  width: expanded ? 240 : 72,
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRight: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
  transition: 'width 0.2s ease, background-color 0.2s ease',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 900px)': {
    display: 'none'
  }
}));

const MainContent = styled(Box)(({ sidebarExpanded, darkMode }: { sidebarExpanded: boolean, darkMode: boolean }) => ({
  flexGrow: 1,
  marginLeft: sidebarExpanded ? 240 : 72,
  padding: '24px 40px 40px',
  transition: 'margin-left 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  maxWidth: '1400px',
  '@media (max-width: 900px)': {
    marginLeft: 0,
    padding: '16px 16px 24px'
  }
}));

const TopBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  marginBottom: '16px',
  '@media (max-width: 900px)': {
    padding: '0 4px'
  }
});

const ModeButton = styled(IconButton)({
  backgroundColor: '#fff',
  padding: '12px',
  '&:hover': {
    backgroundColor: '#f3f4f6'
  }
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  borderBottom: '1px solid #e5e7eb',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  '@media (max-width: 900px)': {
    padding: '12px 16px'
  }
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#6F767E',
  fontSize: '14px',
  '& .value': {
    color: '#1f2937',
    fontWeight: 500
  },
  '&.accuracy .value': {
    color: '#7c4dff'
  }
});

const ContentCard = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRadius: '20px',
  padding: '48px',
  boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
  border: darkMode ? '1px solid #333' : 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  minHeight: '60vh',
  transition: 'background-color 0.2s ease',
  '@media (max-width: 900px)': {
    padding: '40px 24px',
    borderRadius: '16px',
    minHeight: 'unset'
  }
}));

const JapaneseSentence = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  fontSize: '42px',
  lineHeight: 1.7,
  textAlign: 'center',
  color: darkMode ? '#fff' : '#1f2937',
  margin: '12px 0',
  fontFamily: '"Futehodo Maru Gothic", sans-serif',
  fontWeight: 400,
  '& .highlight': {
    color: '#7c4dff',
    padding: '0 8px'
  },
  '@media (max-width: 900px)': {
    fontSize: '40px'
  }
}));

const EnglishTranslation = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  fontSize: '20px',
  color: darkMode ? '#aaa' : '#6F767E',
  textAlign: 'center',
  marginBottom: '24px',
  '@media (max-width: 900px)': {
    fontSize: '18px'
  }
}));

const ChoiceGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  '@media (max-width: 900px)': {
    gap: '16px'
  }
});

const ChoiceButton = styled(Button)<{ correct?: boolean; incorrect?: boolean; darkMode?: boolean }>(
  ({ correct, incorrect, darkMode }) => ({
    width: '100%',
    justifyContent: 'center',
    padding: '20px 32px',
    borderRadius: '12px',
    fontSize: '20px',
    fontFamily: '"Futehodo Maru Gothic", sans-serif',
    fontWeight: 400,
    backgroundColor: correct ? '#4caf50' : 
                   incorrect ? '#f44336' : 
                   darkMode ? '#2d2d2d' : '#fff',
    color: correct || incorrect ? '#fff' : 
          darkMode ? '#fff' : '#1f2937',
    border: '1px solid',
    borderColor: correct ? '#4caf50' : 
                incorrect ? '#f44336' : 
                darkMode ? '#333' : '#e5e7eb',
    '&:hover': {
      backgroundColor: correct ? '#43a047' : 
                     incorrect ? '#e53935' : 
                     darkMode ? '#383838' : '#f9fafb'
    },
    '@media (max-width: 900px)': {
      padding: '20px 24px',
      fontSize: '18px'
    }
  })
);

const navItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MenuBookIcon />, label: 'Kanji', path: '/learn/kanji' },
  { icon: <TranslateIcon />, label: 'Vocabulary', path: '/learn/vocabulary' },
  { icon: <FormatListBulletedIcon />, label: 'Grammar', path: '/learn/grammar' },
  { icon: <AccountCircleIcon />, label: 'Account', path: '/account' },
  { icon: <LogoutIcon />, label: 'Logout', path: '/logout' },
  { icon: <Settings />, label: 'Settings', path: '/settings' },
  { icon: <Help />, label: 'Help', path: '/help' }
];

function SidebarComponent({ 
  expanded, 
  onExpandedChange,
  darkMode 
}: { 
  expanded: boolean; 
  onExpandedChange: (expanded: boolean) => void;
  darkMode: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { level } = useJlptLevel();
  const supabase = createClientComponentClient();

  const getUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccountCircleIcon sx={{ width: 32, height: 32, color: '#7c4dff' }} />
        <Box sx={{ 
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          color: darkMode ? '#fff' : '#1f2937'
        }}>
          <Box sx={{ fontWeight: 600 }}>{level}</Box>
          <Box sx={{ fontSize: '0.875rem', color: darkMode ? '#aaa' : '#6F767E' }}>{level}</Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {navItems.map((item) => (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => router.push(item.path)}
            sx={{
              width: '100%',
              justifyContent: expanded ? 'flex-start' : 'center',
              color: pathname === item.path ? '#7c4dff' : darkMode ? '#fff' : '#1f2937',
              backgroundColor: pathname === item.path ? 
                (darkMode ? '#3a3052' : '#f3f0ff') : 
                'transparent',
              mb: 1,
              '&:hover': {
                backgroundColor: pathname === item.path ? 
                  (darkMode ? '#3a3052' : '#f3f0ff') : 
                  (darkMode ? '#383838' : '#f3f4f6')
              }
            }}
          >
            {expanded && item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

type StudyMode = 'vocabulary' | 'sentences' | 'kanji-onyomi' | 'kanji-kunyomi' | 'kanji-meaning';

const StudyModeLabels: Record<StudyMode, string> = {
  'vocabulary': 'Vocabulary',
  'sentences': 'Sentences',
  'kanji-onyomi': 'Kanji On\'yomi',
  'kanji-kunyomi': 'Kanji Kun\'yomi',
  'kanji-meaning': 'Kanji Meaning'
};

export default function StudyLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode, toggleDarkMode } = useColorMode();
  // Default to vocabulary mode
  const [studyMode, setStudyMode] = useState<StudyMode>('vocabulary');
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [remainingCards, setRemainingCards] = useState(0);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleStudyModeChange = (mode: StudyMode) => {
    setStudyMode(mode);
    handleSettingsClose();
  };

  const renderQuestion = () => {
    switch (studyMode) {
      case 'vocabulary':
        return (
          <>
            <JapaneseSentence darkMode={isDarkMode}>
              父
            </JapaneseSentence>
            <EnglishTranslation darkMode={isDarkMode}>
              Select the correct meaning
            </EnglishTranslation>
          </>
        );
      case 'sentences':
        return (
          <>
            <JapaneseSentence darkMode={isDarkMode}>
              私の<span className="highlight">＿＿＿</span>は医者です。
            </JapaneseSentence>
            <EnglishTranslation darkMode={isDarkMode}>
              My father is a doctor.
            </EnglishTranslation>
          </>
        );
      case 'kanji-onyomi':
      case 'kanji-kunyomi':
      case 'kanji-meaning':
        return (
          <>
            <JapaneseSentence 
              darkMode={isDarkMode} 
              sx={{ 
                fontSize: '96px', 
                margin: '0 !important',
                fontFamily: '"Futehodo Maru Gothic", sans-serif',
                '@media (max-width: 900px)': { fontSize: '72px' } 
              }}
            >
              父
            </JapaneseSentence>
            <EnglishTranslation darkMode={isDarkMode}>
              {studyMode === 'kanji-onyomi' ? 'Select the correct on\'yomi reading' :
               studyMode === 'kanji-kunyomi' ? 'Select the correct kun\'yomi reading' :
               'Select the correct meaning'}
            </EnglishTranslation>
          </>
        );
    }
  };

  const renderChoices = () => {
    switch (studyMode) {
      case 'vocabulary':
        return (
          <ChoiceGrid>
            <ChoiceButton darkMode={isDarkMode}>father</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>mother</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>older brother</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>older sister</ChoiceButton>
          </ChoiceGrid>
        );
      case 'sentences':
        return (
          <ChoiceGrid>
            <ChoiceButton darkMode={isDarkMode}>父</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>母</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>兄</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>姉</ChoiceButton>
          </ChoiceGrid>
        );
      case 'kanji-onyomi':
        return (
          <ChoiceGrid>
            <ChoiceButton darkMode={isDarkMode}>フ</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>チチ</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>トウ</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>オヤ</ChoiceButton>
          </ChoiceGrid>
        );
      case 'kanji-kunyomi':
        return (
          <ChoiceGrid>
            <ChoiceButton darkMode={isDarkMode}>ちち</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>とう</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>おや</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>ふ</ChoiceButton>
          </ChoiceGrid>
        );
      case 'kanji-meaning':
        return (
          <ChoiceGrid>
            <ChoiceButton darkMode={isDarkMode}>Father</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>Parent</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>Family</ChoiceButton>
            <ChoiceButton darkMode={isDarkMode}>Man</ChoiceButton>
          </ChoiceGrid>
        );
    }
  };

  return (
    <>
      {/* Add the shared Navbar with the same dark mode state */}
      <div className={`${styles.studyNavContainer} ${styles.container} ${isDarkMode ? styles.dark : ''}`}>
        <Navbar forceDarkMode={isDarkMode} />
      </div>
      
      {/* Keep the original layout structure */}
      <LayoutRoot darkMode={isDarkMode}>
        {/* Keep the original sidebar but make it invisible */}
        <div style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}>
          <Sidebar
            expanded={isExpanded}
            darkMode={isDarkMode}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            <SidebarComponent 
              expanded={isExpanded} 
              onExpandedChange={setIsExpanded} 
              darkMode={isDarkMode}
            />
          </Sidebar>
        </div>
      <MainContent sidebarExpanded={isExpanded} darkMode={isDarkMode}>
        <TopBar>
          <Link href="/dashboard" passHref>
            <Button 
              startIcon={<ArrowBackIcon sx={{ color: '#7c4dff' }} />}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                color: '#7c4dff',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Link>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ModeButton 
              onClick={toggleDarkMode}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              {isDarkMode ? (
                <LightModeIcon sx={{ color: '#7c4dff' }} />
              ) : (
                <DarkModeIcon sx={{ color: '#7c4dff' }} />
              )}
            </ModeButton>
            <ModeButton 
              onClick={handleSettingsClick}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              <TuneIcon sx={{ color: '#7c4dff' }} />
            </ModeButton>
          </Box>
          <Menu
            anchorEl={settingsAnchor}
            open={Boolean(settingsAnchor)}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                border: isDarkMode ? '1px solid #333' : 'none',
                boxShadow: isDarkMode ? 'none' : undefined
              }
            }}
          >
            {Object.entries(StudyModeLabels).map(([mode, label]) => (
              <MenuItem 
                key={mode}
                onClick={() => handleStudyModeChange(mode as StudyMode)}
                sx={{
                  minWidth: '180px',
                  color: studyMode === mode ? '#7c4dff' : isDarkMode ? '#fff' : '#1f2937',
                  backgroundColor: studyMode === mode ? 
                    (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                    'transparent',
                  '&:hover': {
                    backgroundColor: studyMode === mode ? 
                      (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                      (isDarkMode ? '#383838' : '#f3f4f6')
                  }
                }}
              >
                {label}
              </MenuItem>
            ))}
            <Divider sx={{ my: 1, borderColor: isDarkMode ? '#333' : '#e5e7eb' }} />
          </Menu>
        </TopBar>

        <StatsBar>
          <StatItem 
            className="accuracy"
            sx={{ 
              color: isDarkMode ? '#aaa' : '#6F767E',
              '& .value': {
                color: isDarkMode ? '#fff' : '#1f2937'
              },
              '&.accuracy .value': {
                color: '#7c4dff'
              }
            }}
          >
            <span className="value">{accuracy}%</span>
            <span>accuracy</span>
          </StatItem>
          <StatItem 
            className="cards-remaining"
            sx={{ 
              color: isDarkMode ? '#aaa' : '#6F767E',
              '& .value': {
                color: isDarkMode ? '#fff' : '#1f2937'
              },
              '&.cards-remaining .value': {
                color: '#7c4dff'
              }
            }}
          >
            <span className="value">{remainingCards}</span>
            <span>cards remaining</span>
          </StatItem>
        </StatsBar>

        <ContentCard darkMode={isDarkMode}>
          {renderQuestion()}
          {renderChoices()}
        </ContentCard>
      </MainContent>
    </LayoutRoot>
    </>
  );
}
