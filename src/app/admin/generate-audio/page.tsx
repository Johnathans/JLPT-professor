'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function GenerateAudioPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/generate-all-audio');
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to generate audio');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: '240px' },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Generate Audio for N5 Sentences
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="body1" paragraph>
            This tool will generate audio for all N5 sentences that don't already have audio.
            The process may take a few minutes depending on the number of sentences.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateAudio}
            disabled={loading}
            sx={{ 
              bgcolor: '#7c4dff',
              '&:hover': { bgcolor: '#5e35b1' },
              mb: 2
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Generating Audio...
              </>
            ) : (
              'Generate Audio for N5 Sentences'
            )}
          </Button>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {results && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Results Summary
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Paper sx={{ p: 2, flex: '1 1 200px' }}>
                  <Typography variant="subtitle2">Total Sentences</Typography>
                  <Typography variant="h5">{results.total}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: '1 1 200px' }}>
                  <Typography variant="subtitle2">Processed</Typography>
                  <Typography variant="h5">{results.processed}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2">Success</Typography>
                  <Typography variant="h5" color="success.main">{results.success}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#fff8e1' }}>
                  <Typography variant="subtitle2">Skipped</Typography>
                  <Typography variant="h5" color="warning.main">{results.skipped}</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#ffebee' }}>
                  <Typography variant="subtitle2">Failed</Typography>
                  <Typography variant="h5" color="error.main">{results.failed}</Typography>
                </Paper>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Details
              </Typography>
              
              <List sx={{ bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {results.details.map((detail: any, index: number) => (
                  <Box key={detail.id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={detail.japanese}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Status: {detail.status}
                            </Typography>
                            {detail.status === 'success' && (
                              <Typography component="div" variant="body2">
                                Audio URL: {detail.audioUrl}
                              </Typography>
                            )}
                            {detail.status === 'skipped' && (
                              <Typography component="div" variant="body2">
                                Reason: {detail.reason}
                              </Typography>
                            )}
                            {detail.status === 'failed' && (
                              <Typography component="div" variant="body2" color="error">
                                Error: {detail.error}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
