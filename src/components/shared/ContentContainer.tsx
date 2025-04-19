import React from 'react';
import Container from '@mui/material/Container';

export default function ContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {children}
    </Container>
  );
}
