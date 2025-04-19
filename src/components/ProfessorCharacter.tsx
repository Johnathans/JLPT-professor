'use client';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const ProfessorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: '#e8e3ff',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const ProfessorCircle = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  position: 'relative',
  borderRadius: '50%',
  backgroundColor: '#7c4dff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: -16,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '16px solid #fff',
  }
}));

const Message = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(2, 3),
  borderRadius: theme.spacing(1.5),
  maxWidth: '500px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

interface ProfessorCharacterProps {
  message: string;
  submessage?: string;
}

export default function ProfessorCharacter({ message, submessage }: ProfessorCharacterProps) {
  return (
    <ProfessorContainer>
      <ProfessorCircle>
        <Box sx={{ 
          width: 100, 
          height: 100, 
          position: 'relative',
          filter: 'brightness(0) invert(1)', // Makes the SVG white
        }}>
          <Image
            src="/assets/professor.svg"
            alt="JLPT Professor"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
      </ProfessorCircle>
      <MessageContainer>
        <Message>
          <Typography variant="h6" sx={{ mb: submessage ? 1 : 0, fontWeight: 500 }}>
            {message}
          </Typography>
          {submessage && (
            <Typography variant="body2" color="text.secondary">
              {submessage}
            </Typography>
          )}
        </Message>
      </MessageContainer>
    </ProfessorContainer>
  );
}
