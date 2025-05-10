'use client';

import { useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton, styled, Menu, MenuItem, Typography, Divider } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Help from '@mui/icons-material/Help';
import TuneIcon from '@mui/icons-material/Tune';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useJlptLevel } from '@/hooks/useJlptLevel';
import { useColorMode } from '@/contexts/ThemeContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import styles from '@/styles/dashboard.module.css';
import { SentenceEntry } from '@/types/sentence';

const LayoutRoot = styled('div')(({ theme, darkMode }: { theme?: any, darkMode: boolean }) => ({
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: darkMode ? '#121212' : '#f3f4f6',
  transition: 'background-color 0.2s ease'
}));

const Sidebar = styled(Box)(({ expanded, darkMode }: { expanded: boolean, darkMode: boolean }) => ({
  width: expanded ? 240 : 72,
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRight: `1px solid ${darkMode ? '#333' : '#e5e7eb'}`,
  transition: 'width 0.2s ease, background-color 0.2s ease',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media (max-width: 900px)': {
    display: 'none'
  }
}));

const MainContent = styled(Box)(({ sidebarExpanded, darkMode }: { sidebarExpanded: boolean, darkMode: boolean }) => ({
  flexGrow: 1,
  marginLeft: sidebarExpanded ? 240 : 72,
  padding: '24px 40px 40px',
  transition: 'margin-left 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  maxWidth: '1400px',
  '@media (max-width: 900px)': {
    marginLeft: 0,
    padding: '16px 16px 24px'
  }
}));

const TopBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  marginBottom: '16px',
  '@media (max-width: 900px)': {
    padding: '0 4px'
  }
});

const ModeButton = styled(IconButton)({
  backgroundColor: '#fff',
  padding: '12px',
  '&:hover': {
    backgroundColor: '#f3f4f6'
  }
});

const StatsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 32px',
  borderBottom: '1px solid #e5e7eb',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  '@media (max-width: 900px)': {
    padding: '12px 16px'
  }
});

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#6F767E',
  fontSize: '14px',
  '& .value': {
    color: '#1f2937',
    fontWeight: 500
  },
  '&.accuracy .value': {
    color: '#7c4dff'
  }
});

const ContentCard = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  backgroundColor: darkMode ? '#1e1e1e' : '#fff',
  borderRadius: '20px',
  padding: '48px',
  boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
  border: darkMode ? '1px solid #333' : 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  minHeight: '60vh',
  transition: 'background-color 0.2s ease',
  '@media (max-width: 900px)': {
    padding: '40px 24px',
    borderRadius: '16px',
    minHeight: 'unset'
  }
}));

const JapaneseSentence = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  fontSize: '42px',
  lineHeight: 1.7,
  textAlign: 'center',
  color: darkMode ? '#fff' : '#1f2937',
  margin: '12px 0',
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 400,
  '& .highlight': {
    color: '#7c4dff',
    padding: '0 8px'
  },
  '@media (max-width: 900px)': {
    fontSize: '40px'
  }
}));

const EnglishTranslation = styled(Box)(({ darkMode }: { darkMode: boolean }) => ({
  fontSize: '20px',
  color: darkMode ? '#aaa' : '#6F767E',
  textAlign: 'center',
  marginBottom: '24px',
  '@media (max-width: 900px)': {
    fontSize: '18px'
  }
}));

const ChoiceGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  '@media (max-width: 900px)': {
    gap: '16px'
  }
});

const MatchGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  '@media (max-width: 900px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  }
});

const MatchCard = styled(Box)<{ isSelected?: boolean; isCorrect?: boolean; isIncorrect?: boolean; darkMode: boolean }>(({ isSelected, isCorrect, isIncorrect, darkMode }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '120px',
  padding: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '32px',
  fontFamily: '"Noto Sans JP", sans-serif',
  backgroundColor: isCorrect ? '#f2fcfa' : isIncorrect ? '#fff1f0' : darkMode ? '#383838' : '#f3f4f6',
  border: `1px solid ${isCorrect ? '#e8faf3' : isIncorrect ? '#ffccc7' : darkMode ? '#444' : '#e5e7eb'}`,
  color: darkMode && !isCorrect && !isIncorrect ? '#fff' : '#1f2937',
  position: 'relative',
  '&:hover': {
    backgroundColor: isCorrect ? '#f2fcfa' : isIncorrect ? '#fff1f0' : darkMode ? '#444' : '#e9ebef',
  }
}));

