'use client';

import { Box, styled } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/theme';

const LayoutRoot = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
});

const MainContent = styled(Box)({
  flexGrow: 1,
  width: '100%',
  backgroundColor: '#f8fafc',
  overflow: 'auto',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <LayoutRoot>
        <MainContent>
          {children}
        </MainContent>
      </LayoutRoot>
    </ThemeProvider>
  );
}
