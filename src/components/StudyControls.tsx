'use client';

import { Box, Button, styled, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import type { JlptLevel } from '@/contexts/JlptLevelContext';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'rgba(0, 0, 0, 0.87)',
  padding: theme.spacing(1, 1.5),
  backgroundColor: '#fff',
  minWidth: '80px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem'
  }
}));

export default function StudyControls() {
  const { level, setLevel } = useJlptLevel();
  const [levelMenuAnchor, setLevelMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState('New Words');

  const handleLevelClick = (event: React.MouseEvent<HTMLElement>) => {
    setLevelMenuAnchor(event.currentTarget);
  };

  const handleLevelClose = () => {
    setLevelMenuAnchor(null);
  };

  const handleLevelSelect = (newLevel: JlptLevel) => {
    setLevel(newLevel);
    handleLevelClose();
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusSelect = (newStatus: string) => {
    setStatus(newStatus);
    handleStatusClose();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <NavButton
        onClick={handleLevelClick}
        endIcon={<KeyboardArrowDown />}
      >
        {level}
      </NavButton>

      <Menu
        anchorEl={levelMenuAnchor}
        open={Boolean(levelMenuAnchor)}
        onClose={handleLevelClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {(['N5', 'N4', 'N3', 'N2', 'N1'] as JlptLevel[]).map((jlptLevel) => (
          <MenuItem
            key={jlptLevel}
            onClick={() => handleLevelSelect(jlptLevel)}
            selected={level === jlptLevel}
          >
            {jlptLevel}
          </MenuItem>
        ))}
      </Menu>

      <NavButton
        onClick={handleStatusClick}
        endIcon={<KeyboardArrowDown />}
      >
        {status}
      </NavButton>

      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {['New Words', 'Review Words', 'Learned Words'].map((wordStatus) => (
          <MenuItem
            key={wordStatus}
            onClick={() => handleStatusSelect(wordStatus)}
            selected={status === wordStatus}
          >
            {wordStatus}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
