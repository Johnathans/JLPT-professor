'use client';

import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Badge, Avatar, Tooltip, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme, Typography, Menu, MenuItem } from '@mui/material';
import { Book, BarChart2, User, Home, BookOpen, RefreshCw, Settings, Menu as MenuIcon, Award } from 'react-feather';
import StreakModal from './StreakModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
  onJlptLevelChange?: (level: string) => void;
  onModeChange?: (mode: string) => void;
  initialMode?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onJlptLevelChange, onModeChange, initialMode = 'study' }) => {
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [jlptLevel, setJlptLevel] = useState('N5');
  const [levelMenuAnchor, setLevelMenuAnchor] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState(initialMode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleJlptChange = (newLevel: string) => {
    setJlptLevel(newLevel);
    onJlptLevelChange?.(newLevel.toLowerCase());
    setLevelMenuAnchor(null);
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BarChart2, label: 'Progress', href: '/progress' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginLeft: { xs: 0, lg: `${DRAWER_WIDTH}px` },
          bgcolor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: '#E8F9FD',
          zIndex: 1100, // Below the drawer's zIndex
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, color: '#666666' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(event, newMode) => {
                if (newMode !== null) {
                  setMode(newMode);
                  onModeChange?.(newMode);
                }
              }}
              aria-label="study mode"
              sx={{
                height: '40px',
                '& .MuiToggleButton-root': {
                  border: '1px solid #E8F9FD',
                  color: '#666666',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  px: 2,
                  gap: 1,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: '#E8F9FD',
                    color: '#000000',
                    fontWeight: 700,
                    '&:hover': {
                      bgcolor: '#E8F9FD',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(232, 249, 253, 0.1)'
                  }
                }
              }}
            >
              <ToggleButton value="study" aria-label="study mode">
                <BookOpen size={18} />
                Study
              </ToggleButton>
              <ToggleButton value="review" aria-label="review mode">
                <RefreshCw size={18} />
                Review
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>


          <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Words Learned">
            <IconButton 
              size="large" 
              sx={{ 
                color: '#666666',
                '&:hover': { color: '#59CE8F' }
              }}
            >
              <Badge 
                badgeContent={42} 
                color="primary" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#59CE8F',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  } 
                }}
              >
                <Book size={22} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Current Streak">
            <IconButton 
              size="large" 
              onClick={() => setStreakModalOpen(true)}
              sx={{ 
                color: '#666666',
                '&:hover': { color: '#FF8C42' }
              }}
            >
              <Badge 
                badgeContent={7} 
                color="primary" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#FF8C42',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  } 
                }}
              >
                <Award size={22} />
              </Badge>
            </IconButton>
          </Tooltip>

          <StreakModal
            open={streakModalOpen}
            onClose={() => setStreakModalOpen(false)}
            currentStreak={7}
            longestStreak={14}
            timeRemaining="50m"
            activeDays={[0, 1, 2, 3, 4]}
          />

          <Tooltip title="Progress">
            <IconButton 
              size="large" 
              sx={{ 
                color: '#666666',
                '&:hover': { color: '#59CE8F' }
              }}
            >
              <BarChart2 size={22} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton 
              size="large" 
              sx={{ 
                ml: 1,
                bgcolor: '#E8F9FD',
                '&:hover': { bgcolor: '#59CE8F' }
              }}
            >
              <User style={{ color: '#000000' }} />
            </IconButton>
          </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: '#E8F9FD',
            top: 0,
            height: '100%',
          },
        }}
      >
        <Box sx={{ mt: 3, px: 3, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: '#000000',
            fontSize: '1.25rem',
            fontFamily: '"Inter", sans-serif'
          }}>
            <span style={{ fontWeight: 900 }}>JLPT</span>
            <span style={{ fontWeight: 500 }}>Professor</span>
          </Box>
        </Box>
        <Box sx={{ px: 3, mb: 3 }}>
          <Box 
            onClick={(e) => setLevelMenuAnchor(e.currentTarget)}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              py: 2,
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              border: '2px solid',
              borderColor: '#E8F9FD',
              transition: 'all 0.2s ease',
              '&:hover': { 
                borderColor: '#ccc',
                bgcolor: '#fafafa'
              }
            }}
          >
            <Typography 
              className="level-text"
              sx={{ 
                fontSize: '2.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#333',
                lineHeight: 1,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
              }}
            >
              {jlptLevel}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666666', 
                mt: 0.5,
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              Current Level
            </Typography>
          </Box>
          <Menu
            anchorEl={levelMenuAnchor}
            open={Boolean(levelMenuAnchor)}
            onClose={() => setLevelMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 120,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 1,
                border: '1px solid #E8F9FD'
              }
            }}
          >
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
              <MenuItem 
                key={level} 
                onClick={() => handleJlptChange(level)}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: '1rem',
                  fontWeight: jlptLevel === level ? 600 : 400,
                  color: jlptLevel === level ? '#000' : '#666666',
                  bgcolor: jlptLevel === level ? '#f8f9fa' : 'transparent',
                  '&:hover': { 
                    bgcolor: '#f8f9fa',
                    color: '#000'
                  }
                }}
              >
                {level}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    color: '#000000',
                    bgcolor: isActive ? '#E8F9FD' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={20} style={{ marginRight: '12px', color: '#000000' }} />
                  {item.label}
                </Box>
              </Link>
            );
          })}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: '64px', // AppBar height
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          ml: { xs: 0, lg: `${DRAWER_WIDTH}px` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
