'use client';

import { Box, Button, Typography, TextField, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { School } from '@mui/icons-material';
import { useState } from 'react';

// Custom Google icon with proper colors
const GoogleIcon = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const PageContainer = styled('div')({
  minHeight: 'calc(100vh - 160px)',
  display: 'flex',
  overflow: 'hidden'
});

const LeftSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const RightSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 440,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 40px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 24px'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  marginBottom: theme.spacing(2)
}));

const GoogleButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  color: '#334155',
  padding: '10px 16px',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1'
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(0.5)
  }
}));

const SignUpButton = styled(StyledButton)({
  backgroundColor: '#7c4dff',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#6c3fff'
  }
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    '& fieldset': {
      borderColor: '#e2e8f0'
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7c4dff'
    }
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#7c4dff'
    }
  },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 30px #f8fafc inset !important',
    WebkitTextFillColor: '#334155 !important',
    caretColor: '#334155'
  },
  '& .MuiInputBase-input': {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 30px #f8fafc inset !important'
    }
  },
  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    '&:not(.Mui-focused)': {
      color: '#94a3b8'
    }
  }
}));

const StyledDivider = styled(Divider)({
  width: '100%',
  margin: '24px 0',
  color: '#94a3b8',
  '&.MuiDivider-root': {
    '&::before, &::after': {
      borderColor: '#e2e8f0'
    }
  }
});

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <PageContainer>
      <LeftSection>
        <ContentBox>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <School sx={{ fontSize: 48, color: '#7c4dff' }} />
              <Typography variant="h3" sx={{ color: '#1e293b', fontWeight: 700 }}>
                JLPT Professor
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#475569', fontWeight: 600, mb: 3 }}>
              Start Your JLPT Journey Today
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 360 }}>
              Join our community of students preparing for JLPT success
            </Typography>
          </Box>
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            {[
              'Personalized study plans',
              'Smart flashcard system',
              'Progress tracking'
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <School sx={{ color: '#7c4dff', fontSize: 20 }} />
                <Typography sx={{ color: '#475569', fontWeight: 500 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </ContentBox>
      </LeftSection>
      <RightSection>
        <ContentBox>
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Create your account
            </Typography>
            <GoogleButton
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </GoogleButton>
            <StyledDivider>or</StyledDivider>
            <form onSubmit={handleEmailSignUp} style={{ width: '100%' }}>
              <StyledTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <StyledTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <StyledTextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <SignUpButton type="submit" variant="contained">
                Sign up with Email
              </SignUpButton>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                Already have an account?{' '}
                <Button
                  sx={{
                    textTransform: 'none',
                    color: '#7c4dff',
                    fontWeight: 500,
                    p: 0,
                    ml: 0.5,
                    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                  }}
                  onClick={() => router.push('/login')}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>
        </ContentBox>
      </RightSection>
    </PageContainer>
  );
}
