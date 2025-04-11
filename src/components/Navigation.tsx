'use client';

import { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from '@/components/Logo';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu as MenuIcon,
  Home,
  School,
  MenuBook,
  Assessment,
  Person,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon
} from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}));

const DrawerWidth = 240;

const LogoContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5)
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
    fontWeight: 500,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
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
}));

const SearchBox = styled('div')(({ theme }) => ({
  margin: theme.spacing(0, 2, 2),
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
  }
}));

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResourcesClick = () => {
    setResourcesOpen(!resourcesOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/dashboard' },
    { text: 'Study', icon: <School />, path: '/study' },
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
      
      <SearchBox>
        <SearchIcon />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Search...
        </Typography>
      </SearchBox>

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
          width: { sm: DrawerWidth },
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
              width: DrawerWidth,
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
              width: DrawerWidth,
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
