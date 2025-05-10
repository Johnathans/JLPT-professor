'use client';

import Navbar from '@/components/Navbar';
import { Box } from '@mui/material';

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', transition: 'background-color 0.2s ease' }}>
      <Navbar />
      <Box sx={{ padding: { xs: 2, sm: 3 }, maxWidth: 'calc(1400px - 280px)', margin: '0 auto' }}>
        {children}
      </Box>
    </Box>
  );
}
