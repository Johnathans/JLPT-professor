'use client';

import { Box, Typography, Avatar, IconButton, Tabs, Tab, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import React, { useState } from 'react';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import School from '@mui/icons-material/School';
import Quiz from '@mui/icons-material/Quiz';
import Settings from '@mui/icons-material/Settings';
import Assignment from '@mui/icons-material/Assignment';
import Insights from '@mui/icons-material/Insights';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Help from '@mui/icons-material/Help';
import Star from '@mui/icons-material/Star';
import Lock from '@mui/icons-material/Lock';
import Notifications from '@mui/icons-material/Notifications';

// Styled Components
const AppContainer = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc'
});

const Sidebar = styled('div')(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: 72,
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 12px',
  gap: '8px',
  '& .nav-text': {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out'
  },
  '& .user-name': {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out'
  },
  '.MuiSvgIcon-root': {
    transition: 'margin 0.3s ease-in-out'
  },
  '&:hover': {
    width: 240,
    '& .nav-text, & .user-name': {
      opacity: 1,
      transform: 'translateX(0)'
    },
    '& + .main-content': {
      marginLeft: 240
    }
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const UserSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px',
  marginBottom: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)'
  }
});

const NavItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: '#6F767E',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)',
    color: '#7c4dff'
  },
  '.MuiSvgIcon-root': {
    width: 24,
    height: 24,
    flexShrink: 0
  },
  '.nav-text': {
    fontSize: '0.9375rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out',
    color: 'inherit'
  },
  '&.active': {
    color: '#7c4dff',
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    fontWeight: 600
  }
}));

const ProgressSection = styled(Box)({
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  marginBottom: 24
});

const StudyCard = styled(Box)({
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  border: '1px solid rgba(0,0,0,0.08)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  }
});

const FlipCard = styled('div')({
  width: '100%',
  height: '100%',
  perspective: '1000px',
  cursor: 'pointer',
  '.flip-card-inner': {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '&.flipped': {
      transform: 'rotateY(180deg)'
    }
  },
  '.flip-card-front, .flip-card-back': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12
  },
  '.flip-card-back': {
    transform: 'rotateY(180deg)',
    backgroundColor: '#7c4dff',
    color: 'white'
  }
});

const BottomNav = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'white',
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    padding: '0 16px'
  }
}));

const navItems = [
  { icon: <Home />, label: 'Dashboard', path: '/', active: true },
  { icon: <MenuBook />, label: 'Study Guide', path: '/study-guide' },
  { icon: <School />, label: 'Practice Tests', path: '/practice-test' },
  { icon: <Quiz />, label: 'JLPT Test', path: '/jlpt-test' },
  { icon: <Settings />, label: 'Settings', path: '/settings' },
  { icon: <Assignment />, label: 'Study Plan', path: '/study-plan' },
  { icon: <Insights />, label: 'Progress', path: '/progress' },
  { icon: <AccountCircle />, label: 'Profile', path: '/profile' },
  { icon: <Help />, label: 'Help', path: '/help' }
];

const todaysKanji = [
  { kanji: '力', meaning: 'Power', reading: 'ちから (chikara)' },
  { kanji: '山', meaning: 'Mountain', reading: 'やま (yama)' },
  { kanji: '川', meaning: 'River', reading: 'かわ (kawa)' },
  { kanji: '木', meaning: 'Tree', reading: 'き (ki)' }
];

const todaysVocab = [
  { word: '勉強', meaning: 'Study', reading: 'べんきょう (benkyou)' },
  { word: '学校', meaning: 'School', reading: 'がっこう (gakkou)' },
  { word: '先生', meaning: 'Teacher', reading: 'せんせい (sensei)' },
  { word: '学生', meaning: 'Student', reading: 'がくせい (gakusei)' }
];

const todaysGrammar = [
  { pattern: 'ています', meaning: 'Present continuous' },
  { pattern: 'ました', meaning: 'Past tense' },
  { pattern: 'たい', meaning: 'Want to do' },
  { pattern: 'ない', meaning: 'Negative' }
];

