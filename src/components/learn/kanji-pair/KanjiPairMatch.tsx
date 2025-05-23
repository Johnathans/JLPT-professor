"use client";

import { Box, Paper, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import LearnLayout from '../LearnLayout';

interface KanjiPair {
  kanji: string;
  meaning: string;
}

interface MatchBox {
  id: number;
  content: string;
  isKanji: boolean;
  matched: boolean;
  pairId: number;
}

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem'
  }
}));

const MatchGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  padding: '24px',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    maxWidth: '600px',
    gap: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    padding: '16px',
    gap: '12px',
  }
}));

const MatchBox = styled(Paper)<{ selected?: boolean; matched?: boolean }>(({ theme, selected, matched }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '16px',
  borderRadius: '12px',
  fontSize: '1.25rem',
  fontWeight: 500,
  backgroundColor: matched ? 'rgba(0, 200, 83, 0.12)' : '#fff',
  color: theme.palette.text.primary,
  border: selected ? '3px solid #7c4dff' : '2px solid #000',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: matched ? 'rgba(0, 200, 83, 0.12)' : 'rgba(124, 77, 255, 0.04)',
    transform: matched ? 'none' : 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.125rem',
    padding: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    padding: '10px',
  }
}));

const KanjiBox = styled(MatchBox)(({ theme }) => ({
  fontFamily: '"Noto Sans JP", sans-serif',
  fontSize: '4rem',
  lineHeight: 1,
  [theme.breakpoints.down('md')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  }
}));

export default function KanjiPairMatch() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [boxes, setBoxes] = useState<MatchBox[]>([]);

  // Sample data - replace with actual kanji pairs
  const kanjiPairs: KanjiPair[] = [
    { kanji: '日', meaning: 'day' },
    { kanji: '月', meaning: 'month' },
    { kanji: '火', meaning: 'fire' },
    { kanji: '水', meaning: 'water' },
    { kanji: '木', meaning: 'tree' },
    { kanji: '金', meaning: 'gold' }
  ];

  useEffect(() => {
    // Initialize boxes with shuffled kanji and meanings
    const initialBoxes: MatchBox[] = [];
    kanjiPairs.forEach((pair, index) => {
      initialBoxes.push({
        id: index * 2,
        content: pair.kanji,
        isKanji: true,
        matched: false,
        pairId: index
      });
      initialBoxes.push({
        id: index * 2 + 1,
        content: pair.meaning,
        isKanji: false,
        matched: false,
        pairId: index
      });
    });
    // Shuffle the boxes
    const shuffledBoxes = [...initialBoxes].sort(() => Math.random() - 0.5);
    setBoxes(shuffledBoxes);
  }, []);

  const handleBoxClick = (boxId: number) => {
    const clickedBox = boxes.find(box => box.id === boxId);
    if (!clickedBox || clickedBox.matched) return;

    if (selectedBox === null) {
      // First selection
      setSelectedBox(boxId);
    } else if (selectedBox !== boxId) {
      // Second selection
      const firstBox = boxes.find(box => box.id === selectedBox);
      if (firstBox && firstBox.pairId === clickedBox.pairId) {
        // Match found
        const updatedBoxes = boxes.map(box => 
          box.pairId === clickedBox.pairId ? { ...box, matched: true } : box
        );
        setBoxes(updatedBoxes);
        const matchedPairs = updatedBoxes.filter(box => box.matched).length / 2;
        setProgress((matchedPairs / kanjiPairs.length) * 100);
      }
      setSelectedBox(null);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8fafc',
        zIndex: 10,
      }}>
        <Box sx={{ position: 'relative', width: '100%', mb: 2, display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
          <CloseButton onClick={() => router.push('/learn')}>
            <Close />
          </CloseButton>
          <Box sx={{
            flex: 1,
            height: '24px',
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#7c4dff',
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8, // Add margin top to account for fixed header
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3 }
      }}>
      <MatchGrid>
        {boxes.map((box) => (
          box.isKanji ? (
            <KanjiBox
              key={box.id}
              selected={selectedBox === box.id}
              matched={box.matched}
              onClick={() => handleBoxClick(box.id)}
            >
              {box.content}
            </KanjiBox>
          ) : (
            <MatchBox
              key={box.id}
              selected={selectedBox === box.id}
              matched={box.matched}
              onClick={() => handleBoxClick(box.id)}
            >
              {box.content}
            </MatchBox>
          )
        ))}
      </MatchGrid>
      </Box>
    </Box>
  );
}
