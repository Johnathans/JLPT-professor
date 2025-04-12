'use client';

import { useState } from 'react';
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
  Tooltip
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
  School
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import AudioPlayer from '@/components/AudioPlayer';

const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(3),
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

const StoryContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  backgroundColor: '#fff',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const StoryHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.light,
}));

const StoryHeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(3),
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

const StoryContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 6),
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

const FlashcardOptions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const FlashcardOption = styled(Button)(({ theme, difficulty }) => {
  const colors = {
    hard: '#ff9100',
    good: '#7c4dff',
    easy: '#00bfa5',
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

interface Story {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  n5KanjiCount: number;
  n5VocabCount: number;
  sections: {
    japanese: string;
    translation: string;
    flashcards: Array<{
      word: string;
      reading: string;
      meaning: string;
    }>;
  }[];
}

// Sample data - will be fetched from backend
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Morning in the Park',
    description: 'A peaceful story about morning routines and nature.',
    n5KanjiCount: 12,
    n5VocabCount: 25,
    sections: [
      {
        japanese: '私は毎朝公園を散歩します。桜の木の下でコーヒーを飲むのが好きです。',
        translation: 'I take a walk in the park every morning. I like to drink coffee under the cherry blossom trees.',
        flashcards: [
          { word: '公園', reading: 'こうえん', meaning: 'park' },
          { word: '散歩', reading: 'さんぽ', meaning: 'walk' },
          { word: '桜', reading: 'さくら', meaning: 'cherry blossom' }
        ]
      },
      {
        japanese: '小鳥のさえずりを聞きながら、本を読みます。とても静かで平和な時間です。',
        translation: 'I read a book while listening to the birds chirping. It is a very quiet and peaceful time.',
        flashcards: [
          { word: '小鳥', reading: 'ことり', meaning: 'small bird' },
          { word: '静か', reading: 'しずか', meaning: 'quiet' },
          { word: '平和', reading: 'へいわ', meaning: 'peace' }
        ]
      },
      {
        japanese: '時々、友達も一緒に来ます。私たちは楽しく話をしながら、朝ごはんを食べます。',
        translation: 'Sometimes, my friends come along too. We enjoy breakfast while having pleasant conversations.',
        flashcards: [
          { word: '友達', reading: 'ともだち', meaning: 'friend' },
          { word: '一緒', reading: 'いっしょ', meaning: 'together' },
          { word: '朝ごはん', reading: 'あさごはん', meaning: 'breakfast' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'My First Day at Work',
    description: 'Experience the excitement and nervousness of starting a new job.',
    n5KanjiCount: 15,
    n5VocabCount: 30,
    sections: [
      {
        japanese: '今日は新しい会社の初日です。朝早く起きて、スーツを着ました。',
        translation: 'Today is my first day at the new company. I woke up early and put on my suit.',
        flashcards: [
          { word: '会社', reading: 'かいしゃ', meaning: 'company' },
          { word: '初日', reading: 'しょにち', meaning: 'first day' },
          { word: 'スーツ', reading: 'すーつ', meaning: 'suit' }
        ]
      },
      {
        japanese: '電車は込んでいましたが、時間通りに着きました。オフィスは大きくて綺麗でした。',
        translation: 'The train was crowded, but I arrived on time. The office was big and beautiful.',
        flashcards: [
          { word: '電車', reading: 'でんしゃ', meaning: 'train' },
          { word: '時間', reading: 'じかん', meaning: 'time' },
          { word: '綺麗', reading: 'きれい', meaning: 'beautiful' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Weekend Shopping',
    description: 'A fun story about shopping and meeting friends in the city.',
    n5KanjiCount: 18,
    n5VocabCount: 35,
    sections: [
      {
        japanese: '土曜日に友達と買い物に行きました。新しい服を買いたかったです。',
        translation: 'I went shopping with my friend on Saturday. I wanted to buy new clothes.',
        flashcards: [
          { word: '土曜日', reading: 'どようび', meaning: 'Saturday' },
          { word: '買い物', reading: 'かいもの', meaning: 'shopping' },
          { word: '服', reading: 'ふく', meaning: 'clothes' }
        ]
      },
      {
        japanese: '駅の近くの大きいデパートに入りました。たくさんの人がいました。',
        translation: 'We entered a large department store near the station. There were many people.',
        flashcards: [
          { word: '駅', reading: 'えき', meaning: 'station' },
          { word: '近く', reading: 'ちかく', meaning: 'near' },
          { word: 'デパート', reading: 'でぱーと', meaning: 'department store' }
        ]
      },
      {
        japanese: '昼ごはんは食堂で食べました。おいしいラーメンを注文しました。',
        translation: 'We had lunch at the cafeteria. We ordered delicious ramen.',
        flashcards: [
          { word: '昼ごはん', reading: 'ひるごはん', meaning: 'lunch' },
          { word: '食堂', reading: 'しょくどう', meaning: 'cafeteria' },
          { word: '注文', reading: 'ちゅうもん', meaning: 'order' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Making Japanese Food',
    description: 'Learn about cooking traditional Japanese dishes at home.',
    n5KanjiCount: 20,
    n5VocabCount: 40,
    sections: [
      {
        japanese: '週末に日本料理を作ることにしました。まず、スーパーに買い物に行きました。',
        translation: 'I decided to make Japanese food on the weekend. First, I went shopping at the supermarket.',
        flashcards: [
          { word: '料理', reading: 'りょうり', meaning: 'cooking' },
          { word: '週末', reading: 'しゅうまつ', meaning: 'weekend' },
          { word: 'スーパー', reading: 'すーぱー', meaning: 'supermarket' }
        ]
      },
      {
        japanese: '野菜、お米、そして魚を買いました。家に帰って、料理を始めました。',
        translation: 'I bought vegetables, rice, and fish. I went home and started cooking.',
        flashcards: [
          { word: '野菜', reading: 'やさい', meaning: 'vegetables' },
          { word: 'お米', reading: 'おこめ', meaning: 'rice' },
          { word: '魚', reading: 'さかな', meaning: 'fish' }
        ]
      },
      {
        japanese: '最初に、お米を研ぎました。次に、魚を焼いて、野菜を切りました。',
        translation: 'First, I washed the rice. Then, I grilled the fish and cut the vegetables.',
        flashcards: [
          { word: '最初', reading: 'さいしょ', meaning: 'first' },
          { word: '次', reading: 'つぎ', meaning: 'next' },
          { word: '切る', reading: 'きる', meaning: 'to cut' }
        ]
      }
    ]
  }
];

export default function ReadingPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showFurigana, setShowFurigana] = useState<Record<string, boolean>>({});
  const [showTools, setShowTools] = useState<Record<string, boolean>>({});
  const [audioStates, setAudioStates] = useState<Record<string, boolean>>({});
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'paragraph' | 'lines'>('paragraph');
  const [showTranslation, setShowTranslation] = useState(false);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
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

  const getAllSentences = (sections: Story['sections']) => {
    return sections.flatMap((section, sectionIndex) => 
      section.japanese.split('。').map((sentence, sentenceIndex) => ({
        text: sentence.trim() + (sentence.trim() ? '。' : ''),
        flashcards: section.flashcards,
        index: `${sectionIndex}-${sentenceIndex}`
      })).filter(s => s.text.trim())
    );
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
              <FlashcardOption difficulty="hard">Hard</FlashcardOption>
              <FlashcardOption difficulty="good">Good</FlashcardOption>
              <FlashcardOption difficulty="easy">Easy</FlashcardOption>
            </FlashcardOptions>
          </ToolsPopover>
        )}
      </Sentence>
    );
  };

  return (
    <PageContainer>
      <Grid container spacing={3}>
        {!selectedStory ? (
          <Grid item xs={12}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
              Reading Practice
            </Typography>
            <Grid container spacing={3}>
              {sampleStories.map((story) => (
                <Grid item xs={12} md={6} key={story.id}>
                  <StoryCard onClick={() => handleStorySelect(story)}>
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
                </Grid>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Button
              startIcon={<ChevronRight sx={(theme) => ({ transform: 'rotate(180deg)' })} />}
              onClick={() => setSelectedStory(null)}
              sx={(theme) => ({
                mb: 3,
                color: theme.palette.primary.dark,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.light}40`,
                }
              })}
            >
              Back to Stories
            </Button>

            <StoryContainer>
              <StoryHeader>
                <StoryHeaderContent>
                  <StoryInfo>
                    <Typography 
                      variant="h4" 
                      sx={(theme) => ({ 
                        color: theme.palette.primary.dark,
                        fontWeight: 700,
                        mb: 1
                      })}
                    >
                      {selectedStory.title}
                    </Typography>

                    <Typography 
                      variant="body1" 
                      sx={(theme) => ({ 
                        color: theme.palette.text.secondary,
                        mb: 2
                      })}
                    >
                      {selectedStory.description}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Chip
                        icon={<School />}
                        label={`${selectedStory.n5KanjiCount} N5 Kanji`}
                        size="small"
                        sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}
                      />
                      <Chip
                        icon={<School />}
                        label={`${selectedStory.n5VocabCount} N5 Vocab`}
                        size="small"
                        sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}
                      />
                    </Stack>
                  </StoryInfo>

                  {selectedStory.imageUrl && (
                    <Box
                      component="img"
                      src={selectedStory.imageUrl}
                      alt={selectedStory.title}
                      sx={(theme) => ({
                        width: 200,
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: theme.shape.borderRadius,
                      })}
                    />
                  )}
                </StoryHeaderContent>

                <StoryControls>
                  <Button
                    variant="contained"
                    startIcon={<VolumeUp />}
                    sx={{
                      backgroundColor: '#00bfa5',
                      '&:hover': {
                        backgroundColor: '#008e76'
                      }
                    }}
                  >
                    Play Story
                  </Button>
                  <ViewOptions>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, value) => value && setViewMode(value)}
                      size="small"
                      sx={{
                        '& .MuiToggleButton-root': {
                          border: `1px solid #7c4dff30`,
                          '&.Mui-selected': {
                            backgroundColor: '#e8e3ff',
                            color: '#7c4dff',
                            '&:hover': {
                              backgroundColor: '#e8e3ff'
                            }
                          }
                        }
                      }}
                    >
                      <ToggleButton value="paragraph">
                        <Tooltip title="Paragraph View">
                          <ViewHeadline />
                        </Tooltip>
                      </ToggleButton>
                      <ToggleButton value="lines">
                        <Tooltip title="Line by Line">
                          <ViewStream />
                        </Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                      variant="outlined"
                      onClick={() => setShowTranslation(!showTranslation)}
                      size="small"
                      sx={{
                        borderColor: '#7c4dff',
                        color: '#7c4dff',
                        '&:hover': {
                          borderColor: '#5e35b1',
                          backgroundColor: 'rgba(124, 77, 255, 0.04)'
                        }
                      }}
                    >
                      {showTranslation ? 'Hide' : 'Show'} Translation
                    </Button>
                  </ViewOptions>
                </StoryControls>
              </StoryHeader>

              <StoryContent>
                <StoryText sx={viewMode === 'lines' ? (theme) => ({ 
                  '& > *': { 
                    display: 'block', 
                    mb: theme.spacing(2)
                  } 
                }) : undefined}>
                  {getAllSentences(selectedStory.sections).map(({ text, flashcards, index }) => 
                    renderSentence(text, index, flashcards)
                  )}
                </StoryText>
              </StoryContent>
            </StoryContainer>
          </Grid>
        )}
      </Grid>

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
