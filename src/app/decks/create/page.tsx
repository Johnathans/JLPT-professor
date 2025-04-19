'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  Typography,
  Tabs,
  Tab,
  Paper,
  styled,
  Grid,
  Card,
  IconButton,
  Button,
  Drawer,
  Stack,
  Checkbox
} from '@mui/material';
import { 
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  PlaylistAdd as PlaylistAddIcon
} from '@mui/icons-material';
import ContentContainer from '@/components/shared/ContentContainer';

// Styled components
const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: '1px solid #E2E8F0',
  boxShadow: 'none'
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1.5),
    '& fieldset': {
      borderColor: '#E2E8F0',
    },
    '&:hover fieldset': {
      borderColor: '#7c4dff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7c4dff',
    },
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: '#7c4dff',
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: '#7c4dff',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: '#64748B',
    '&.Mui-selected': {
      color: '#7c4dff',
      fontWeight: 600,
    },
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: '1px solid #E2E8F0',
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#7c4dff',
    backgroundColor: '#F6F3FF',
  }
}));

const CreateDeckDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%'
    }
  }
}));

const DeckOption = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  border: '1px solid #E2E8F0',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#7c4dff',
    backgroundColor: '#F6F3FF',
  },
  '&.selected': {
    borderColor: '#7c4dff',
    backgroundColor: '#F6F3FF',
  }
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

// Mock data for testing
const mockKanji = [
  { id: 1, character: '日', meaning: 'Day, Sun', reading: 'ニチ、ジツ、ひ' },
  { id: 2, character: '月', meaning: 'Month, Moon', reading: 'ゲツ、ガツ、つき' },
  { id: 3, character: '火', meaning: 'Fire', reading: 'カ、ひ' },
];

const mockVocab = [
  { id: 1, word: '日本語', reading: 'にほんご', meaning: 'Japanese language' },
  { id: 2, word: '学生', reading: 'がくせい', meaning: 'Student' },
  { id: 3, word: '図書館', reading: 'としょかん', meaning: 'Library' },
];

const mockSentences = [
  { id: 1, japanese: '私は学生です。', reading: 'わたしはがくせいです。', meaning: 'I am a student.' },
  { id: 2, japanese: '今日は暑いです。', reading: 'きょうはあついです。', meaning: 'Today is hot.' },
  { id: 3, japanese: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', meaning: 'I will study at the library.' },
];

const mockExistingDecks = [
  { id: 1, name: 'JLPT N5 Basics', cardCount: 42 },
  { id: 2, name: 'Common Daily Words', cardCount: 25 },
  { id: 3, name: 'Essential Kanji', cardCount: 15 },
];

export default function CreateDeckPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderKanjiResults = () => (
    <Grid container spacing={2}>
      {mockKanji.map((kanji) => (
        <Grid item xs={12} sm={6} md={4} key={kanji.id}>
          <ResultCard>
            <Checkbox
              checked={selectedItems.includes(kanji.id)}
              onChange={() => toggleItemSelection(kanji.id)}
              sx={{
                color: '#7c4dff',
                '&.Mui-checked': {
                  color: '#7c4dff',
                },
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                {kanji.character}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {kanji.meaning}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {kanji.reading}
              </Typography>
            </Box>
          </ResultCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderVocabResults = () => (
    <Grid container spacing={2}>
      {mockVocab.map((vocab) => (
        <Grid item xs={12} sm={6} md={4} key={vocab.id}>
          <ResultCard>
            <Checkbox
              checked={selectedItems.includes(vocab.id)}
              onChange={() => toggleItemSelection(vocab.id)}
              sx={{
                color: '#7c4dff',
                '&.Mui-checked': {
                  color: '#7c4dff',
                },
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {vocab.word}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vocab.reading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vocab.meaning}
              </Typography>
            </Box>
          </ResultCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderSentenceResults = () => (
    <Grid container spacing={2}>
      {mockSentences.map((sentence) => (
        <Grid item xs={12} key={sentence.id}>
          <ResultCard>
            <Checkbox
              checked={selectedItems.includes(sentence.id)}
              onChange={() => toggleItemSelection(sentence.id)}
              sx={{
                color: '#7c4dff',
                '&.Mui-checked': {
                  color: '#7c4dff',
                },
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                {sentence.japanese}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sentence.reading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sentence.meaning}
              </Typography>
            </Box>
          </ResultCard>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <ContentContainer maxWidth="lg">
      <Box sx={{ pb: { xs: 10, md: 3 } }}>
        {/* Header */}
        <Box 
          sx={{ 
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#1A2027'
            }}
          >
            Create a Deck
          </Typography>

          {selectedItems.length > 0 && (
            <Button
              variant="contained"
              startIcon={<PlaylistAddIcon />}
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                backgroundColor: '#7c4dff',
                '&:hover': {
                  backgroundColor: '#6B3FE7'
                }
              }}
            >
              Add to Deck ({selectedItems.length})
            </Button>
          )}
        </Box>

        {/* Search Bar */}
        <SearchContainer>
          <SearchField
            fullWidth
            placeholder="Search for kanji, vocabulary, or sentences..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        {/* Tabs */}
        <StyledTabs 
          value={selectedTab} 
          onChange={handleTabChange}
          aria-label="search categories"
        >
          <Tab label="Kanji" />
          <Tab label="Vocabulary" />
          <Tab label="Sentences" />
        </StyledTabs>

        {/* Tab Panels */}
        <TabPanel value={selectedTab} index={0}>
          {renderKanjiResults()}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {renderVocabResults()}
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          {renderSentenceResults()}
        </TabPanel>
      </Box>

      {/* Create/Add to Deck Drawer */}
      <CreateDeckDrawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add to Deck
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748B' }}>
                Create New Deck
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter deck name"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '& fieldset': {
                      borderColor: '#E2E8F0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#7c4dff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7c4dff',
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748B' }}>
                Or Add to Existing Deck
              </Typography>
              <Stack spacing={1}>
                {mockExistingDecks.map((deck) => (
                  <DeckOption
                    key={deck.id}
                    className={selectedDeckId === deck.id ? 'selected' : ''}
                    onClick={() => {
                      setSelectedDeckId(deck.id);
                      setNewDeckName(''); // Clear new deck name when selecting existing
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#7c4dff' }}>
                        {deck.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {deck.cardCount} cards
                      </Typography>
                    </Box>
                  </DeckOption>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!newDeckName && selectedDeckId === null}
              onClick={() => {
                // Handle deck creation/addition
                setIsDrawerOpen(false);
                setSelectedDeckId(null);
                setNewDeckName('');
              }}
              sx={{
                backgroundColor: '#7c4dff',
                '&:hover': {
                  backgroundColor: '#6B3FE7'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E2E8F0',
                  color: '#94A3B8'
                }
              }}
            >
              {newDeckName ? 'Create Deck' : selectedDeckId ? 'Add to Deck' : 'Select or Create a Deck'}
            </Button>
          </Box>
        </Box>
      </CreateDeckDrawer>
    </ContentContainer>
  );
}
