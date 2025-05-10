"use client";

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Edit as KanjiIcon,
  Translate as VocabularyIcon,
  MenuBook as GrammarIcon,
  Headphones as ListeningIcon,
  ImportContacts as ReadingIcon,
  FormatQuote as SentencesIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Kanji Management', icon: <KanjiIcon />, path: '/admin/kanji' },
  { text: 'Vocabulary', icon: <VocabularyIcon />, path: '/admin/vocabulary' },
  { text: 'Sentences', icon: <SentencesIcon />, path: '/admin/sentences' },
  { text: 'Grammar', icon: <GrammarIcon />, path: '/admin/grammar' },
  { text: 'Listening', icon: <ListeningIcon />, path: '/admin/listening' },
  { text: 'Reading', icon: <ReadingIcon />, path: '/admin/reading' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#5e35b1',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          JLPT Professor
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Admin Panel
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.path} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton
                sx={{
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  ...(pathname === item.path && {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }),
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
