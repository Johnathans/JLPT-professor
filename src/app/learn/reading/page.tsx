import { Card, Typography, Box } from '@mui/material';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/AudioPlayer';
import { styled } from '@mui/material/styles';

const ReadingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const JapaneseText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  lineHeight: 1.8,
  marginBottom: theme.spacing(2),
}));

const TranslationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
  marginTop: theme.spacing(2),
}));

export default function ReadingPage() {
  // Sample reading content (will be fetched from Supabase in production)
  const sampleReading = {
    text: '私は毎朝公園を散歩します。桜の木の下でコーヒーを飲むのが好きです。',
    translation: 'I take a walk in the park every morning. I like to drink coffee under the cherry blossom trees.',
    audioUrl: '/sample-audio.mp3', // Will be replaced with Google TTS
  };

  return (
    <Layout maxWidth="md">
      <Typography variant="h1" gutterBottom>
        Reading Practice
      </Typography>
      
      <ReadingCard>
        <Box mb={2}>
          <AudioPlayer src={sampleReading.audioUrl} />
        </Box>
        
        <JapaneseText>
          {sampleReading.text}
        </JapaneseText>
        
        <TranslationText>
          {sampleReading.translation}
        </TranslationText>
      </ReadingCard>
      
      {/* Flashcards will be added here */}
    </Layout>
  );
}
