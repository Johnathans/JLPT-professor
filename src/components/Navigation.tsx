'use client';

import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Box, BottomNavigation, BottomNavigationAction, Paper, Select, MenuItem } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from '@/components/Logo';
import { useRouter, usePathname } from 'next/navigation';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import {
  Menu as MenuIcon,
  Home,
  School,
  MenuBook,
  Assessment,
  Person,
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff !important',
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}));

const drawerWidth = 280;

const LogoContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& .MuiTypography-root': {
    fontFamily: 'var(--font-poppins)',
  }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5, 1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  minHeight: 44,
  '& .MuiListItemIcon-root': {
    minWidth: 36,
    color: theme.palette.text.secondary,
  },
  '& .MuiListItemText-primary': {
    fontSize: '0.875rem',
    fontWeight: 700,
    fontFamily: 'var(--font-poppins)',
    color: '#1a1a1a',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: '#5e35b1',
    },
    '& .MuiListItemText-primary': {
      color: '#5e35b1',
      fontWeight: 700,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: '#5e35b1',
    },
  }
}));

const CategoryLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  padding: theme.spacing(2, 3, 1),
  fontFamily: 'var(--font-poppins)',
}));

const LevelIndicator = styled('div')(({ theme }) => ({
  margin: theme.spacing(0, 2, 2),
  padding: theme.spacing(1, 1.5),
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: theme.shape.borderRadius,
  '& .MuiSelect-select': {
    padding: theme.spacing(0.5, 1),
    fontFamily: 'var(--font-poppins)',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.primary.main,
    '&:focus': {
      backgroundColor: 'transparent'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();
  const { level, setLevel } = useJlptLevel();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResourcesClick = () => {
    setResourcesOpen(!resourcesOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/dashboard' },
    { 
      text: 'Kanji', 
      icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/kanji' ? '#5e35b1' : '#e8e3ff' }} />, 
      path: '/learn/kanji' 
    },
    { 
      text: 'Vocabulary', 
      icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/vocabulary' ? '#5e35b1' : '#e8e3ff' }} />, 
      path: '/learn/vocabulary' 
    },
    { 
      text: 'Reading', 
      icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/reading' ? '#5e35b1' : '#e8e3ff' }} />, 
      path: '/learn/reading' 
    },
    { 
      text: 'Listening', 
      icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/listening' ? '#5e35b1' : '#e8e3ff' }} />, 
      path: '/learn/listening' 
    },
    { text: 'Hiragana', icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/hiragana-match/play' ? '#5e35b1' : '#e8e3ff' }} />, path: '/learn/hiragana-match/play' },
    { text: 'Katakana', icon: <CircleIcon sx={{ fontSize: 10, color: pathname === '/learn/katakana-match/play' ? '#5e35b1' : '#e8e3ff' }} />, path: '/learn/katakana-match/play' },
    { text: 'Resources', icon: <MenuBook />, path: '/resources', hasSubmenu: true },
    { text: 'Tests', icon: <Assessment />, path: '/tests' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const resourceSubItems = [
    { text: 'Hiragana Match', path: '/resources/hiragana-match' },
    { text: 'Kanji Dictionary', path: '/resources/kanji-dictionary' },
    { text: 'Grammar Points', path: '/resources/grammar' },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <LogoContainer>
        <Logo size={32} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          JLPT Professor
        </Typography>
      </LogoContainer>
      
      <LevelIndicator>
        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value as 'N1' | 'N2' | 'N3' | 'N4' | 'N5')}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="N5">Studying N5</MenuItem>
          <MenuItem value="N4">Studying N4</MenuItem>
          <MenuItem value="N3">Studying N3</MenuItem>
          <MenuItem value="N2">Studying N2</MenuItem>
          <MenuItem value="N1">Studying N1</MenuItem>
        </Select>
      </LevelIndicator>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <CategoryLabel>Main Menu</CategoryLabel>
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              <StyledListItem
                button
                selected={pathname === item.path}
                onClick={() => {
                  if (item.hasSubmenu) {
                    handleResourcesClick();
                  } else {
                    router.push(item.path);
                    if (isMobile) handleDrawerToggle();
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.hasSubmenu && (resourcesOpen ? <ExpandLess /> : <ExpandMore />)}
              </StyledListItem>
              {item.hasSubmenu && (
                <Collapse in={resourcesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {resourceSubItems.map((subItem) => (
                      <StyledListItem
                        button
                        key={subItem.text}
                        selected={pathname === subItem.path}
                        sx={{ pl: 4 }}
                        onClick={() => {
                          router.push(subItem.path);
                          if (isMobile) handleDrawerToggle();
                        }}
                      >
                        <ListItemText primary={subItem.text} />
                      </StyledListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Logo size={28} />
        </Toolbar>
      </StyledAppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: theme.zIndex.drawer
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              bgcolor: 'background.paper'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              bgcolor: 'background.paper'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
          <BottomNavigation showLabels>
            {menuItems.map((item) => (
              <BottomNavigationAction 
                key={item.text}
                label={item.text}
                icon={item.icon}
                onClick={() => {
                  if (!item.hasSubmenu) {
                    router.push(item.path);
                  }
                }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
}
