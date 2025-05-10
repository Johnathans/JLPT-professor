'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import type { JlptLevel } from '@/contexts/JlptLevelContext';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import BrandLogo from '@/components/BrandLogo';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
  ButtonBase,
  Dialog,
  Slide,
  Badge,
  InputBase,
  Stack,
  Grid,
  Menu,
  MenuItem
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  Home,
  Search as SearchIcon,
  History,
  Person,
  School,
  MenuBook,
  AutoStories,
  Translate,
  Add,
  Assessment,
  Circle as CircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  ExpandLess,
  ExpandMore,
  NotificationsNone,
  ArrowBack,
  Settings,
  Edit as EditIcon,
  Headphones as HeadphonesIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  hasSubmenu?: boolean;
  pro?: boolean;
}

const CollapsedDrawerWidth = 72;
const ExpandedDrawerWidth = 280;

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontSize: '1.25rem', // Slightly larger font for the logo
  '& .bold': {
    fontWeight: 700
  },
  color: theme.palette.primary.main
}));

const IconWrapper = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.04)'
  }
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    fontSize: '0.75rem',
    minWidth: 18,
    height: 18,
    padding: '0 4px'
  }
}));

const LogoContainer = styled('div')(({ theme }) => ({
  height: 72,
  padding: theme.spacing(0, 3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTypography-root': {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: theme.palette.primary.main
  }
}));

const StyledList = styled(List)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiListItemButton-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1.5, 2),
    transition: 'all 0.2s ease-in-out',
    '&.active': {
      backgroundColor: theme.palette.primary.light,
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main
      },
      '& .MuiTypography-root': {
        fontWeight: 600,
        color: theme.palette.primary.main
      }
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.light
    }
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary
  },
  '& .MuiTypography-root': {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: theme.palette.text.primary
  }
}));

const LevelBadge = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
    transform: 'translateY(-1px)'
  }
}));

const LevelText = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  '& .level': {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '& .jlpt': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.palette.text.secondary
    }
  },
  '& .studying': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    letterSpacing: '0.02em'
  }
}));

const ProBadge = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontSize: '0.625rem',
  fontWeight: 600,
  padding: '2px 6px',
  borderRadius: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  position: 'absolute',
  top: -2,
  right: -8
}));

const Sidebar = styled('div')<{ isExpanded: boolean }>(({ theme, isExpanded }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: isExpanded ? ExpandedDrawerWidth : CollapsedDrawerWidth,
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0,0,0,0.08)',
  overflow: 'hidden',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '@media (max-width: 744px)': {
    display: 'none'
  }
}));

const CollapsedListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  justifyContent: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '& .MuiListItemIcon-root': {
    minWidth: 'unset',
    marginRight: 0
  },
  ...(active && {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    }
  })
}));

const ExpandedListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    color: theme.palette.text.secondary
  },
  ...(active && {
    backgroundColor: theme.palette.primary.light,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '& .MuiTypography-root': {
      fontWeight: 600,
      color: theme.palette.primary.main
    }
  })
}));

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const { level, setLevel } = useJlptLevel();
  const [isExpanded, setIsExpanded] = useState(false);
  const expandTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const studyItems = [
    { icon: <School />, label: 'Kanji', path: '/learn/kanji' },
    { icon: <MenuBook />, label: 'Vocabulary', path: '/learn/vocabulary' },
    { icon: <Translate />, label: 'Grammar', path: '/learn/grammar' },
    { icon: <AutoStories />, label: 'Reading', path: '/learn/reading' },
    { icon: <QuizIcon />, label: 'Quiz', path: '/learn/quiz' }
  ];

  const handleMouseEnter = () => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    expandTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  return (
    <Sidebar 
      isExpanded={isExpanded}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <LogoContainer>
        <BrandLogo size={32} />
        {isExpanded && (
          <LogoText>
            JLPT <span className="bold">Professor</span>
          </LogoText>
        )}
      </LogoContainer>

      <StyledList>
        {studyItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            {isExpanded ? (
              <ExpandedListItem
                active={pathname === item.path}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ExpandedListItem>
            ) : (
              <CollapsedListItem
                active={pathname === item.path}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
              </CollapsedListItem>
            )}
          </ListItem>
        ))}
      </StyledList>

      {isExpanded && (
        <>
          <LevelBadge>
            <LevelText>
              <div className="level">
                {level} <KeyboardArrowDownIcon />
              </div>
            </LevelText>
          </LevelBadge>
          <Menu
            anchorEl={null}
            open={false}
            onClose={() => {}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {(['N5', 'N4', 'N3', 'N2', 'N1'] as JlptLevel[]).map((jlptLevel) => (
              <MenuItem 
                key={jlptLevel} 
                onClick={() => setLevel(jlptLevel)}
                selected={level === jlptLevel}
              >
                {jlptLevel}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Sidebar>
  );
}
