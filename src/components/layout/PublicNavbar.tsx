'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  AppBar, 
  Box, 
  Button, 
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack, 
  Typography 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';

const NavbarWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(124, 77, 255, 0.08)',
  position: 'fixed',
}));

const NavContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  }
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  textDecoration: 'none',
  color: 'inherit',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.125rem',
  }
}));

const NavLinks = styled(Stack)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  }
}));

const navItems = [
  { text: 'N5 Kanji', href: '/n5-kanji-list' },
  { text: 'N4 Kanji', href: '/n4-kanji-list' },
  { text: 'N3 Kanji', href: '/n3-kanji-list' },
  { text: 'N2 Kanji', href: '/n2-kanji-list' },
  { text: 'N1 Kanji', href: '/n1-kanji-list' },
  { text: 'N5 Vocabulary', href: '/n5-vocabulary' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <NavbarWrapper>
        <NavContent maxWidth="xl">
          <Link href="/" passHref style={{ textDecoration: 'none' }}>
            <Logo>
              <Image 
                src="/logo.png" 
                alt="JLPT Professor Logo" 
                width={36} 
                height={36}
              />
              <LogoText>JLPT Professor</LogoText>
            </Logo>
          </Link>

          <NavLinks direction="row" spacing={2}>
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  sx={{ 
                    color: pathname === item.href ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      color: 'primary.main',
                    }
                  }}
                >
                  {item.text}
                </Button>
              </Link>
            ))}
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
            </Link>
          </NavLinks>

          <MobileMenuButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </MobileMenuButton>
        </NavContent>
      </NavbarWrapper>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 240,
            backgroundColor: '#fff',
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link 
                href={item.href} 
                style={{ 
                  textDecoration: 'none',
                  width: '100%',
                }}
              >
                <ListItemButton
                  selected={pathname === item.href}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '& .MuiListItemText-primary': {
                        color: 'primary.main',
                        fontWeight: 600,
                      }
                    }
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <Link 
              href="/login"
              style={{ 
                textDecoration: 'none',
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
            </Link>
          </ListItem>
        </List>
      </Drawer>

      {/* Spacer to prevent content from going under fixed navbar */}
      <Box sx={{ height: { xs: 56, sm: 64 } }} />
    </>
  );
}
