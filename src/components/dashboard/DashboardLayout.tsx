'use client';

import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Avatar, ToggleButtonGroup, ToggleButton, Typography, Menu, MenuItem, IconButton, Badge, Tooltip } from '@mui/material';
import { User, Settings, LogOut, CreditCard, BookOpen, RefreshCw, Book, BarChart2 } from 'react-feather';
import { LocalFireDepartment } from '@mui/icons-material';
import StreakModal from './StreakModal';
import ProgressModal from './ProgressModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onModeChange?: (mode: string) => void;
  initialMode?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onModeChange, initialMode = 'study' }) => {
  const [mode, setMode] = useState(initialMode);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [streakModalOpen, setStreakModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: '#E8F9FD',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1, px: 2 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 900,
              fontSize: '1.25rem',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Box component="span">JLPT</Box>
            <Box component="span" sx={{ fontWeight: 400 }}>Professor</Box>
          </Typography>
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
                  color: '#000000',
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
                <BookOpen size={18} style={{ color: '#000000' }} />
                Study
              </ToggleButton>
              <ToggleButton value="review" aria-label="review mode">
                <RefreshCw size={18} style={{ color: '#000000' }} />
                Review
              </ToggleButton>
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
                  sx={{ color: '#000000' }}
                >
                  <Badge 
                    badgeContent={5} 
                    color="primary" 
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        bgcolor: '#59CE8F',
                        color: '#FFFFFF',
                      } 
                    }}
                  >
                    <LocalFireDepartment 
                      sx={{ 
                        fontSize: 28,
                        color: '#000000'
                      }} 
                    />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Progress">
                <IconButton 
                  onClick={() => setProgressModalOpen(true)}
                  size="large" 
                  sx={{ 
                    color: '#666666',
                    '&:hover': { color: '#7c4dff' }
                  }}
                >
                  <BarChart2 size={22} />
                </IconButton>
              </Tooltip>
            </Box>

            <Avatar
              onClick={(e: React.MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget)}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#E8F9FD',
                color: '#000000',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#d8f3fa'
                }
              }}
            >
              U
            </Avatar>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  border: '1px solid #E8F9FD'
                }
              }}
            >
              <MenuItem 
                onClick={() => setProfileAnchor(null)}
                sx={{ py: 1.5, px: 2, gap: 2 }}
              >
                <User size={18} />
                <Typography sx={{ fontWeight: 500 }}>My Profile</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => setProfileAnchor(null)}
                sx={{ py: 1.5, px: 2, gap: 2 }}
              >
                <Settings size={18} />
                <Typography sx={{ fontWeight: 500 }}>Settings</Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => setProfileAnchor(null)}
                sx={{ py: 1.5, px: 2, gap: 2 }}
              >
                <CreditCard size={18} />
                <Typography sx={{ fontWeight: 500 }}>Subscription</Typography>
              </MenuItem>
              <Box sx={{ borderTop: '1px solid #E8F9FD', mt: 1 }}>
                <MenuItem 
                  onClick={() => setProfileAnchor(null)}
                  sx={{ py: 1.5, px: 2, gap: 2, color: '#d32f2f' }}
                >
                  <LogOut size={18} />
                  <Typography sx={{ fontWeight: 500 }}>Log Out</Typography>
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

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
          ml: 0
        }}
      >
        {children}
      </Box>

      <StreakModal
        open={streakModalOpen}
        onClose={() => setStreakModalOpen(false)}
        currentStreak={7}
        longestStreak={14}
        timeRemaining="50m"
        activeDays={[0, 1, 2, 3, 4]}
      />

      <ProgressModal
        open={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        level="N5"
        progress={45}
      />
    </Box>
  );
};

export default DashboardLayout;
