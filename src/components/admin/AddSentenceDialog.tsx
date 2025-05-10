'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SentenceEntry } from '@/types/sentence';
import { v4 as uuidv4 } from 'uuid';

interface AddSentenceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (sentence: SentenceEntry) => void;
  currentLevel: string;
}

export default function AddSentenceDialog({ 
  open, 
  onClose, 
  onSave,
  currentLevel 
}: AddSentenceDialogProps) {
  const [formData, setFormData] = useState({
    level: currentLevel,
    japanese: '',
    english: '',
    associatedKanji: [] as string[],
    tags: [] as string[],
  });
  const [kanjiInput, setKanjiInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSentence: SentenceEntry = {
      id: uuidv4(),
      japanese: formData.japanese,
      english: formData.english,
      level: formData.level as 'N1' | 'N2' | 'N3' | 'N4' | 'N5',
      associatedKanji: formData.associatedKanji,
      tags: formData.tags,
    };

    onSave(newSentence);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      level: currentLevel,
      japanese: '',
      english: '',
      associatedKanji: [],
      tags: [],
    });
    setKanjiInput('');
    setTagInput('');
    onClose();
  };

  const handleAddKanji = () => {
    if (kanjiInput && !formData.associatedKanji.includes(kanjiInput)) {
      setFormData(prev => ({
        ...prev,
        associatedKanji: [...prev.associatedKanji, kanjiInput],
      }));
      setKanjiInput('');
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput('');
    }
  };

  const handleRemoveKanji = (kanji: string) => {
    setFormData(prev => ({
      ...prev,
      associatedKanji: prev.associatedKanji.filter(k => k !== kanji),
    }));
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#5e35b1' }}>Add New Sentence</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="level-select-label">JLPT Level</InputLabel>
              <Select
                labelId="level-select-label"
                value={formData.level}
                label="JLPT Level"
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7c4dff',
                  },
                }}
              >
                <MenuItem value="N5">N5 (Beginner)</MenuItem>
                <MenuItem value="N4">N4 (Basic)</MenuItem>
                <MenuItem value="N3">N3 (Intermediate)</MenuItem>
                <MenuItem value="N2">N2 (Advanced)</MenuItem>
                <MenuItem value="N1">N1 (Expert)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Japanese Sentence"
              fullWidth
              required
              value={formData.japanese}
              onChange={(e) => setFormData(prev => ({ ...prev, japanese: e.target.value }))}
              multiline
              rows={2}
            />
            <TextField
              label="English Translation"
              fullWidth
              required
              value={formData.english}
              onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
              multiline
              rows={2}
            />
            
            {/* Associated Kanji */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Associated Kanji"
                  value={kanjiInput}
                  onChange={(e) => setKanjiInput(e.target.value)}
                  size="small"
                />
                <Button 
                  onClick={handleAddKanji}
                  variant="contained"
                  sx={{ 
                    bgcolor: '#7c4dff',
                    '&:hover': { bgcolor: '#5e35b1' }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.associatedKanji.map((kanji) => (
                  <Chip
                    key={kanji}
                    label={kanji}
                    onDelete={() => handleRemoveKanji(kanji)}
                    sx={{ 
                      bgcolor: '#e8e3ff',
                      '& .MuiChip-deleteIcon': {
                        color: '#5e35b1',
                        '&:hover': { color: '#7c4dff' }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Tags */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  label="Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  size="small"
                />
                <Button 
                  onClick={handleAddTag}
                  variant="contained"
                  sx={{ 
                    bgcolor: '#7c4dff',
                    '&:hover': { bgcolor: '#5e35b1' }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ 
                      bgcolor: '#e8e3ff',
                      '& .MuiChip-deleteIcon': {
                        color: '#5e35b1',
                        '&:hover': { color: '#7c4dff' }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit"
            variant="contained"
            sx={{ 
              bgcolor: '#7c4dff',
              '&:hover': { bgcolor: '#5e35b1' }
            }}
          >
            Save Sentence
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
