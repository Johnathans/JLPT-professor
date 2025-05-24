'use client';

import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Badge, Avatar, Tooltip, ToggleButtonGroup, ToggleButton, useMediaQuery, useTheme } from '@mui/material';
import { Book, BarChart2, User, Home, BookOpen, RefreshCw, Settings, Menu, Award } from 'react-feather';
import StreakModal from './StreakModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [jlptLevel, setJlptLevel] = useState('N5');
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleJlptChange = (event: React.MouseEvent<HTMLElement>, newLevel: string) => {
    if (newLevel !== null) {
      setJlptLevel(newLevel);
    }
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Study', href: '/study' },
    { icon: RefreshCw, label: 'Review', href: '/review' },
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
              <Menu />
            </IconButton>
          )}
          <ToggleButtonGroup
            value={jlptLevel}
            exclusive
            onChange={handleJlptChange}
            aria-label="JLPT level"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid #E8F9FD',
                color: '#666666',
                fontWeight: 500,
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
            {['N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
              <ToggleButton key={level} value={level} aria-label={`JLPT ${level}`}>
                {level}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
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
        <Box sx={{ mt: 3, px: 3, mb: 4 }}>
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
