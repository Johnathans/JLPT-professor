"use client";

import { Box, Button, IconButton, Paper, Typography, Menu, MenuItem } from '@mui/material';
import { Close, TuneRounded, FlipToFront, Extension, Edit, QuestionAnswer, Keyboard, TouchApp, MenuBook, TextFields, SwapVert } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PageWrapper = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
});

const TopSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(1),
  backgroundColor: '#f8fafc',
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '680px',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const HeaderControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
  paddingBottom: '140px',
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
    paddingBottom: '120px'
  }
}));

const FooterArea = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(124, 77, 255, 0.08)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px 24px',
  [theme.breakpoints.down('sm')]: {
    padding: '16px'
  }
}));

const ButtonGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  }
}));

const DifficultyButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2),
  fontSize: '1rem',
  textTransform: 'none',
  fontWeight: 600,
  backgroundColor: '#fff',
  color: '#7c4dff',
  border: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  height: '48px',
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    color: '#5e35b1',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    fontSize: '0.9rem'
  }
}));

const ProgressBar = styled(Box)<{ value: number }>(({ value }) => ({
  width: '100%',
  maxWidth: '680px',
  height: '4px',
  backgroundColor: '#e8e3ff',
  position: 'relative',
  borderRadius: '2px',
  overflow: 'hidden',
  margin: '0 auto',
  marginBottom: '24px',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${value}%`,
    backgroundColor: '#7c4dff',
    transition: 'width 0.3s ease'
  }
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#fff',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  color: '#7c4dff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const CurrentMode = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1rem',
  fontWeight: 500,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: '12px 16px',
  margin: '4px 8px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(124, 77, 255, 0.16)',
    }
  }
}));

interface LearnLayoutProps {
  children: React.ReactNode;
  progress: number;
  mode: string;
  onModeSelect: (mode: string) => void;
  onDifficulty?: (difficulty: 'forgot' | 'hard' | 'good' | 'easy') => void;
  showDifficulty?: boolean;
}

export default function LearnLayout({ 
  children, 
  progress, 
  mode,
  onModeSelect,
  onDifficulty,
  showDifficulty = true
}: LearnLayoutProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    router.back();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModeSelect = (newMode: string) => {
    handleMenuClose();
    onModeSelect(newMode);
  };

  return (
    <PageWrapper>
      <TopSection>
        <Header>
          <CloseButton onClick={handleClose}>
            <Close />
          </CloseButton>
          <HeaderControls>
            <CurrentMode>{mode}</CurrentMode>
            <MenuButton onClick={handleMenuOpen}>
              <TuneRounded />
            </MenuButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 180,
                },
              }}
            >
              <Typography sx={{ px: 2, py: 1.5 }} variant="subtitle2" color="text.secondary">
                Study Mode
              </Typography>
              {mode.includes('Dictation') || mode === 'Question & Answer' ? (
                // Listening modes
                <>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('qa')}
                    selected={mode === 'Question & Answer'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <QuestionAnswer fontSize="small" />
                      </Box>
                      Question & Answer
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('dictation-type')}
                    selected={mode === 'Dictation (Type)'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <Keyboard fontSize="small" />
                      </Box>
                      Dictation (Type)
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('dictation-tap')}
                    selected={mode === 'Dictation (Tap)'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <TouchApp fontSize="small" />
                      </Box>
                      Dictation (Tap)
                    </Box>
                  </StyledMenuItem>
                </>
              ) : mode === 'Fill in the Blank' || mode === 'Sentence Order' || mode === 'Reading Q&A' ? (
                // Reading modes
                <Box>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('reading-qa')}
                    selected={mode === 'Reading Q&A'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <MenuBook fontSize="small" />
                      </Box>
                      Reading Q&A
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('fill-blank')}
                    selected={mode === 'Fill in the Blank'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <TextFields fontSize="small" />
                      </Box>
                      Fill in the Blank
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('sentence-order')}
                    selected={mode === 'Sentence Order'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <SwapVert fontSize="small" />
                      </Box>
                      Sentence Order
                    </Box>
                  </StyledMenuItem>
                </Box>
              ) : (
                // Default modes (vocabulary/kanji)
                <>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('flashcard')}
                    selected={mode === 'Flashcards'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <FlipToFront fontSize="small" />
                      </Box>
                      Flashcards
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('match')}
                    selected={mode === 'Match Game'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <Extension fontSize="small" />
                      </Box>
                      Match Game
                    </Box>
                  </StyledMenuItem>
                  <StyledMenuItem 
                    onClick={() => handleModeSelect('writing')}
                    selected={mode === 'Writing'}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 24, height: 24, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c4dff' }}>
                        <Edit fontSize="small" />
                      </Box>
                      Writing Practice
                    </Box>
                  </StyledMenuItem>
                </>
              )}
            </Menu>
          </HeaderControls>
        </Header>
        <ProgressBar value={progress} />
      </TopSection>
      <ContentArea>
        {children}
      </ContentArea>
      {showDifficulty && onDifficulty && (
        <FooterArea>
          <ButtonGrid>
            <DifficultyButton onClick={() => onDifficulty('forgot')}>
              Forgot
            </DifficultyButton>
            <DifficultyButton onClick={() => onDifficulty('hard')}>
              Hard
            </DifficultyButton>
            <DifficultyButton onClick={() => onDifficulty('good')}>
              Good
            </DifficultyButton>
            <DifficultyButton onClick={() => onDifficulty('easy')}>
              Easy
            </DifficultyButton>
          </ButtonGrid>
        </FooterArea>
      )}
    </PageWrapper>
  );
}

export const FlipCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  height: '500px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  position: 'relative',
  backgroundColor: '#fff',
  borderRadius: '24px',
  [theme.breakpoints.down('sm')]: {
    height: '400px',
    padding: '24px',
    borderRadius: '16px',
  }
}));

export const MainText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(4rem, 10vw, 6rem)',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.2,
}));

export const SubText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.4,
}));

export const MeaningText = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
  color: theme.palette.text.primary,
  fontFamily: '"Noto Sans JP", sans-serif',
  lineHeight: 1.4,
  textAlign: 'center',
  maxWidth: '90%',
}));
