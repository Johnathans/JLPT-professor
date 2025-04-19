'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import type { JlptLevel } from '@/types/module';
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
  Grid
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
  Menu,
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

const drawerWidth = 280; // Reduced from 320 for a cleaner look

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

const LevelText = styled('div')({
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
      color: theme.palette.text.secondary,
      letterSpacing: '0.02em'
    }
  },
  '& .studying': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    letterSpacing: '0.02em'
  }
});

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

const MobileMenu = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  zIndex: 1000,
  borderTop: `1px solid ${theme.palette.divider}`,
  '@media (min-width: 744px)': {
    display: 'none'
  }
}));

const MobileMenuGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  '& > a': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    '&.active': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      marginBottom: theme.spacing(0.5)
    }
  }
}));

const AddButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(1.5),
  marginTop: '-20px',
  width: '48px',
  height: '48px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem'
  }
}));

const AddBottomSheet = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'flex-end'
  },
  '& .MuiPaper-root': {
    margin: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80vh',
    overflowY: 'auto',
    paddingTop: theme.spacing(2)
  }
}));

const AddMenuGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2),
  padding: theme.spacing(2)
}));

const AddMenuCard = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  gap: theme.spacing(1.5),
  width: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main
  },
  '& .icon-wrapper': {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.light,
    marginBottom: theme.spacing(1)
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem',
    color: theme.palette.primary.main
  },
  '& .MuiTypography-root': {
    fontSize: '0.9375rem',
    fontWeight: 500,
    color: theme.palette.text.primary
  },
  '& .description': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    textAlign: 'center'
  }
}));

const CreateDeckButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  height: 48,
  borderRadius: theme.shape.borderRadius,
  width: '80%',
  margin: '0 auto',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 8px rgba(124, 77, 255, 0.08)'
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
    color: theme.palette.primary.main
  },
  '& .MuiTypography-root': {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: theme.palette.primary.main
  }
}));

const CreateDeckContainer = styled(Box)({
  padding: '32px 16px',
  marginTop: 'auto'
});

const StudyCard = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  width: '100%',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 3px 8px rgba(124, 77, 255, 0.08)'
  },
  '& .icon-wrapper': {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(0.5),
    transition: 'all 0.2s ease-in-out',
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem',
      color: theme.palette.primary.main
    }
  },
  '&:hover .icon-wrapper': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiSvgIcon-root': {
      color: '#fff'
    }
  },
  '& .label': {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary
  }
}));

const StudyGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2)
}));

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 744px)');
  const [addMenuAnchor, setAddMenuAnchor] = useState<null | HTMLElement>(null);
  const { level } = useJlptLevel();

  const studyItems = [
    { icon: <Home />, label: 'Home', path: '/dashboard' },
    { icon: <Add />, label: 'Create Deck', path: '/decks/create' },
    { icon: <School />, label: 'Kanji', path: '/learn/kanji' },
    { icon: <MenuBook />, label: 'Vocabulary', path: '/learn/vocabulary' },
    { icon: <AutoStories />, label: 'Reading', path: '/learn/reading' },
    { icon: <HeadphonesIcon />, label: 'Listening', path: '/learn/listening' },
    { icon: <EditIcon />, label: 'Grammar', path: '/learn/grammar' },
    { icon: <QuizIcon />, label: 'Quiz', path: '/learn/quiz' }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LogoContainer>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BrandLogo size={36} />
            <LogoText variant="h6">
              <span className="bold">JLPT</span> Professor
            </LogoText>
          </Stack>
        </Link>
      </LogoContainer>

      <LevelBadge onClick={() => router.push('/profile')}>
        <LevelText>
          <div className="level">
            {level} <span className="jlpt">JLPT</span>
          </div>
          <div className="studying">Currently Studying</div>
        </LevelText>
        <KeyboardArrowDownIcon />
      </LevelBadge>

      <StudyGrid container spacing={2}>
        {studyItems.map((item) => (
          <Grid item xs={6} key={item.path}>
            <StudyCard
              onClick={() => router.push(item.path)}
            >
              <div className="icon-wrapper">
                {item.icon}
              </div>
              <span className="label">{item.label}</span>
            </StudyCard>
          </Grid>
        ))}
      </StudyGrid>

      <CreateDeckContainer>
        <CreateDeckButton onClick={() => router.push('/decks')}>
          <MenuBook sx={{ fontSize: '1.25rem' }} />
          <Typography>Manage Flashcards</Typography>
        </CreateDeckButton>
      </CreateDeckContainer>
    </Box>
  );

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAddMenuAnchor(event.currentTarget);
  };

  const handleAddClose = () => {
    setAddMenuAnchor(null);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/learn/kanji':
        return 'Learn Kanji';
      case '/learn/vocabulary':
        return 'Learn Vocabulary';
      case '/learn/grammar':
        return 'Learn Grammar';
      case '/learn/reading':
        return 'Reading Practice';
      case '/search':
        return 'Search';
      case '/history':
        return 'History';
      case '/profile':
        return 'Profile';
      default:
        if (pathname.startsWith('/learn/')) {
          return 'Learning';
        }
        return '';
    }
  };

  const addMenuItems = [
    { 
      icon: <School />, 
      text: 'Learn Kanji', 
      description: 'Master new kanji characters',
      path: '/learn/kanji' 
    },
    { 
      icon: <MenuBook />, 
      text: 'Learn Vocabulary', 
      description: 'Build your Japanese vocabulary',
      path: '/learn/vocabulary' 
    },
    { 
      icon: <Translate />, 
      text: 'Learn Grammar', 
      description: 'Study Japanese grammar patterns',
      path: '/learn/grammar' 
    },
    { 
      icon: <AutoStories />, 
      text: 'Reading Practice', 
      description: 'Improve your reading skills',
      path: '/learn/reading' 
    }
  ];

  return (
    <>
      <Box 
        component="nav" 
        sx={{ 
          width: drawerWidth,
          '@media (max-width: 744px)': {
            display: 'none'
          }
        }}
      >
        <Drawer 
          variant="permanent" 
          sx={{ 
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper'
            },
            '@media (max-width: 744px)': {
              display: 'none'
            }
          }} 
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {isMobile && (
        <MobileMenu elevation={0}>
          <MobileMenuGrid>
            <Link
              href="/dashboard"
              className={pathname === '/dashboard' ? 'active' : ''}
            >
              <Home />
              <Typography variant="caption">
                Dashboard
              </Typography>
            </Link>
            <Link
              href="/history"
              className={pathname === '/history' ? 'active' : ''}
            >
              <History />
              <Typography variant="caption">
                History
              </Typography>
            </Link>
            <AddButton onClick={handleAddClick}>
              <Add />
            </AddButton>
            <Link
              href="/search"
              className={pathname === '/search' ? 'active' : ''}
            >
              <SearchIcon />
              <Typography variant="caption">
                Search
              </Typography>
            </Link>
            <Link
              href="/profile"
              className={pathname === '/profile' ? 'active' : ''}
            >
              <Person />
              <Typography variant="caption">
                Profile
              </Typography>
            </Link>
          </MobileMenuGrid>
        </MobileMenu>
      )}

      <AddBottomSheet
        open={Boolean(addMenuAnchor)}
        onClose={handleAddClose}
        TransitionComponent={Slide}
        TransitionProps={{
          direction: 'up'
        } as Partial<TransitionProps>}
      >
        <AddMenuGrid>
          {addMenuItems.map((item) => (
            <AddMenuCard
              key={item.path}
              onClick={() => {
                router.push(item.path);
                handleAddClose();
              }}
            >
              <div className="icon-wrapper">
                {item.icon}
              </div>
              <Typography>{item.text}</Typography>
              <Typography className="description">{item.description}</Typography>
            </AddMenuCard>
          ))}
        </AddMenuGrid>
      </AddBottomSheet>
    </>
  );
}
