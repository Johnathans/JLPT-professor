'use client';

import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import styles from './reset-password.module.css';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Box className={styles.formBox}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#1e293b', fontWeight: 600 }}>
          Reset Password
        </Typography>
        
        {success ? (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#dcfce7', 
            color: '#16a34a',
            borderRadius: 2,
            textAlign: 'center',
            mb: 2 
          }}>
            Password updated successfully! Redirecting to login...
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Box sx={{ 
                p: 2, 
                bgcolor: '#fee2e2', 
                color: '#dc2626',
                borderRadius: 2,
                mb: 2 
              }}>
                {error}
              </Box>
            )}
            
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#7c4dff',
                '&:hover': {
                  bgcolor: '#5e35b1'
                },
                py: 1.5
              }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Loading...</h1>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
