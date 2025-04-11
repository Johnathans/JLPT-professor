'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import { useTheme, useMediaQuery } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const DrawerWidth = 240;

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      bgcolor: 'grey.50'
    }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          ml: { sm: `${DrawerWidth}px` },
          height: '100vh',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          maxWidth: { sm: `calc(1200px - ${DrawerWidth}px)` },
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 }
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
