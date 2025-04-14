'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Image, { StaticImageData } from 'next/image';
import japaneseFoodImage from '../../../assets/japanese-food.jpg';
import { 
  Card, 
  Typography, 
  Box, 
  Grid,
  Button,
  IconButton,
  Chip,
  Stack,
  Paper,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  alpha,
  Link
} from '@mui/material';
import { 
  VolumeUp, 
  ExpandMore as ExpandMoreIcon,
  ChevronRight,
  PlayArrow,
  Pause,
  MoreHoriz,
  Book,
  ViewHeadline,
  ViewStream,
  School,
  ArrowBack,
  MenuBook,
  Translate
} from '@mui/icons-material';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 'calc(1400px - 240px)', // updated width
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(2, 3),
}));

const StoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
    borderColor: theme.palette.primary.main,
  }
}));

const StoryContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StoryStats = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  '& .MuiChip-root': {
    backgroundColor: '#fff',
    '& .MuiChip-icon': {
      color: theme.palette.primary.main,
    },
  },
}));

const StoryContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  '& > div': {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    '&.active': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
}));

const StoryImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
}));

const StoryInfo = styled(Box)({
  flex: 1,
});

const StoryControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  marginTop: theme.spacing(3),
}));

const ViewOptions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginLeft: 'auto',
}));

const StoryText = styled(Box)(({ theme }) => ({
  fontSize: '1.25rem',
  lineHeight: 2.2,
  letterSpacing: '0.01em',
  '& > *': {
    marginRight: theme.spacing(0.25),
  }
}));

