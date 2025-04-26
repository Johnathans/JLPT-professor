import React from 'react';
import Container from '@mui/material/Container';

interface ContentContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ContentContainer({ children, maxWidth = 'md' }: ContentContainerProps) {
  return (
    <Container maxWidth={maxWidth} sx={{ py: 4 }}>
      {children}
    </Container>
  );
}
