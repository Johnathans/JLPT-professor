'use client';

import React from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import ReviewTable from '@/components/dashboard/ReviewTable';
import ReviewListItem from '@/components/dashboard/ReviewListItem';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UnitBlock from '@/components/dashboard/UnitBlock';
import ProgressTracking from '@/components/dashboard/ProgressTracking';
import ContentContainer from '@/components/shared/ContentContainer';
import { useJlptData } from '@/hooks/useJlptData';

const VOCAB_STYLE = { fontWeight: 500 };
const KANJI_STYLE = { fontWeight: 500, fontSize: '1.5rem' };
const GRAMMAR_STYLE = { fontWeight: 500 };

const units = [
  {
    title: 'Basic Greetings',
    imageUrl: '/images/greetings.svg',
    wordCount: 25,
    kanjiCount: 10,
    hasStarted: true,
    words: [
      { id: '1', kanji: 'おはよう', kana: 'おはよう', meaning: 'Good morning' },
      { id: '2', kanji: 'こんにちは', kana: 'こんにちは', meaning: 'Hello/Good afternoon' },
      { id: '3', kanji: 'こんばんは', kana: 'こんばんは', meaning: 'Good evening' },
      { id: '4', kanji: 'さようなら', kana: 'さようなら', meaning: 'Goodbye' },
      { id: '5', kanji: 'ありがとう', kana: 'ありがとう', meaning: 'Thank you' },
      { id: '6', kanji: '初めまして', kana: 'はじめまして', meaning: 'Nice to meet you' },
      { id: '7', kanji: 'お願いします', kana: 'おねがいします', meaning: 'Please' },
      { id: '8', kanji: '失礼します', kana: 'しつれいします', meaning: 'Excuse me' }
    ]
  },
  {
    title: 'Daily Life',
    imageUrl: '/images/daily-life.svg',
    wordCount: 40,
    kanjiCount: 15,
    hasStarted: false,
    words: [
      { id: '9', kanji: '家', kana: 'いえ', meaning: 'House/Home' },
      { id: '10', kanji: '学校', kana: 'がっこう', meaning: 'School' },
      { id: '11', kanji: '仕事', kana: 'しごと', meaning: 'Work/Job' },
      { id: '12', kanji: '時間', kana: 'じかん', meaning: 'Time' },
      { id: '13', kanji: '電車', kana: 'でんしゃ', meaning: 'Train' },
      { id: '14', kanji: '友達', kana: 'ともだち', meaning: 'Friend' }
    ]
  },
  {
    title: 'Travel & Transport',
    imageUrl: '/images/kim-deokryul-4Jlzdmqg-Pc-unsplash.jpg',
    wordCount: 35,
    kanjiCount: 12,
    hasStarted: false,
    words: [
      { id: '15', kanji: '駅', kana: 'えき', meaning: 'Station' },
      { id: '16', kanji: '切符', kana: 'きっぷ', meaning: 'Ticket' },
      { id: '17', kanji: '地下鉄', kana: 'ちかてつ', meaning: 'Subway' },
      { id: '18', kanji: 'バス', kana: 'ばす', meaning: 'Bus' },
      { id: '19', kanji: '空港', kana: 'くうこう', meaning: 'Airport' }
    ]
  },
  {
    title: 'Food & Dining',
    imageUrl: '/images/blocks/4306483_asian_bowl_chopsticks_food_noodle_icon.png',
    wordCount: 30,
    kanjiCount: 8,
    hasStarted: false,
    words: [
      { id: '20', kanji: '食べ物', kana: 'たべもの', meaning: 'Food' },
      { id: '21', kanji: '飲み物', kana: 'のみもの', meaning: 'Drink' },
      { id: '22', kanji: 'レストラン', kana: 'れすとらん', meaning: 'Restaurant' },
      { id: '23', kanji: '朝ご飯', kana: 'あさごはん', meaning: 'Breakfast' },
      { id: '24', kanji: '昼ご飯', kana: 'ひるごはん', meaning: 'Lunch' },
      { id: '25', kanji: '晩ご飯', kana: 'ばんごはん', meaning: 'Dinner' }
    ]
  }
];

