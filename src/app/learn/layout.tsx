'use client';

import { styled } from '@mui/material';

const LayoutRoot = styled('div')({});

const MainContent = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
  padding: theme.spacing(4, 3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
  }
}));

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutRoot>
      <MainContent>
        {children}
      </MainContent>
    </LayoutRoot>
  );
}
