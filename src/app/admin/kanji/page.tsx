"use client";

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from '@mui/material';
import DataTable from '@/components/admin/DataTable';
import { KANJI_DATA, KanjiData, JLPTLevel } from './data';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

const columns: Column[] = [
  { id: 'kanji', label: 'Kanji', minWidth: 100 },
  { 
    id: 'meanings', 
    label: 'Meanings', 
    minWidth: 200,
    format: (value: string[]) => Array.isArray(value) ? value.join(', ') : ''
  },
  { 
    id: 'onyomi', 
    label: 'On\'yomi (音読み)', 
    minWidth: 200,
    format: (value: string[]) => Array.isArray(value) ? value.join('、') : ''
  },
  { 
    id: 'kunyomi', 
    label: 'Kun\'yomi (訓読み)', 
    minWidth: 200,
    format: (value: string[]) => Array.isArray(value) ? value.join('、') : ''
  },
  { 
    id: 'info', 
    label: 'Info', 
    minWidth: 200,
    format: (value: any) => `Grade ${value.grade} • JLPT N${value.jlpt} • ${value.strokeCount} strokes`
  },
];

export default function KanjiManagementPage() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('n5');
  const jlptLevels: JLPTLevel[] = ['n5', 'n4', 'n3', 'n2', 'n1'];
  const data = KANJI_DATA[selectedLevel];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          JLPT Kanji Management
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>JLPT Level</InputLabel>
              <Select
                value={selectedLevel}
                label="JLPT Level"
                onChange={(e) => setSelectedLevel(e.target.value as JLPTLevel)}
              >
                {jlptLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom>
          Found {data.length} kanji for JLPT {selectedLevel.toUpperCase()}
        </Typography>
        <DataTable
          columns={columns}
          rows={data}
        />
      </Box>
    </Container>
  );
}
