"use client";

import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, color: '#5e35b1' }}>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3}>
            {/* Content Stats */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Kanji
                </Typography>
                <Typography variant="h4" sx={{ color: '#7c4dff' }}>
                  2136
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total kanji in database
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Vocabulary
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff9100' }}>
                  5000
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total vocabulary entries
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Grammar Points
                </Typography>
                <Typography variant="h4" sx={{ color: '#00bfa5' }}>
                  754
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total grammar points
                </Typography>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {['Add Kanji', 'Add Vocabulary', 'Add Grammar Point', 'Add Reading Passage'].map((action) => (
                    <Grid item key={action}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText'
                          }
                        }}
                      >
                        {action}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
