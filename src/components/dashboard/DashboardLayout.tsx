'use client';

import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, IconButton, Badge, Avatar, Tooltip } from '@mui/material';
import { Book, Activity, BarChart2, User, Home, BookOpen, RefreshCw, Settings } from 'react-feather';
import StreakModal from './StreakModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DRAWER_WIDTH = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const pathname = usePathname();

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
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          marginLeft: `${DRAWER_WIDTH}px`,
          bgcolor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: '#E8F9FD',
          zIndex: 1100, // Below the drawer's zIndex
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
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
                '&:hover': { color: '#59CE8F' }
              }}
            >
              <Badge 
                badgeContent={7} 
                color="primary" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#59CE8F',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  } 
                }}
              >
                <Activity size={22} />
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
              <User style={{ color: '#59CE8F' }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
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
                    color: isActive ? '#59CE8F' : '#000000',
                    bgcolor: isActive ? '#E8F9FD' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={20} style={{ marginRight: '12px' }} />
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
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          height: '100vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