export default function Dashboard() {
  const router = useRouter();
  const { level } = useJlptLevel();
  const [activeTab, setActiveTab] = useState('kanji');
  const pathname = '/';
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <AppContainer>
      <Sidebar 
        className="sidebar"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <UserSection>
          <Avatar 
            sx={{ 
              width: 36,
              height: 36,
              bgcolor: '#7c4dff',
              fontSize: '1rem',
              fontWeight: 600,
              flexShrink: 0
            }}
          >
            J
          </Avatar>
          <Typography className="user-name" variant="body1" sx={{ fontWeight: 600 }}>
            John
          </Typography>
        </UserSection>
        
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            className={item.path === pathname ? 'active' : ''}
            onClick={() => router.push(item.path || '/')}
          >
            {item.icon}
            <Typography className="nav-text">
              {item.label}
            </Typography>
          </NavItem>
        ))}
      </Sidebar>

      <Box 
        className={`main-content ${isExpanded ? 'sidebar-expanded' : ''}`}
        sx={{
          flexGrow: 1,
          width: '100%',
          backgroundColor: '#f8fafc',
          overflow: 'auto',
          padding: '24px',
          marginLeft: '36px',
          transition: 'margin-left 0.3s ease-in-out',
          '&.sidebar-expanded': {
            marginLeft: '180px'
          },
          '@media (max-width: 600px)': {
            padding: '16px',
            paddingBottom: '64px',
            marginLeft: 0
          }
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 },
          pb: { xs: 8, sm: 3 },
          position: 'relative'
        }}>
          <IconButton
            sx={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              backgroundColor: '#e8e3ff',
              '&:hover': {
                backgroundColor: '#e8e3ff'
              }
            }}
          >
            <Notifications sx={{ color: '#7c4dff' }} />
          </IconButton>
          {/* Welcome Message */}
          <Box sx={{ mb: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '2.65rem' },
                color: '#1A1D1E',
              }}>
                Welcome back,
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 400,
                fontSize: { xs: '2rem', sm: '2.65rem' },
                color: '#1A1D1E',
              }}>
                John
              </Typography>
            </Box>
            <Typography sx={{ 
              color: '#6F767E',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mt: 1
            }}>
              Ready to continue your JLPT N{level} journey?
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, sm: 3 },
            width: '100%',
            '& > *': {
              flex: '1 1 0',
              minWidth: 0
            }
          }}>
            <Box sx={{
              width: { xs: '100%', md: '50%' },
              height: { md: '100%' }
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: '#1A1D1E',
                fontSize: { xs: '1.25rem', md: '1.35rem' }
              }}>
                Progress Overview
              </Typography>
              <ProgressSection sx={{ height: { md: 'calc(100% - 42px)' } }}>
                <Typography sx={{ mb: 2, color: '#6F767E' }}>
                  JLPT N{level} Progress
                </Typography>
                <Box sx={{ 
                  height: 24, 
                  background: '#F5F5F5',
                  borderRadius: 2,
                  mb: 2,
                  overflow: 'hidden',
                  display: 'flex'
                }}>
                  <Box sx={{ 
                    width: '40%',
                    height: '100%',
                    background: '#7c4dff',
                    borderRadius: '8px 0 0 8px'
                  }} />
                  <Box sx={{ 
                    width: '25%',
                    height: '100%',
                    background: '#7c4dff',
                    opacity: 0.8,
                    borderLeft: '2px solid #F5F5F5'
                  }} />
                  <Box sx={{ 
                    width: '25%',
                    height: '100%',
                    background: '#7c4dff',
                    opacity: 0.6,
                    borderLeft: '2px solid #F5F5F5'
                  }} />
                  <Box sx={{ 
                    width: '10%',
                    height: '100%',
                    background: '#7c4dff',
                    opacity: 0.4,
                    borderLeft: '2px solid #F5F5F5',
                    borderRadius: '0 8px 8px 0'
                  }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1D1E' }}>
                    Overall Progress
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#6F767E' }}>
                    1,250/3,000 items
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c4dff', opacity: 0.8 }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1D1E' }}>
                        Vocabulary (40%)
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6F767E' }}>
                      800/2,000 words
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c4dff', opacity: 0.6 }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1D1E' }}>
                        Kanji (25%)
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6F767E' }}>
                      250/500 characters
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c4dff', opacity: 0.4 }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1D1E' }}>
                        Grammar (25%)
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6F767E' }}>
                      100/300 points
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7c4dff', opacity: 0.2 }} />
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1D1E' }}>
                        Listening (10%)
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6F767E' }}>
                      100/200 exercises
                    </Typography>
                  </Box>
                </Box>
              </ProgressSection>
            </Box>

            <Box sx={{
              flex: 1,
              width: { xs: '100%', md: '50%' },
              height: { md: '100%' }
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2,
                fontWeight: 700,
                color: '#1A1D1E',
                fontSize: { xs: '1.25rem', md: '1.35rem' }
              }}>
                Today's Study Goals
              </Typography>
              <ProgressSection sx={{ height: { md: 'calc(100% - 42px)' } }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)} 
                    aria-label="study goals"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                  >
                    <Tab label="Kanji" value="kanji" />
                    <Tab label="Vocabulary" value="vocabulary" />
                    <Tab label="Grammar" value="grammar" />
                    <Tab label="Reading" value="reading" />
                    <Tab label="Listening" value="listening" />
                  </Tabs>
                </Box>
                
                <Grid container spacing={2} sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  {activeTab === 'kanji' && todaysKanji.map((item, index) => (
                    <Grid item xs={6} sm={3} key={index} sx={{ height: '120px' }}>
                      <FlipCard>
                        <Box className="flip-card-inner">
                          <Box className="flip-card-front">
                            <Typography sx={{ 
                              fontSize: { xs: '1.5rem', sm: '1.75rem' },
                              fontWeight: 900,
                              color: '#000000',
                              textAlign: 'center',
                              mb: 1
                            }}>
                              {item.kanji}
                            </Typography>
                          </Box>
                          <Box className="flip-card-back">
                            <Typography sx={{ 
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: '#7c4dff',
                              mb: 1
                            }}>
                              {item.meaning}
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '0.875rem',
                              color: '#6F767E'
                            }}>
                              {item.reading}
                            </Typography>
                          </Box>
                        </Box>
                      </FlipCard>
                    </Grid>
                  ))}
                  
                  {activeTab === 'vocabulary' && todaysVocab.map((item, index) => (
                    <Grid item xs={6} sm={3} key={index} sx={{ height: '120px' }}>
                      <FlipCard>
                        <Box className="flip-card-inner">
                          <Box className="flip-card-front">
                            <Typography sx={{ 
                              fontSize: '1.25rem',
                              fontWeight: 900,
                              color: '#000000',
                              textAlign: 'center',
                              mb: 1
                            }}>
                              {item.word}
                            </Typography>
                          </Box>
                          <Box className="flip-card-back">
                            <Typography sx={{ 
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: '#7c4dff',
                              mb: 1
                            }}>
                              {item.meaning}
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '0.875rem',
                              color: '#6F767E'
                            }}>
                              {item.reading}
                            </Typography>
                          </Box>
                        </Box>
                      </FlipCard>
                    </Grid>
                  ))}

                  {activeTab === 'grammar' && todaysGrammar.map((item, index) => (
                    <Grid item xs={6} sm={3} key={index} sx={{ height: '120px' }}>
                      <FlipCard>
                        <Box className="flip-card-inner">
                          <Box className="flip-card-front">
                            <Typography sx={{ 
                              fontSize: '1rem',
                              fontWeight: 900,
                              color: '#000000',
                              textAlign: 'center',
                              mb: 1
                            }}>
                              {item.pattern}
                            </Typography>
                          </Box>
                          <Box className="flip-card-back">
                            <Typography sx={{ 
                              fontSize: '1rem',
                              fontWeight: 500,
                              color: '#7c4dff',
                              mb: 1
                            }}>
                              {item.meaning}
                            </Typography>
                          </Box>
                        </Box>
                      </FlipCard>
                    </Grid>
                  ))}
                </Grid>
              </ProgressSection>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Study Materials</Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              }, 
              gap: 3,
              width: '100%'
            }}>
              <StudyCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    fontSize: '1.5rem',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(124, 77, 255, 0.08)',
                    borderRadius: 8
                  }}>
                    力
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Kanji Study
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem',
                      color: '#6F767E'
                    }}>
                      Master {level} kanji characters
                    </Typography>
                  </Box>
                </Box>
              </StudyCard>

              <StudyCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    fontSize: '1.5rem',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(124, 77, 255, 0.08)',
                    borderRadius: 8
                  }}>
                    語
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Vocabulary
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem',
                      color: '#6F767E'
                    }}>
                      Essential {level} vocabulary
                    </Typography>
                  </Box>
                </Box>
              </StudyCard>

              <StudyCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    fontSize: '1.5rem',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(124, 77, 255, 0.08)',
                    borderRadius: 8
                  }}>
                    文
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Grammar
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem',
                      color: '#6F767E'
                    }}>
                      {level} grammar patterns
                    </Typography>
                  </Box>
                </Box>
              </StudyCard>

              <StudyCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ 
                    fontSize: '1.5rem',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(124, 77, 255, 0.08)',
                    borderRadius: 8
                  }}>
                    聴
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                      Listening
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.875rem',
                      color: '#6F767E'
                    }}>
                      {level} listening practice
                    </Typography>
                  </Box>
                </Box>
              </StudyCard>
            </Box>
          </Box>

          <BottomNav>
            {navItems.slice(0, 5).map((item, index) => (
              <IconButton
                key={index}
                size="small"
                onClick={() => router.push(item.path || '/')}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: '#7c4dff',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            ))}
          </BottomNav>
        </Box>
      </Box>
    </AppContainer>
  );
}
