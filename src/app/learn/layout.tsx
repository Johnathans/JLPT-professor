'use client';

import { Box, styled } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Home from '@mui/icons-material/Home';
import MenuBook from '@mui/icons-material/MenuBook';
import School from '@mui/icons-material/School';
import Quiz from '@mui/icons-material/Quiz';
import Settings from '@mui/icons-material/Settings';
import Assignment from '@mui/icons-material/Assignment';
import Insights from '@mui/icons-material/Insights';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Help from '@mui/icons-material/Help';
import AutoStories from '@mui/icons-material/AutoStories';
import Translate from '@mui/icons-material/Translate';
import { useJlptLevel } from '@/contexts/JlptLevelContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const LayoutRoot = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8fafc',
});

const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  backgroundColor: '#f8fafc',
  overflow: 'auto',
  padding: theme.spacing(3),
  marginLeft: 72,
  transition: 'margin-left 0.3s ease-in-out',
  '.sidebar-expanded &': {
    marginLeft: 240
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(8),
    marginLeft: 0
  }
}));

const Sidebar = styled('div')(({ theme }) => ({
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: 72,
  backgroundColor: '#fff',
  borderRight: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 12px',
  gap: '8px',
  '& .nav-text': {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out'
  },
  '& .user-name': {
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out'
  },
  '&:hover': {
    width: 240,
    '& .nav-text, & .user-name': {
      opacity: 1,
      transform: 'translateX(0)'
    },
    '& + .main-content': {
      marginLeft: 240
    }
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
}));

const UserSection = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px',
  marginBottom: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)'
  }
});

const NavItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: '#6F767E',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(124, 77, 255, 0.04)',
    color: '#7c4dff'
  },
  '.MuiSvgIcon-root': {
    width: 24,
    height: 24,
    flexShrink: 0
  },
  '.nav-text': {
    fontSize: '0.9375rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    opacity: 0,
    transform: 'translateX(-10px)',
    transition: 'all 0.3s ease-in-out',
    color: 'inherit'
  },
  '&.active': {
    color: '#7c4dff',
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    fontWeight: 600
  }
}));

const navItems = [
  { icon: <Home />, label: 'Dashboard', path: '/dashboard' },
  { icon: <School />, label: 'Kanji', path: '/learn/kanji' },
  { icon: <MenuBook />, label: 'Vocabulary', path: '/learn/vocabulary' },
  { icon: <Translate />, label: 'Grammar', path: '/learn/grammar' },
  { icon: <AutoStories />, label: 'Reading', path: '/learn/reading' },
  { icon: <Quiz />, label: 'Mock Exam', path: '/mock-exam' },
  { icon: <Assignment />, label: 'Progress', path: '/progress' },
  { icon: <Insights />, label: 'Analytics', path: '/analytics' },
  { icon: <Settings />, label: 'Settings', path: '/settings' },
  { icon: <Help />, label: 'Help', path: '/help' }
];

function SidebarComponent({ expanded, onExpandedChange }: { expanded: boolean; onExpandedChange: (expanded: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string>('');
  const supabase = createClientComponentClient();
  const { level } = useJlptLevel();

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    }
    getUserProfile();
  }, [supabase]);

  return (
    <Sidebar
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
    >
      <UserSection>
        <AccountCircle sx={{ width: 32, height: 32, color: '#7c4dff' }} />
        <Box sx={{ opacity: expanded ? 1 : 0 }}>
          <Box className="user-name" sx={{ fontWeight: 600 }}>{userName}</Box>
          <Box className="user-name" sx={{ fontSize: '0.875rem', color: '#6F767E' }}>{level}</Box>
        </Box>
      </UserSection>

      {navItems.map((item) => (
        <NavItem
          key={item.path}
          className={pathname === item.path ? 'active' : ''}
          onClick={() => router.push(item.path)}
        >
          {item.icon}
          <span className="nav-text">{item.label}</span>
        </NavItem>
      ))}
    </Sidebar>
  );
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <LayoutRoot>
      <SidebarComponent expanded={isExpanded} onExpandedChange={setIsExpanded} />
      <MainContent className={`main-content ${isExpanded ? 'sidebar-expanded' : ''}`}>
        {children}
      </MainContent>
    </LayoutRoot>
  );
}
