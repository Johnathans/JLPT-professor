'use client';

import { useState } from 'react';
import { Button, TextField, Paper, Typography, Box } from '@mui/material';

export default function TestKanjiReadings() {
  const [kanji, setKanji] = useState('日');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testKanji = async () => {
    setLoading(true);
    try {
      // Use our API route instead of direct Jisho access
      const response = await fetch(`/api/jisho?kanji=${encodeURIComponent(kanji)}`);
      const data = await response.json();
      console.log('API response:', JSON.stringify(data, null, 2));

      setResult({
        raw: data,
        processed: {
          onyomi: data.onyomi ? data.onyomi.split('、') : [],
          kunyomi: data.kunyomi ? data.kunyomi.split('、') : []
        }
      });
    } catch (error) {
      console.error('Error fetching kanji:', error);
      setResult({ error: 'Failed to fetch kanji data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Kanji Readings
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Kanji"
          value={kanji}
          onChange={(e) => setKanji(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={testKanji}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Readings'}
        </Button>
      </Box>

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Results for {kanji}:
          </Typography>
          
          <Typography variant="subtitle1" color="primary">
            On&apos;yomi (音読み):
          </Typography>
          <Typography paragraph>
            {result.processed?.onyomi?.join('、') || 'None found'}
          </Typography>
          
          <Typography variant="subtitle1" color="primary">
            Kun&apos;yomi (訓読み):
          </Typography>
          <Typography paragraph>
            {result.processed?.kunyomi?.join('、') || 'None found'}
          </Typography>
          
          <Typography variant="subtitle1" color="primary">
            Raw Response:
          </Typography>
          <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(result.raw, null, 2)}
          </pre>
        </Paper>
      )}
    </Box>
  );
}