const ChoiceButton = styled(Button)<{ correct?: boolean; incorrect?: boolean; darkMode?: boolean }>(
  ({ correct, incorrect, darkMode }) => ({
    width: '100%',
    justifyContent: 'center',
    padding: '20px 32px',
    borderRadius: '12px',
    fontSize: '20px',
    fontFamily: '"Noto Sans JP", sans-serif',
    fontWeight: 400,
    backgroundColor: correct ? '#4caf50' : 
                   incorrect ? '#f44336' : 
                   darkMode ? '#2d2d2d' : '#fff',
    color: correct || incorrect ? '#fff' : 
          darkMode ? '#fff' : '#1f2937',
    border: '1px solid',
    borderColor: correct ? '#4caf50' : 
                incorrect ? '#f44336' : 
                darkMode ? '#333' : '#e5e7eb',
    '&:hover': {
      backgroundColor: correct ? '#43a047' : 
                     incorrect ? '#e53935' : 
                     darkMode ? '#3a3052' : '#f3f0ff',
      color: correct || incorrect ? '#fff' : 
             darkMode ? '#fff' : '#7c4dff',
      borderColor: darkMode ? '#7c4dff' : '#7c4dff'
    },
    '@media (max-width: 900px)': {
      padding: '20px 24px',
      fontSize: '18px'
    }
  })
);

const navItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MenuBookIcon />, label: 'Kanji', path: '/learn/kanji' },
  { icon: <TranslateIcon />, label: 'Vocabulary', path: '/learn/vocabulary' },
  { icon: <FormatListBulletedIcon />, label: 'Grammar', path: '/learn/grammar' },
  { icon: <AccountCircleIcon />, label: 'Account', path: '/account' },
  { icon: <LogoutIcon />, label: 'Logout', path: '/logout' },
  { icon: <Settings />, label: 'Settings', path: '/settings' },
  { icon: <Help />, label: 'Help', path: '/help' }
];

