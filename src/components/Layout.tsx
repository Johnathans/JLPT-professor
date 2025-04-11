import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navigation from './Navigation';
import { styled } from '@mui/material/styles';

const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingBottom: '56px', // Height of bottom navigation
  backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Layout({ children, maxWidth = 'lg' }: LayoutProps) {
  return (
    <PageWrapper>
      <ContentContainer maxWidth={maxWidth}>
        {children}
      </ContentContainer>
      <Navigation />
    </PageWrapper>
  );
}
