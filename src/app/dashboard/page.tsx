'use client';

import { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import LearningPath from '@/components/dashboard/LearningPath';
import VocabularyGrid from '@/components/dashboard/VocabularyGrid';
import KanjiGrid from '@/components/dashboard/KanjiGrid';
import GrammarGrid from '@/components/dashboard/GrammarGrid';

import styles from './page.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DashboardPage() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div className={styles.dashboardContainer}>
      <DashboardNavbar />
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                aria-label="dashboard navigation tabs"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1.125rem',
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#333',
                    '&.Mui-selected': {
                      color: '#7c4dff',
                      fontWeight: 700
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#7c4dff',
                    height: 3
                  }
                }}
              >
                <Tab label="Learning Path" />
                <Tab label="Vocabulary" />
                <Tab label="Kanji" />
                <Tab label="Grammar" />
              </Tabs>
            </Box>

            <TabPanel value={currentTab} index={0}>
              <LearningPath />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <VocabularyGrid />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <KanjiGrid />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <GrammarGrid />
            </TabPanel>
        </Box>
      </Container>
    </div>
  );
}