function SidebarComponent({ 
  expanded, 
  onExpandedChange,
  darkMode 
}: { 
  expanded: boolean; 
  onExpandedChange: (expanded: boolean) => void;
  darkMode: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { level } = useJlptLevel();
  const supabase = createClientComponentClient();

  const getUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccountCircleIcon sx={{ width: 32, height: 32, color: '#7c4dff' }} />
        <Box sx={{ 
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          color: darkMode ? '#fff' : '#1f2937'
        }}>
          <Box sx={{ fontWeight: 600 }}>{level}</Box>
          <Box sx={{ fontSize: '0.875rem', color: darkMode ? '#aaa' : '#6F767E' }}>{level}</Box>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {navItems.map((item) => (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => router.push(item.path)}
            sx={{
              width: '100%',
              justifyContent: expanded ? 'flex-start' : 'center',
              color: pathname === item.path ? '#7c4dff' : darkMode ? '#fff' : '#1f2937',
              backgroundColor: pathname === item.path ? 
                (darkMode ? '#3a3052' : '#f3f0ff') : 
                'transparent',
              mb: 1,
              '&:hover': {
                backgroundColor: pathname === item.path ? 
                  (darkMode ? '#3a3052' : '#f3f0ff') : 
                  (darkMode ? '#383838' : '#f3f4f6')
              }
            }}
          >
            {expanded && item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

type StudyMode = 'vocabulary' | 'sentences' | 'kanji-onyomi' | 'kanji-kunyomi' | 'kanji-meaning' | 'kanji-match';
type JlptLevel = 'n1' | 'n2' | 'n3' | 'n4' | 'n5';

interface VocabularyItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  jlptLevel: string;
  partOfSpeech: string;
  frequencyRank: number;
  tags: string[];
}

interface KanjiItem {
  id: string;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  info: {
    grade: number;
    jlpt: number;
    strokeCount: number;
  };
}

const StudyModeLabels: Record<StudyMode, string> = {
  'vocabulary': 'Vocabulary',
  'sentences': 'Sentences',
  'kanji-onyomi': 'Kanji On\'yomi',
  'kanji-kunyomi': 'Kanji Kun\'yomi',
  'kanji-meaning': 'Kanji Meaning',
  'kanji-match': 'Kanji Match'
};

export default function StudyLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDarkMode, toggleDarkMode } = useColorMode();
  // Default to vocabulary mode
  const [studyMode, setStudyMode] = useState<StudyMode>('vocabulary');
  const [jlptLevel, setJlptLevel] = useState<JlptLevel>('n5');
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  // State for tab navigation in settings menu
  const [settingsTab, setSettingsTab] = useState<'vocabulary' | 'kanji' | 'listening' | 'reading' | 'grammar'>('vocabulary');
  const [accuracy, setAccuracy] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [remainingCards, setRemainingCards] = useState(0);
  
  // State for vocabulary, sentences, and kanji data
  const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
  const [sentenceData, setSentenceData] = useState<SentenceEntry[]>([]);
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleStudyModeChange = (mode: StudyMode) => {
    setStudyMode(mode);
    setSettingsAnchor(null);
    setCurrentItem(0);
    
    // Reset accuracy counters
    setAccuracy(0);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    
    // Load appropriate data based on mode
    if (mode === 'vocabulary') {
      loadVocabularyData(jlptLevel);
    } else if (mode === 'sentences') {
      loadSentenceData(jlptLevel);
    } else if (mode.startsWith('kanji')) {
      // Pass the mode explicitly to ensure it's used immediately
      loadKanjiData(jlptLevel, mode);
    }
  };
  
  // Handle level selection
  const handleLevelChange = (level: JlptLevel) => {
    setJlptLevel(level);
    // Removed handleSettingsClose() to keep menu open after level selection
    
    // Reset accuracy counters
    setAccuracy(0);
    setTotalAnswered(0);
    setCorrectAnswers(0);
    
    // Load appropriate data based on study mode
    if (studyMode === 'vocabulary') {
      loadVocabularyData(level);
    } else if (studyMode === 'sentences') {
      loadSentenceData(level);
    } else if (studyMode.startsWith('kanji')) {
      // Pass the current study mode explicitly to ensure it's used immediately
      loadKanjiData(level, studyMode);
    }
  };
  
  // Function to load vocabulary data for the selected JLPT level
  const loadVocabularyData = async (level: JlptLevel) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/study/vocabulary?level=${level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary data');
      }
      const data = await response.json();
      setVocabularyData(data);
      setCurrentItem(0);
      generateVocabularyChoices(data, 0);
      setRemainingCards(data.length);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load kanji data for the selected JLPT level
  const loadKanjiData = async (level: JlptLevel, mode?: StudyMode) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/study/kanji?level=${level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch kanji data');
      }
      const data = await response.json();
      setKanjiData(data);
      setCurrentItem(0);
      // Use the passed mode parameter if provided, otherwise use the current studyMode
      const modeToUse = mode || studyMode;
      console.log('Loading kanji data with mode:', modeToUse);
      generateKanjiChoices(data, 0, modeToUse);
      setRemainingCards(data.length);
    } catch (error) {
      console.error('Error loading kanji data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load sentence data for the selected JLPT level
  const loadSentenceData = async (level: JlptLevel) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/study/sentences?level=${level}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sentence data');
      }
      const data = await response.json();
      setSentenceData(data);
      setCurrentItem(0);
      generateSentenceChoices(data, 0);
      setRemainingCards(data.length);
    } catch (error) {
      console.error('Error loading sentence data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to limit meanings to a maximum of three
  const limitMeanings = (meaning: string): string => {
    // Split by common delimiters (semicolons, slashes with spaces around them)
    const meaningParts = meaning.split(/\s*[;\/]\s*/);
    
    // Take only the first three meanings
    const limitedParts = meaningParts.slice(0, 3);
    
    // Join them back with semicolons
    return limitedParts.join('; ');
  };
  
  // Function to generate choices for vocabulary study
  const generateVocabularyChoices = (data: VocabularyItem[], index: number) => {
    if (!data || data.length === 0) return;
    
    // Get the full meaning and limit it to three meanings max
    const fullMeaning = data[index].meaning;
    const correctAnswer = limitMeanings(fullMeaning);
    
    const otherChoices = data
      .filter((item, i) => i !== index)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => limitMeanings(item.meaning));
    
    const allChoices = [...otherChoices, correctAnswer];
    const shuffledChoices = allChoices.sort(() => 0.5 - Math.random());
    
    setChoices(shuffledChoices);
    setCorrectAnswerIndex(shuffledChoices.indexOf(correctAnswer));
  };
  
  // Function to generate choices for sentence study
  const generateSentenceChoices = (data: SentenceEntry[], index: number) => {
    if (!data || data.length === 0) return;
    
    // For sentences, we'll use the associated kanji as the missing word
    // and provide other kanji as distractors
    const currentSentence = data[index];
    const correctAnswer = currentSentence.associatedKanji[0]; // Use the first associated kanji
    
    // Get other kanji from other sentences as distractors
    const otherChoices = data
      .filter((item, i) => i !== index && item.associatedKanji.length > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => item.associatedKanji[0]);
    
    const allChoices = [...otherChoices, correctAnswer];
    const shuffledChoices = allChoices.sort(() => 0.5 - Math.random());
    
    setChoices(shuffledChoices);
    setCorrectAnswerIndex(shuffledChoices.indexOf(correctAnswer));
  };
  
  // Function to prepare kanji match cards with 8 options
  const prepareKanjiMatchCards = (data: KanjiItem[]) => {
    console.log('prepareKanjiMatchCards called with data length:', data.length);
    if (!data || data.length < 8) return;
    
    // Select 8 random kanji from the data
    const shuffledKanji = [...data].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    // Choose one kanji as the correct answer
    const correctKanjiIndex = Math.floor(Math.random() * shuffledKanji.length);
    const correctKanji = shuffledKanji[correctKanjiIndex];
    
    // Create cards with kanji characters
    const cards = shuffledKanji.map(item => item.kanji);
    
    // Set the target meaning to be matched
    const targetMeaning = correctKanji.meanings[0];
    
    // Set state
    setChoices(cards);
    setCorrectAnswerIndex(correctKanjiIndex);
    
    // Set the question text
    setCurrentQuestion(`Which kanji means "${targetMeaning}"?`);
  };

  // Function to generate choices for kanji study
  const generateKanjiChoices = (data: KanjiItem[], index: number, mode: StudyMode) => {
    console.log('generateKanjiChoices called with mode:', mode);
    if (!data || data.length === 0) return;
    
    // If it's kanji match mode, use the special function
    if (mode === 'kanji-match') {
      console.log('Detected kanji-match mode, calling prepareKanjiMatchCards');
      prepareKanjiMatchCards(data);
      return;
    }
    
    let correctAnswer: string;
    let otherChoices: string[];
    
    if (mode === 'kanji-onyomi') {
      // Make sure the current kanji has onyomi readings
      if (!data[index].onyomi || data[index].onyomi.length === 0) {
        // If no onyomi, move to the next kanji
        setCurrentItem((prev) => (prev + 1) % data.length);
        generateKanjiChoices(data, (index + 1) % data.length, mode);
        return;
      }
      
      correctAnswer = data[index].onyomi[0] || '';
      otherChoices = data
        .filter((item, i) => i !== index && item.onyomi && item.onyomi.length > 0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(item => item.onyomi[0]);
    } else if (mode === 'kanji-kunyomi') {
      // Make sure the current kanji has kunyomi readings
      if (!data[index].kunyomi || data[index].kunyomi.length === 0) {
        // If no kunyomi, move to the next kanji
        setCurrentItem((prev) => (prev + 1) % data.length);
        generateKanjiChoices(data, (index + 1) % data.length, mode);
        return;
      }
      
      correctAnswer = data[index].kunyomi[0] || '';
      otherChoices = data
        .filter((item, i) => i !== index && item.kunyomi && item.kunyomi.length > 0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(item => item.kunyomi[0]);
    } else { // kanji-meaning
      // For kanji meanings, we'll take up to 3 meanings and join them
      const meaningArray = data[index].meanings || [];
      const limitedMeanings = meaningArray.slice(0, 3);
      correctAnswer = limitedMeanings.join('; ');
      
      otherChoices = data
        .filter((item, i) => i !== index && item.meanings && item.meanings.length > 0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(item => {
          const meanings = item.meanings || [];
          return meanings.slice(0, 3).join('; ');
        });
    }
    
    const allChoices = [...otherChoices, correctAnswer];
    const shuffledChoices = allChoices.sort(() => 0.5 - Math.random());
    
    setChoices(shuffledChoices);
    setCorrectAnswerIndex(shuffledChoices.indexOf(correctAnswer));
  };
  
  // State for tracking selected answer and showing feedback
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);
  
  // Handle answer selection
  const handleAnswerSelection = (selectedIndex: number) => {
    // Prevent selecting multiple answers while showing feedback
    if (showingFeedback) return;
    
    // Set the selected answer and show feedback
    setSelectedAnswer(selectedIndex);
    setShowingFeedback(true);
    
    // Check if answer is correct
    const isCorrect = selectedIndex === correctAnswerIndex;
    
    // Update accuracy by tracking total answered and correct answers
    const newTotalAnswered = totalAnswered + 1;
    const newCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    
    // Update state
    setTotalAnswered(newTotalAnswered);
    setCorrectAnswers(newCorrectAnswers);
    
    // Calculate accuracy percentage
    const newAccuracy = Math.round((newCorrectAnswers / newTotalAnswered) * 100);
    setAccuracy(newAccuracy);
    
    // Move to next item after a delay
    setTimeout(() => {
      // Reset feedback state
      setSelectedAnswer(null);
      setShowingFeedback(false);
      
      const nextItem = currentItem + 1;
      let dataLength;
      
      // Determine data length based on study mode
      if (studyMode === 'vocabulary') {
        dataLength = vocabularyData.length;
      } else if (studyMode === 'sentences') {
        dataLength = sentenceData.length;
      } else {
        dataLength = kanjiData.length;
      }
      
      if (nextItem < dataLength) {
        setCurrentItem(nextItem);
        setRemainingCards(dataLength - nextItem);
        
        // Generate new choices for the next item
        if (studyMode === 'vocabulary') {
          generateVocabularyChoices(vocabularyData, nextItem);
        } else if (studyMode === 'sentences') {
          generateSentenceChoices(sentenceData, nextItem);
        } else {
          generateKanjiChoices(kanjiData, nextItem, studyMode);
        }
      }
    }, 1500);
  };
  
  // Load initial data when component mounts
  useEffect(() => {
    if (studyMode === 'vocabulary') {
      loadVocabularyData(jlptLevel);
    } else if (studyMode.startsWith('kanji')) {
      loadKanjiData(jlptLevel);
    }
  }, []);

  const renderQuestion = () => {
    if (loading) {
      return (
        <Typography sx={{ textAlign: 'center', fontSize: '24px', color: isDarkMode ? '#fff' : '#1f2937' }}>
          Loading...
        </Typography>
      );
    }
    
    switch (studyMode) {
      case 'vocabulary':
        if (!vocabularyData || vocabularyData.length === 0 || currentItem >= vocabularyData.length) {
          return (
            <Typography sx={{ textAlign: 'center', fontSize: '24px', color: isDarkMode ? '#fff' : '#1f2937' }}>
              No vocabulary data available for this level
            </Typography>
          );
        }
        return (
          <>
            <JapaneseSentence darkMode={isDarkMode}>
              {vocabularyData[currentItem].word}
            </JapaneseSentence>
            <EnglishTranslation darkMode={isDarkMode}>
              Select the correct meaning
            </EnglishTranslation>
          </>
        );
      case 'sentences':
        if (!sentenceData || sentenceData.length === 0 || currentItem >= sentenceData.length) {
          return (
            <Typography sx={{ textAlign: 'center', fontSize: '24px', color: isDarkMode ? '#fff' : '#1f2937' }}>
              No sentence data available for this level
            </Typography>
          );
        }
        
        // Create a sentence with a blank where the kanji should be
        const currentSentence = sentenceData[currentItem];
        const kanjiToReplace = currentSentence.associatedKanji[0];
        const japaneseWithBlank = currentSentence.japanese.replace(
          kanjiToReplace, 
          `<span class="highlight">＿＿＿</span>`
        );
        
        return (
          <>
            <JapaneseSentence 
              darkMode={isDarkMode}
              dangerouslySetInnerHTML={{ __html: japaneseWithBlank }}
            />
            <EnglishTranslation darkMode={isDarkMode}>
              {currentSentence.english}
            </EnglishTranslation>
          </>
        );
      case 'kanji-onyomi':
      case 'kanji-kunyomi':
      case 'kanji-meaning':
        if (!kanjiData || kanjiData.length === 0 || currentItem >= kanjiData.length) {
          return (
            <Typography sx={{ textAlign: 'center', fontSize: '24px', color: isDarkMode ? '#fff' : '#1f2937' }}>
              No kanji data available for this level
            </Typography>
          );
        }
        return (
          <>
            <JapaneseSentence 
              darkMode={isDarkMode} 
              sx={{ 
                fontSize: '96px', 
                margin: '0 !important',
                fontFamily: '"Noto Sans JP", sans-serif',
                '@media (max-width: 900px)': { fontSize: '72px' } 
              }}
            >
              {kanjiData[currentItem].kanji}
            </JapaneseSentence>
            <EnglishTranslation darkMode={isDarkMode}>
              {studyMode === 'kanji-onyomi' ? 'Select the correct on\'yomi reading' :
               studyMode === 'kanji-kunyomi' ? 'Select the correct kun\'yomi reading' :
               'Select the correct meaning'}
            </EnglishTranslation>
          </>
        );
      case 'kanji-match':
        if (!kanjiData || kanjiData.length < 8) {
          return (
            <Typography sx={{ textAlign: 'center', fontSize: '24px', color: isDarkMode ? '#fff' : '#1f2937' }}>
              Not enough kanji data available for this level
            </Typography>
          );
        }
        return (
          <>
            <Typography 
              sx={{ 
                textAlign: 'center', 
                fontSize: '32px', 
                fontWeight: 500,
                color: isDarkMode ? '#fff' : '#1f2937',
                margin: '0 0 24px',
                '@media (max-width: 900px)': { fontSize: '28px' }
              }}
            >
              {currentQuestion}
            </Typography>
          </>
        );
    }
  };

  const renderChoices = () => {
    if (loading) {
      return (
        <Typography sx={{ textAlign: 'center' }}>
          Loading choices...
        </Typography>
      );
    }
    
    if (choices.length === 0) {
      return (
        <Typography sx={{ textAlign: 'center', color: isDarkMode ? '#aaa' : '#6F767E' }}>
          No choices available
        </Typography>
      );
    }
    
    switch (studyMode) {
      case 'vocabulary':
        return (
          <ChoiceGrid>
            {choices.map((choice, index) => (
              <ChoiceButton 
                key={index}
                darkMode={isDarkMode}
                correct={showingFeedback && index === correctAnswerIndex}
                incorrect={showingFeedback && index === selectedAnswer && index !== correctAnswerIndex}
                onClick={() => handleAnswerSelection(index)}
              >
                {choice}
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        );
      case 'sentences':
        return (
          <ChoiceGrid>
            {choices.map((choice, index) => (
              <ChoiceButton 
                key={index}
                darkMode={isDarkMode}
                correct={showingFeedback && index === correctAnswerIndex}
                incorrect={showingFeedback && index === selectedAnswer && index !== correctAnswerIndex}
                onClick={() => handleAnswerSelection(index)}
              >
                {choice}
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        );
      case 'kanji-match':
        return (
          <MatchGrid>
            {choices.map((choice, index) => (
              <MatchCard 
                key={index}
                darkMode={isDarkMode}
                isCorrect={showingFeedback && index === correctAnswerIndex}
                isIncorrect={showingFeedback && index === selectedAnswer && index !== correctAnswerIndex}
                onClick={() => handleAnswerSelection(index)}
              >
                {choice}
                {showingFeedback && index === correctAnswerIndex && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px',
                      color: '#10b981',
                      display: 'flex'
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </Box>
                )}
                {showingFeedback && index === selectedAnswer && index !== correctAnswerIndex && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px',
                      color: '#f5222d',
                      display: 'flex'
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </Box>
                )}
              </MatchCard>
            ))}
          </MatchGrid>
        );
      case 'kanji-onyomi':
      case 'kanji-kunyomi':
      case 'kanji-meaning':
        return (
          <ChoiceGrid>
            {choices.map((choice, index) => (
              <ChoiceButton 
                key={index}
                darkMode={isDarkMode}
                correct={showingFeedback && index === correctAnswerIndex}
                incorrect={showingFeedback && index === selectedAnswer && index !== correctAnswerIndex}
                onClick={() => handleAnswerSelection(index)}
              >
                {choice}
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        );
    }
  };

  return (
    <>
      {/* Add the shared Navbar with the same dark mode state */}
      <div className={`${styles.studyNavContainer} ${styles.container} ${isDarkMode ? styles.dark : ''}`}>
        <Navbar forceDarkMode={isDarkMode} />
      </div>
      
      {/* Keep the original layout structure */}
      <LayoutRoot darkMode={isDarkMode}>
        {/* Keep the original sidebar but make it invisible */}
        <div style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}>
          <Sidebar
            expanded={isExpanded}
            darkMode={isDarkMode}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            <SidebarComponent 
              expanded={isExpanded} 
              onExpandedChange={setIsExpanded} 
              darkMode={isDarkMode}
            />
          </Sidebar>
        </div>
      <MainContent sidebarExpanded={isExpanded} darkMode={isDarkMode}>
        <TopBar>
          <Link href="/dashboard" passHref>
            <Button 
              startIcon={<ArrowBackIcon sx={{ color: '#7c4dff' }} />}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                color: '#7c4dff',
                textTransform: 'none',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              Back to Dashboard
            </Button>
          </Link>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ModeButton 
              onClick={toggleDarkMode}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              {isDarkMode ? (
                <LightModeIcon sx={{ color: '#7c4dff' }} />
              ) : (
                <DarkModeIcon sx={{ color: '#7c4dff' }} />
              )}
            </ModeButton>

            <ModeButton 
              onClick={handleSettingsClick}
              sx={{
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#383838' : '#f3f4f6'
                }
              }}
            >
              <TuneIcon sx={{ color: '#7c4dff' }} />
            </ModeButton>
          </Box>
          <Menu
            anchorEl={settingsAnchor}
            open={Boolean(settingsAnchor)}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: isDarkMode ? '#2d2d2d' : '#fff',
                border: isDarkMode ? '1px solid #333' : 'none',
                boxShadow: isDarkMode ? 'none' : undefined,
                width: '400px',
                padding: '8px 0'
              }
            }}
          >
            {/* JLPT Level Selection - Moved to the top */}
            <Box sx={{ px: 2, py: 1, mb: 1 }}>
              <Typography sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', fontWeight: 'bold', mb: 1 }}>
                JLPT Level
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {['n1', 'n2', 'n3', 'n4', 'n5'].map((level) => (
                  <Box
                    key={level}
                    onClick={() => handleLevelChange(level as JlptLevel)}
                    sx={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: jlptLevel === level ? '#fff' : isDarkMode ? '#ddd' : '#1f2937',
                      backgroundColor: jlptLevel === level ? 
                        '#7c4dff' : 
                        isDarkMode ? '#383838' : '#f3f4f6',
                      '&:hover': {
                        backgroundColor: jlptLevel === level ? 
                          '#6a3de8' : 
                          isDarkMode ? '#444' : '#e9ebef'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {level.toUpperCase()}
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Divider sx={{ my: 1, borderColor: isDarkMode ? '#333' : '#e5e7eb' }} />
            
            {/* Learning Area Tabs */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', fontWeight: 'bold', mb: 1 }}>
                Learning Area
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                mb: 2
              }}>
                {['vocabulary', 'kanji', 'listening', 'reading', 'grammar'].map((tab) => (
                  <Box
                    key={tab}
                    onClick={() => setSettingsTab(tab as any)}
                    sx={{
                      py: 1.2,
                      px: 2,
                      textAlign: 'left',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: settingsTab === tab ? 'bold' : 'normal',
                      color: settingsTab === tab ? '#fff' : isDarkMode ? '#ddd' : '#1f2937',
                      backgroundColor: settingsTab === tab ? '#7c4dff' : isDarkMode ? '#383838' : '#f3f4f6',
                      textTransform: 'capitalize',
                      '&:hover': {
                        backgroundColor: settingsTab === tab ? '#7c4dff' : isDarkMode ? '#444' : '#e9ebef'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab}
                  </Box>
                ))}
              </Box>
            </Box>
            
            {/* Study Mode Options based on selected tab */}
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', fontWeight: 'bold', mb: 1 }}>
                Question Style
              </Typography>
              
              {/* Show different options based on the selected tab */}
              {settingsTab === 'vocabulary' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {['vocabulary', 'sentences'].map((mode) => (
                    <Box
                      key={mode}
                      onClick={() => handleStudyModeChange(mode as StudyMode)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: studyMode === mode ? 'bold' : 'normal',
                        color: studyMode === mode ? '#7c4dff' : isDarkMode ? '#ddd' : '#1f2937',
                        backgroundColor: studyMode === mode ? 
                          (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                          isDarkMode ? '#383838' : '#f3f4f6',
                        '&:hover': {
                          backgroundColor: studyMode === mode ? 
                            (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                            (isDarkMode ? '#444' : '#e9ebef')
                        }
                      }}
                    >
                      {StudyModeLabels[mode as StudyMode]}
                    </Box>
                  ))}
                </Box>
              )}
              
              {settingsTab === 'kanji' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {['kanji-meaning', 'kanji-onyomi', 'kanji-kunyomi', 'kanji-match'].map((mode) => (
                    <Box
                      key={mode}
                      onClick={() => handleStudyModeChange(mode as StudyMode)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: studyMode === mode ? 'bold' : 'normal',
                        color: studyMode === mode ? '#7c4dff' : isDarkMode ? '#ddd' : '#1f2937',
                        backgroundColor: studyMode === mode ? 
                          (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                          isDarkMode ? '#383838' : '#f3f4f6',
                        '&:hover': {
                          backgroundColor: studyMode === mode ? 
                            (isDarkMode ? '#3a3052' : '#f3f0ff') : 
                            (isDarkMode ? '#444' : '#e9ebef')
                        }
                      }}
                    >
                      {StudyModeLabels[mode as StudyMode]}
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Placeholders for future modes */}
              {settingsTab === 'listening' && (
                <Box sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', textAlign: 'center', py: 2 }}>
                  Listening practice coming soon
                </Box>
              )}
              
              {settingsTab === 'reading' && (
                <Box sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', textAlign: 'center', py: 2 }}>
                  Reading practice coming soon
                </Box>
              )}
              
              {settingsTab === 'grammar' && (
                <Box sx={{ color: isDarkMode ? '#aaa' : '#6F767E', fontSize: '14px', textAlign: 'center', py: 2 }}>
                  Grammar practice coming soon
                </Box>
              )}
            </Box>
          </Menu>
        </TopBar>

        <StatsBar>
          <StatItem 
            className="accuracy"
            sx={{ 
              color: isDarkMode ? '#aaa' : '#6F767E',
              '& .value': {
                color: isDarkMode ? '#fff' : '#1f2937'
              },
              '&.accuracy .value': {
                color: '#7c4dff'
              }
            }}
          >
            <span className="value">{accuracy}%</span>
            <span>accuracy</span>
          </StatItem>
          <StatItem 
            className="cards-remaining"
            sx={{ 
              color: isDarkMode ? '#aaa' : '#6F767E',
              '& .value': {
                color: isDarkMode ? '#fff' : '#1f2937'
              },
              '&.cards-remaining .value': {
                color: '#7c4dff'
              }
            }}
          >
            <span className="value">{remainingCards}</span>
            <span>cards remaining</span>
          </StatItem>
        </StatsBar>

        <ContentCard darkMode={isDarkMode}>
          {renderQuestion()}
          {renderChoices()}
        </ContentCard>
      </MainContent>
    </LayoutRoot>
    </>
  );
}
