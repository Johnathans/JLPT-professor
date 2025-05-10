'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getSentencesByLevel, saveSentence } from '@/services/sentences';
import { SentenceEntry } from '@/types/sentence';
import AddSentenceDialog from '@/components/admin/AddSentenceDialog';
import EditSentenceDialog from '@/components/admin/EditSentenceDialog';
import { useRouter } from 'next/navigation';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SentencesAdmin() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentences, setSentences] = useState<SentenceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState<SentenceEntry | null>(null);

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    const loadSentences = async () => {
      setLoading(true);
      const levelSentences = await getSentencesByLevel(levels[currentTab]);
      setSentences(levelSentences);
      setLoading(false);
    };

    loadSentences();
  }, [currentTab]);

  const filteredSentences = sentences.filter(sentence =>
    sentence.japanese.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sentence.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sentence.associatedKanji.some(kanji => kanji.includes(searchQuery))
  );

  const paginatedSentences = filteredSentences.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Reset page when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [currentTab, searchQuery]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleAddSentence = async (newSentence: SentenceEntry) => {
    setLoading(true);
    const success = await saveSentence(newSentence);
    if (success) {
      // Refresh sentences list
      const updatedSentences = await getSentencesByLevel(levels[currentTab]);
      setSentences(updatedSentences);
      router.refresh(); // Refresh the page to show new data
    } else {
      // You might want to show an error message here
      console.error('Failed to add sentence');
    }
    setLoading(false);
  };

  const handleEditSentence = async (updatedSentence: SentenceEntry) => {
    setLoading(true);
    const success = await saveSentence(updatedSentence, true);
    if (success) {
      // Refresh sentences list
      const updatedSentences = await getSentencesByLevel(levels[currentTab]);
      setSentences(updatedSentences);
      router.refresh(); // Refresh the page to show new data
    } else {
      console.error('Failed to update sentence');
    }
    setLoading(false);
  };

  const handleEditClick = (sentence: SentenceEntry) => {
    setSelectedSentence(sentence);
    setEditDialogOpen(true);
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#5e35b1' }}>
              Sentence Management
            </Typography>
            <Tooltip title="Add New Sentence">
              <IconButton 
                onClick={() => setAddDialogOpen(true)}
                sx={{ 
                  bgcolor: '#7c4dff',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#5e35b1',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root.Mui-selected': {
                  color: '#7c4dff',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#7c4dff',
                },
              }}
            >
              {levels.map((level) => (
                <Tab key={level} label={level} />
              ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search sentences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Japanese</TableCell>
                      <TableCell>English</TableCell>
                      <TableCell>Associated Kanji</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Loading sentences...
                        </TableCell>
                      </TableRow>
                    ) : filteredSentences.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No sentences found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSentences.map((sentence) => (
                      <TableRow key={sentence.id}>
                        <TableCell>{sentence.japanese}</TableCell>
                        <TableCell>{sentence.english}</TableCell>
                        <TableCell>{sentence.associatedKanji.join(', ')}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                              <IconButton 
                                size="small"
                                onClick={() => handleEditClick(sentence)}
                              >
                                <EditIcon />
                              </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {!loading && filteredSentences.length > 0 && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2, px: 2 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, filteredSentences.length)} of {filteredSentences.length} sentences
                  </Typography>
                  <Pagination
                    count={Math.ceil(filteredSentences.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      <AddSentenceDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddSentence}
        currentLevel={levels[currentTab]}
      />

      <EditSentenceDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedSentence(null);
        }}
        onSave={handleEditSentence}
        sentence={selectedSentence}
      />
    </Box>
  );
}
