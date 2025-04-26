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

const LoginButton = styled(StyledButton)({
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
  // Better autofill handling
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 30px #f8fafc inset !important',
    WebkitTextFillColor: '#334155 !important',
    caretColor: '#334155'
  },
  '& .MuiInputBase-input': {
    '&:-webkit-autofill': {
      boxShadow: '0 0 0 30px #f8fafc inset !important'
    }
  },
  // Hide label when field has value
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

export default function Login() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setMessage('Check your email for the password reset link');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsResetting(false);
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
              Welcome Back!
            </Typography>
            <Typography sx={{ color: '#64748b', maxWidth: 360, mb: 4 }}>
              Ready to continue your Japanese learning journey?
            </Typography>
          </Box>
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #7c4dff08 0%, #7c4dff12 100%)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid #7c4dff20'
              }}
            >
              <Typography sx={{ color: '#1e293b', fontWeight: 600, mb: 2 }}>
                Your Progress
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <School sx={{ color: '#7c4dff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>
                      Continue Learning
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Pick up where you left off
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <School sx={{ color: '#7c4dff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>
                      Review Due
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Keep your knowledge fresh
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <School sx={{ color: '#7c4dff', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>
                      Study Stats
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                      Track your achievements
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ContentBox>
      </LeftSection>
      <RightSection>
        <ContentBox>
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              Welcome Back
            </Typography>

            {message && (
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: '#dcfce7', 
                color: '#16a34a',
                borderRadius: 2,
                fontSize: '0.875rem'
              }}>
                {message}
              </Box>
            )}

            {error && (
              <Box sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: '#fee2e2', 
                color: '#dc2626',
                borderRadius: 2,
                fontSize: '0.875rem'
              }}>
                {error}
              </Box>
            )}

            <GoogleButton
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </GoogleButton>
            <StyledDivider>or</StyledDivider>
            <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
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
                autoComplete="current-password"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <LoginButton type="submit" variant="contained">
                Sign in with Email
              </LoginButton>
            </form>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.875rem', mb: 1 }}>
                Don't have an account?{' '}
                <Button
                  sx={{
                    textTransform: 'none',
                    color: '#7c4dff',
                    fontWeight: 500,
                    p: 0,
                    ml: 0.5,
                    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                  }}
                  onClick={() => router.push('/signup')}
                >
                  Sign up
                </Button>
              </Typography>
              <Button
                sx={{
                  textTransform: 'none',
                  color: '#7c4dff',
                  fontWeight: 500,
                  p: 0,
                  fontSize: '0.875rem',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
                }}
                onClick={handleForgotPassword}
                disabled={!email || isResetting}
              >
                {isResetting ? 'Sending reset link...' : 'Forgot your password?'}
              </Button>
            </Box>
          </Box>
        </ContentBox>
      </RightSection>
    </PageContainer>
  );
}