const Sentence = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0.25, 2.5),
  borderRadius: theme.spacing(0.5),
  display: 'inline',
  transition: 'background-color 0.2s',
  cursor: 'default',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.light}20`,
  }
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  padding: theme.spacing(0.25),
  width: 20,
  height: 20,
  minWidth: 20,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '.MuiBox-root:hover &': {
    opacity: 1,
  },
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem'
  }
}));

const ToolsButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  padding: theme.spacing(0.25),
  width: 20,
  height: 20,
  minWidth: 20,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  '.MuiBox-root:hover &': {
    opacity: 1,
  },
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem'
  }
}));

const JapaneseText = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  display: 'inline',
  fontFamily: '"Noto Sans JP", sans-serif',
  color: theme.palette.text.primary,
  '& .kanji': {
    color: theme.palette.primary.main,
    fontWeight: 500,
    position: 'relative',
  },
  '& .furigana': {
    position: 'absolute',
    top: '-1.2em',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '0.7em',
    color: theme.palette.text.secondary,
    fontWeight: 'normal',
  }
}));

const ToolButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1),
  width: '100%',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
  }
}));

interface DifficultyButtonProps {
  difficulty: 'hard' | 'good' | 'easy';
}

const DifficultyButton = styled(Button)<DifficultyButtonProps>(({ theme, difficulty }) => {
  const colors = {
    hard: theme.palette.error.main,
    good: theme.palette.warning.main,
    easy: theme.palette.success.main
  };
  return {
    flex: 1,
    padding: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: colors[difficulty],
    backgroundColor: `${colors[difficulty]}1A`,
    '&:hover': {
      backgroundColor: `${colors[difficulty]}33`,
    }
  };
});

const FlashcardOptions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ToolsPopover = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '100%',
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  zIndex: 10,
  minWidth: 200,
}));

const ReadingLayout = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: theme.spacing(4),
  width: '100%',
  paddingTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  }
}));

const MainContent = styled('div')(({ theme }) => ({
  flex: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const AudioSidebar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  position: 'sticky',
  top: theme.spacing(2),
  height: 'fit-content',
  maxHeight: 'calc(100vh - 100px)',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    position: 'static',
    maxHeight: '400px'
  }
}));

const BackButton = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  textDecoration: 'none',
  position: 'absolute',
  top: -48,
  left: 0,
  fontSize: '0.875rem',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '& svg': {
    fontSize: '1.2rem',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const StoryHeader = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatsGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StatCard = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  '& .label': {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
  },
  '& .value': {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    fontWeight: 600,
  },
}));

const AudioSidebarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

const StoryBadge = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  '& svg': {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
  },
}));

const StoryBadges = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const StoryTextContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& > div': {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    '&.active': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
}));

const AudioSectionHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

interface Story {
  id: string;
  title: string;
  description: string;
  imageUrl: string | StaticImageData;
  n5KanjiCount: number;
  n5VocabCount: number;
  sections: StorySection[];
}

interface StorySection {
  japanese: string;
  translation: string;
  flashcards: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

// Sample data - will be fetched from backend
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'My First Day at Work',
    description: 'Experience the excitement and nervousness of starting a new job.',
    imageUrl: '',
    n5KanjiCount: 15,
    n5VocabCount: 30,
    sections: [
      {
        japanese: '今日は新しい会社の初日です。朝早く起きて、スーツを着ました。電車は込んでいましたが、時間通りに着きました。オフィスは大きくて綺麗でした。',
        translation: 'Today is my first day at the new company. I woke up early and put on a suit. The train was crowded, but I arrived on time. The office was big and clean.',
        flashcards: [
          { word: '会社', reading: 'かいしゃ', meaning: 'company' },
          { word: '初日', reading: 'しょにち', meaning: 'first day' },
          { word: 'スーツ', reading: 'すーつ', meaning: 'suit' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Making Japanese Food',
    description: 'Learn about cooking traditional Japanese dishes at home.',
    imageUrl: japaneseFoodImage,
    n5KanjiCount: 20,
    n5VocabCount: 40,
    sections: [
      {
        japanese: '週末に日本料理を作ることにしました。まず、スーパーに買い物に行きました。野菜、お米、そして魚を買いました。家に帰って、料理を始めました。最初に、お米を研ぎました。次に、魚を焼いて、野菜を切りました。',
        translation: 'I decided to make Japanese food on the weekend. First, I went shopping at the supermarket. I bought vegetables, rice, and fish. I returned home and started cooking. First, I washed the rice. Next, I grilled the fish and cut the vegetables.',
        flashcards: [
          { word: '料理', reading: 'りょうり', meaning: 'cooking' },
          { word: '週末', reading: 'しゅうまつ', meaning: 'weekend' },
          { word: '買い物', reading: 'かいもの', meaning: 'shopping' }
        ]
      }
    ]
  }
];

const getAllSentences = (sections: StorySection[]) => {
  return sections.flatMap((section, sectionIndex) => 
    section.japanese.split('。').map((sentence, sentenceIndex) => ({
      text: sentence.trim() + (sentence.trim() ? '。' : ''),
      translation: section.translation,
      flashcards: section.flashcards,
      index: `${sectionIndex}-${sentenceIndex}`
    })).filter(s => s.text.trim())
  );
};

const AudioLine = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

export default function ReadingPage() {
  const theme = useTheme();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | undefined>(undefined);
  const [showFurigana, setShowFurigana] = useState<Record<string, boolean>>({});
  const [showTools, setShowTools] = useState<Record<string, boolean>>({});
  const [audioStates, setAudioStates] = useState<Record<string, boolean>>({});
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'paragraph' | 'lines'>('paragraph');
  const [showTranslation, setShowTranslation] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const handleStorySelect = (story: Story, index: number) => {
    setSelectedStory(story);
    setSelectedStoryIndex(index);
    setShowFurigana({});
    setShowTools({});
  };

  const toggleFurigana = (sentenceId: string) => {
    setShowFurigana(prev => ({ ...prev, [sentenceId]: !prev[sentenceId] }));
  };

  const toggleTools = (sentenceId: string) => {
    setShowTools(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== sentenceId) newState[key] = false;
      });
      newState[sentenceId] = !prev[sentenceId];
      return newState;
    });
  };

  const renderSentence = (text: string, index: number, flashcards: any[]) => {
    const sentenceId = `${selectedStory?.id}-${index}`;
    const isPlaying = audioStates[sentenceId];
    const cleanText = text.trim();
    if (!cleanText) return null;

    return (
      <Sentence key={index}>
        <PlayButton size="small" onClick={() => {/* Handle audio */}}>
          {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
        </PlayButton>

        <JapaneseText>
          {cleanText}
        </JapaneseText>

        <ToolsButton size="small" onClick={() => toggleTools(sentenceId)}>
          <MoreHoriz fontSize="small" />
        </ToolsButton>

        {showTools[sentenceId] && (
          <ToolsPopover>
            <ToolButton startIcon={<Book />} onClick={() => toggleFurigana(sentenceId)}>
              {showFurigana[sentenceId] ? 'Hide' : 'Show'} Furigana
            </ToolButton>
            <ToolButton startIcon={<School />} onClick={() => setFlashcardDialogOpen(true)}>
              Add to Flashcards
            </ToolButton>
            <FlashcardOptions>
              <DifficultyButton difficulty="hard">Hard</DifficultyButton>
              <DifficultyButton difficulty="good">Good</DifficultyButton>
              <DifficultyButton difficulty="easy">Easy</DifficultyButton>
            </FlashcardOptions>
          </ToolsPopover>
        )}
      </Sentence>
    );
  };

  const toggleAudio = (index: number) => {
    setAudioStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <PageContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {!selectedStory ? (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Reading Practice
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {sampleStories.map((story, index) => (
                <StoryCard key={story.id} onClick={() => handleStorySelect(story, index)}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {story.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {story.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<School />}
                      label={`${story.n5KanjiCount} N5 Kanji`}
                      size="small"
                    />
                    <Chip
                      icon={<School />}
                      label={`${story.n5VocabCount} N5 Vocab`}
                      size="small"
                    />
                  </Stack>
                </StoryCard>
              ))}
            </Box>
          </Box>
        ) : (
          <ReadingLayout>
            <MainContent>
              <BackButton href="/learn/reading">
                <ArrowBack fontSize="small" />
                Back to Stories
              </BackButton>

              <StoryHeader sx={{ mt: -1 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: '2rem', color: 'text.primary' }}>
                  {selectedStory.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {selectedStory.description}
                </Typography>

                <StatsGrid>
                  <StatCard>
                    <Typography className="label">Time</Typography>
                    <Typography className="value">5 min</Typography>
                  </StatCard>
                  <StatCard>
                    <Typography className="label">Sentences</Typography>
                    <Typography className="value">
                      {getAllSentences(selectedStory.sections).length}
                    </Typography>
                  </StatCard>
                  <StatCard>
                    <Typography className="label">N5 Kanji</Typography>
                    <Typography className="value">
                      {selectedStory.n5KanjiCount}
                    </Typography>
                  </StatCard>
                  <StatCard>
                    <Typography className="label">N5 Vocab</Typography>
                    <Typography className="value">
                      {selectedStory.n5VocabCount}
                    </Typography>
                  </StatCard>
                </StatsGrid>

                {selectedStory.imageUrl && (
                  <Box sx={{ mt: 3, position: 'relative', width: '100%', height: '300px' }}>
                    <Image 
                      src={selectedStory.imageUrl}
                      alt={selectedStory.title}
                      fill
                      style={{ 
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }} 
                    />
                  </Box>
                )}
              </StoryHeader>

              <StoryTextContainer>
                {getAllSentences(selectedStory.sections).map(({ text }, index) => (
                  <Box
                    key={index}
                    onClick={() => setActiveLine(index)}
                    className={activeLine === index ? 'active' : ''}
                  >
                    <Typography variant="body1">{text}</Typography>
                  </Box>
                ))}
              </StoryTextContainer>
            </MainContent>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setFlashcardDialogOpen(true)}
                  startIcon={<MenuBook />}
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Story Vocabulary
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {/* TODO: Add kanji dialog handler */}}
                  startIcon={<Translate />}
                  fullWidth
                  sx={{ py: 1 }}
                >
                  Story Kanji
                </Button>
              </Stack>

              <AudioSidebar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Line by Line Audio
                </Typography>

                <Stack spacing={1}>
                  {getAllSentences(selectedStory.sections).map(({ text, translation }, index) => (
                    <AudioLine
                      key={index}
                      className={activeLine === index ? 'active' : ''}
                      onClick={() => setActiveLine(index)}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(index);
                        }}
                      >
                        {audioStates[index] ? <Pause /> : <PlayArrow />}
                      </IconButton>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1">{text}</Typography>
                        {showTranslation && translation && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {translation}
                          </Typography>
                        )}
                      </Box>
                    </AudioLine>
                  ))}
                </Stack>
              </AudioSidebar>
            </Box>
          </ReadingLayout>
        )}
      </Box>

      <Dialog
        open={flashcardDialogOpen}
        onClose={() => setFlashcardDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Flashcards
          <IconButton
            onClick={() => setFlashcardDialogOpen(false)}
            sx={(theme) => ({ position: 'absolute', right: 8, top: 8 })}
          >
            <ChevronRight />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Flashcard content */}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
