import React from 'react';
import { Box } from '@mui/material';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <PublicFooter />
    </Box>
  );
}
