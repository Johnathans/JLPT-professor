"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import DataTable from '@/components/admin/DataTable';
import { VocabularyData } from '@/types/vocabulary';

// JLPT levels for filtering
const jlptLevels = ['all', 'n1', 'n2', 'n3', 'n4', 'n5'];

const columns = [
  { id: 'word', label: 'Word', minWidth: 100 },
  { id: 'reading', label: 'Reading', minWidth: 120 },
  { id: 'meaning', label: 'Meaning', minWidth: 150 },
  { 
    id: 'jlptLevel', 
    label: 'JLPT Level', 
    minWidth: 100,
    format: (value: string) => value.toUpperCase(),
  },
  { id: 'partOfSpeech', label: 'Part of Speech', minWidth: 120 },
  { 
    id: 'frequencyRank', 
    label: 'Frequency Rank', 
    minWidth: 100, 
    align: 'right' as const,
  },
  {
    id: 'tags',
    label: 'Tags',
    minWidth: 150,
    format: (value: string[]) => (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {value.map((tag) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Box>
    ),
  },
];

const partsOfSpeech = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'particle',
  'expression',
  'counter',
  'pronoun',
];

// Function to fetch vocabulary data from CSV files
async function fetchVocabularyData() {
  try {
    const response = await fetch('/api/admin/vocabulary');
    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching vocabulary data:', error);
    return [];
  }
}

export default function VocabularyManagement() {
  const [data, setData] = useState<VocabularyData[]>([]);
  const [filteredData, setFilteredData] = useState<VocabularyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyData | null>(null);
  const [currentLevel, setCurrentLevel] = useState('all');
  const [formData, setFormData] = useState<VocabularyData>({
    id: '',
    word: '',
    reading: '',
    meaning: '',
    jlptLevel: 'n5',
    partOfSpeech: 'noun',
    frequencyRank: 0,
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  
  // Load vocabulary data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const vocabularyData = await fetchVocabularyData();
        setData(vocabularyData);
        setFilteredData(vocabularyData);
      } catch (error) {
        console.error('Error loading vocabulary data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter data when level changes
  useEffect(() => {
    if (currentLevel === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.jlptLevel === currentLevel));
    }
  }, [currentLevel, data]);

  const handleAdd = () => {
    setEditingWord(null);
    setFormData({
      id: `new-${Date.now()}`,
      word: '',
      reading: '',
      meaning: '',
      jlptLevel: 'n5',
      partOfSpeech: 'noun',
      frequencyRank: 0,
      tags: [],
    });
    setOpenDialog(true);
  };

  const handleEdit = (row: VocabularyData) => {
    setEditingWord(row);
    setFormData(row);
    setOpenDialog(true);
  };

  const handleDelete = (row: VocabularyData) => {
    if (confirm('Are you sure you want to delete this vocabulary?')) {
      setData(data.filter(item => item.id !== row.id));
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real application, you would save to the database here
      // For now, we're just updating the local state
      if (editingWord) {
        setData(data.map(item => 
          item.id === editingWord.id ? formData : item
        ));
      } else {
        setData([...data, formData]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert('Failed to save vocabulary');
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleLevelChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentLevel(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#5e35b1' }}>
          Vocabulary Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ 
            bgcolor: '#7c4dff',
            '&:hover': {
              bgcolor: '#5e35b1',
            }
          }}
        >
          Add Vocabulary
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentLevel}
          onChange={handleLevelChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'medium',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
            },
            '& .Mui-selected': {
              fontWeight: 'bold',
              color: '#7c4dff',
            },
          }}
        >
          {jlptLevels.map((level) => (
            <Tab 
              key={level} 
              label={level === 'all' ? 'All Levels' : level.toUpperCase()} 
              value={level} 
            />
          ))}
        </Tabs>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {currentLevel === 'all' 
            ? `Showing all vocabulary (${filteredData.length} words)` 
            : `Showing ${currentLevel.toUpperCase()} vocabulary (${filteredData.length} words)`}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#7c4dff' }} />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingWord ? 'Edit Vocabulary' : 'Add New Vocabulary'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Word"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reading"
                value={formData.reading}
                onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meaning"
                multiline
                rows={2}
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>JLPT Level</InputLabel>
                <Select
                  value={formData.jlptLevel}
                  label="JLPT Level"
                  onChange={(e) => setFormData({ ...formData, jlptLevel: e.target.value })}
                >
                  {['n5', 'n4', 'n3', 'n2', 'n1'].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Part of Speech</InputLabel>
                <Select
                  value={formData.partOfSpeech}
                  label="Part of Speech"
                  onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                >
                  {partsOfSpeech.map((pos) => (
                    <MenuItem key={pos} value={pos}>
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Frequency Rank"
                value={formData.frequencyRank}
                onChange={(e) => setFormData({ ...formData, frequencyRank: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="New Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    size="small"
                  >
                    Add Tag
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              bgcolor: '#7c4dff',
              '&:hover': {
                bgcolor: '#5e35b1',
              }
            }}
          >
            {editingWord ? 'Save Changes' : 'Add Vocabulary'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
