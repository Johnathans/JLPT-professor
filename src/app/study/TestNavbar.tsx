import { Box, Button, IconButton, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NavbarRoot = styled(Box)({
  height: '56px',
  backgroundColor: '#fff',
  color: '#1f2937',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
});

const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
});

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
});

const NavButton = styled(Button)({
  color: '#6F767E',
  textTransform: 'none',
  fontSize: '0.875rem',
  padding: '6px 12px',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  }
});

const LevelBadge = styled(Box)({
  backgroundColor: '#7c4dff',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.875rem',
  fontWeight: 500
});

export default function TestNavbar() {
  const router = useRouter();

  return (
    <NavbarRoot>
      <LeftSection>
        <IconButton 
          sx={{ color: '#6F767E' }}
          onClick={() => router.push('/dashboard')}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ width: 32, height: 32, position: 'relative', mr: 2 }}>
          <Image
            src="/logo.png"
            alt="JLPT Professor"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>
        <NavButton>Fast Track Level 1</NavButton>
      </LeftSection>

      <RightSection>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: '0.875rem', color: '#6F767E' }}>Level:</Box>
          <LevelBadge>N5</LevelBadge>
        </Box>
        <Box sx={{ 
          width: '1px', 
          height: '24px', 
          backgroundColor: 'rgba(0,0,0,0.1)',
          margin: '0 8px' 
        }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="img" 
            src="/jp.svg" 
            alt="Japanese"
            sx={{ width: 20, height: 20, borderRadius: '50%' }}
          />
          <Box component="img" 
            src="/en.svg" 
            alt="English"
            sx={{ width: 20, height: 20, borderRadius: '50%' }}
          />
        </Box>
      </RightSection>
    </NavbarRoot>
  );
}
