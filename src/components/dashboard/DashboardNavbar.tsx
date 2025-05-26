import { useState } from 'react';
import Link from 'next/link';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { AppBar, Toolbar, Box, IconButton, Avatar, LinearProgress, Menu, MenuItem, Typography, ListItemIcon, ListItemText, Divider } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function DashboardNavbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [levelAnchorEl, setLevelAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const { level, setLevel } = useJlptLevel();

  const handleLevelClick = (event: React.MouseEvent<HTMLElement>) => {
    setLevelAnchorEl(event.currentTarget);
  };

  const handleLevelClose = () => {
    setLevelAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }} elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Typography sx={{ 
              fontFamily: 'Poppins', 
              fontWeight: 900, 
              fontSize: { xs: '1.25rem', md: '1.5rem' }, 
              color: '#333',
              letterSpacing: '-0.01em'
            }}>
              JLPT <span style={{ fontWeight: 500, marginLeft: '0.5rem' }}>Professor</span>
            </Typography>
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/learn" style={{ textDecoration: 'none' }}>
              <Typography sx={{ 
                fontFamily: 'Poppins', 
                fontWeight: 600, 
                fontSize: '0.875rem',
                color: '#333',
                '&:hover': { color: '#7c4dff' }
              }}>
                Study
              </Typography>
            </Link>
            <Link href="/review" style={{ textDecoration: 'none' }}>
              <Typography sx={{ 
                fontFamily: 'Poppins', 
                fontWeight: 600, 
                fontSize: '0.875rem',
                color: '#333',
                '&:hover': { color: '#7c4dff' }
              }}>
                Review
              </Typography>
            </Link>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }} 
          onClick={handleLevelClick}
          >
            <Typography sx={{ 
              fontFamily: 'Poppins', 
              fontWeight: 600, 
              fontSize: '0.875rem',
              color: '#333'
            }}>
              Studying {level}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#333', fontSize: '1.25rem' }} />
          </Box>

          <Menu
            anchorEl={levelAnchorEl}
            open={Boolean(levelAnchorEl)}
            onClose={handleLevelClose}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 1
              }
            }}
          >
            <MenuItem 
              onClick={() => { setLevel('N5'); handleLevelClose(); }} 
              sx={{ fontFamily: 'Poppins', bgcolor: level === 'N5' ? '#f8f9fa' : 'white' }}
            >
              N5
            </MenuItem>
            <MenuItem 
              onClick={() => { setLevel('N4'); handleLevelClose(); }} 
              sx={{ fontFamily: 'Poppins', bgcolor: level === 'N4' ? '#f8f9fa' : 'white' }}
            >
              N4
            </MenuItem>
            <MenuItem 
              onClick={() => { setLevel('N3'); handleLevelClose(); }} 
              sx={{ fontFamily: 'Poppins', bgcolor: level === 'N3' ? '#f8f9fa' : 'white' }}
            >
              N3
            </MenuItem>
            <MenuItem 
              onClick={() => { setLevel('N2'); handleLevelClose(); }} 
              sx={{ fontFamily: 'Poppins', bgcolor: level === 'N2' ? '#f8f9fa' : 'white' }}
            >
              N2
            </MenuItem>
            <MenuItem 
              onClick={() => { setLevel('N1'); handleLevelClose(); }} 
              sx={{ fontFamily: 'Poppins', bgcolor: level === 'N1' ? '#f8f9fa' : 'white' }}
            >
              N1
            </MenuItem>
          </Menu>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 240 }}>
            <Typography sx={{ 
              fontFamily: 'Poppins', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              color: '#666'
            }}>
              60% Complete
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={60} 
              sx={{
                flexGrow: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00c853',
                  borderRadius: 3
                }
              }}
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              bgcolor: '#fff3e0',
              color: '#ff9800',
              py: 0.75,
              px: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#ffe0b2' },
              cursor: 'pointer'
            }}
          >
            <LocalFireDepartmentIcon sx={{ fontSize: '1.25rem' }} />
            <Typography sx={{ 
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#f57c00'
            }}>
              3
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              bgcolor: '#f5f5f5',
              color: '#333',
              py: 0.75,
              px: 1.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#eeeeee' },
              cursor: 'pointer'
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: '1.25rem' }} />
            <Typography sx={{ 
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#333'
            }}>
              1,240
            </Typography>
          </Box>

          <IconButton 
            onClick={handleProfileClick}
            sx={{ padding: 0.5 }}
          >
            <Avatar sx={{ 
              width: 32, 
              height: 32,
              bgcolor: '#7c4dff',
              fontFamily: 'Poppins',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              JP
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 1
              }
            }}
          >
            <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <PersonOutlineIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="My Profile" 
                primaryTypographyProps={{ 
                  sx: { fontFamily: 'Poppins', fontWeight: 500 } 
                }} 
              />
            </MenuItem>
            <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ 
                  sx: { fontFamily: 'Poppins', fontWeight: 500 } 
                }} 
              />
            </MenuItem>
            <MenuItem onClick={handleProfileClose} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon>
                <CreditCardOutlinedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Subscription" 
                primaryTypographyProps={{ 
                  sx: { fontFamily: 'Poppins', fontWeight: 500 } 
                }} 
              />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={handleProfileClose} 
              sx={{ 
                py: 1.5, 
                px: 2,
                color: '#d32f2f',
                '& .MuiListItemIcon-root': {
                  color: '#d32f2f'
                }
              }}
            >
              <ListItemIcon>
                <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Log Out" 
                primaryTypographyProps={{ 
                  sx: { fontFamily: 'Poppins', fontWeight: 500 } 
                }} 
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