export default function DashboardPage() {
  const [mode, setMode] = React.useState('study');
  const [filter, setFilter] = React.useState('vocabulary');
  const [selectedLevel, setSelectedLevel] = React.useState('n5');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const { getLevelData, isLoading } = useJlptData('n5');
  const levelData = React.useMemo(() => {
    try {
      return getLevelData(selectedLevel as 'n5' | 'n4' | 'n3' | 'n2' | 'n1');
    } catch (error) {
      console.error('Error getting level data:', error);
      return null;
    }
  }, [getLevelData, selectedLevel]);

  const handleModeChange = (newMode: string) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleStart = (unitTitle: string, knownWordIds: string[]) => {
    console.log(`Starting unit: ${unitTitle} with known words:`, knownWordIds);
  };

  const handleReview = (unitTitle: string) => {
    console.log(`Reviewing unit: ${unitTitle}`);
  };

  const handleJlptLevelChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedItems([]); // Reset selections when level changes
  };

  const handleSelectionChange = React.useCallback((selectedIds: string[]) => {
    setSelectedItems(selectedIds);
  }, []);

  const handleMarkAsKnown = React.useCallback((selectedIds: string[]) => {
    // TODO: Update the status of these items to 'mastered'
    console.log('Mark as known:', selectedIds);
  }, []);

  const handleStartReview = React.useCallback((selectedIds: string[]) => {
    // TODO: Navigate to review mode with these items
    console.log('Start review:', selectedIds);
  }, []);

  const reviewData = React.useMemo(() => {
    if (!levelData || isLoading) return null;

    return {
      vocabulary: levelData.vocabulary?.map((item, index) => ({
        id: `vocab-${index}`,
        word: item.kanji || item.kana,
        reading: item.kana,
        meaning: item.meanings.join(', '),
        status: 'new' as const
      })) || [],
      kanji: levelData.kanji?.map((item, index) => ({
        id: `kanji-${index}`,
        word: item.character,
        reading: [...item.onyomi, ...item.kunyomi].filter(Boolean).join(', '),
        meaning: item.meanings.join(', '),
        status: 'new' as const
      })) || [],
      grammar: levelData.grammar?.map((item, index) => ({
        id: `grammar-${index}`,
        word: item.pattern,
        reading: item.kana,
        meaning: item.kana, // Use kana as meaning since GrammarData doesn't have a meaning field
        status: 'new' as const
      })) || []
    };
  }, [levelData, isLoading]);

  return (
    <DashboardLayout 
      onJlptLevelChange={handleJlptLevelChange}
      onModeChange={handleModeChange}
      initialMode={mode}
    >
      <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {mode === 'study' ? (
          <Box sx={{ 
            display: 'flex',
            gap: 4,
            maxWidth: 1000,
            mx: 'auto',
            px: 2
          }}>
            <Box sx={{ width: '65%' }}>
              {/* Units Timeline */}
              <Box sx={{ position: 'relative' }}>
              {units.map((unit, index) => (
                <UnitBlock
                  key={unit.title}
                  {...unit}
                  index={index + 1}
                  onStart={(knownWordIds) => handleStart(unit.title, knownWordIds)}
                  isLast={index === units.length - 1}
                />
              ))}
              </Box>
            </Box>

            {/* Progress Tracking */}
            <Box sx={{ 
              position: 'sticky',
              top: 24,
              height: 'fit-content',
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <ProgressTracking
                wordsKnown={42}
                totalWords={100}
                kanjiKnown={15}
                totalKanji={50}
                dailyProgress={[60, 80, 40, 90, 70, 30, 50]}
              />
            </Box>
          </Box>
        ) : (
          <ContentContainer maxWidth="lg">
            <Box sx={{ mt: 2 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                  <CircularProgress />
                </Box>
              ) : reviewData ? (
                <ReviewTable
                  data={reviewData}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                  onSelectionChange={handleSelectionChange}
                  onMarkAsKnown={handleMarkAsKnown}
                  onStartReview={handleStartReview}
                />
              ) : null}
            </Box>
          </ContentContainer>
        )}
      </Box>
    </DashboardLayout>
  );
}
