'use client';

import { useState } from 'react';
import studyGuideData from '@/data/jlpt-study-guide.json';
import styles from './study-guide.module.css';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@mui/material';
import JlptScoreChart from '@/components/charts/JlptScoreChart';
import StudyTimeChart from '@/components/charts/StudyTimeChart';
import StudyHoursChart from '@/components/charts/StudyHoursChart';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

type ContentCategory = {
  section: string;
  points: string[];
};

type ExamSection = {
  title: string;
  timeLimit: string;
  questions: string;
  content: ContentCategory[];
};

type ExamSections = {
  [key: string]: ExamSection;
};

type WeeklyGoal = {
  focus: string;
  tasks: string[];
};

type StudyPlan = {
  estimated_time: string;
  weekly_goals: WeeklyGoal[];
};

type Resources = {
  textbooks: string[];
  online: string[];
  apps: string[];
};

type LevelData = {
  title: string;
  description: string;
  examSections?: ExamSections;
  studyPlan?: StudyPlan;
  resources?: Resources;
  tips?: string[];
};

const defaultLevelData: LevelData = {
  title: '',
  description: '',
  examSections: {},
  studyPlan: {
    estimated_time: '',
    weekly_goals: []
  },
  resources: {
    textbooks: [],
    online: [],
    apps: []
  },
  tips: []
};

export default function StudyGuidePage() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const levelData: LevelData = {
    ...defaultLevelData,
    ...(studyGuideData.levels[selectedLevel] as LevelData)
  };

  const renderContent = (content: ContentCategory[]) => {
    if (!content || content.length === 0) return null;

    return content.map((category, index) => (
      <Box key={index} sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {category.section}
        </Typography>
        <List dense>
          {category.points.map((point, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main'
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={point} />
            </ListItem>
          ))}
        </List>
      </Box>
    ));
  };

  return (
    <>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} className={styles.heroContent}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                How to Pass the JLPT
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Comprehensive study guides and strategies for all JLPT levels
              </Typography>
              <div className={styles.levelSelector}>
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`${styles.levelButton} ${
                      selectedLevel === level ? styles.levelButtonActive : ''
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Grid>
            <Grid item xs={12} md={6} className={styles.heroImage}>
              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <Typography variant="h3" color="primary">
                    {selectedLevel === 'N1' || selectedLevel === 'N2' ? '110' : '95'}
                  </Typography>
                  <Typography variant="body1">Total Points Needed</Typography>
                </div>
                <div className={styles.statItem}>
                  <Typography variant="h3" color="primary">
                    {selectedLevel === 'N1' || selectedLevel === 'N2' ? '19/60' : '19/60'}
                  </Typography>
                  <Typography variant="body1">Section Min. Score</Typography>
                </div>
                <div className={styles.statItem}>
                  <Typography variant="h3" color="primary">
                    {selectedLevel === 'N1' ? '170' : 
                     selectedLevel === 'N2' ? '155' :
                     selectedLevel === 'N3' ? '140' :
                     selectedLevel === 'N4' ? '125' : '100'}
                  </Typography>
                  <Typography variant="body1">Minutes Total</Typography>
                </div>
                <div className={styles.statItem}>
                  <Typography variant="h3" color="primary">
                    {selectedLevel === 'N1' ? '3000+' : 
                     selectedLevel === 'N2' ? '2200+' :
                     selectedLevel === 'N3' ? '1700+' :
                     selectedLevel === 'N4' ? '1000+' : '800+'}
                  </Typography>
                  <Typography variant="body1">Words to Know</Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
          {/* Exam Structure Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
              Exam Structure & Scoring
            </Typography>
            <TableContainer component={Paper} className={styles.examTable}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell align="center">Time</TableCell>
                    <TableCell align="center">Questions</TableCell>
                    <TableCell align="center">Points</TableCell>
                    <TableCell align="center">Pass Mark</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedLevel === 'N4' || selectedLevel === 'N5' ? (
                    <>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2" color="primary">
                            Language Knowledge & Reading
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Vocabulary, Grammar, Reading
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{selectedLevel === 'N4' ? '60' : '55'} min</TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N4' ? '35' : '30'} questions
                        </TableCell>
                        <TableCell align="center">120</TableCell>
                        <TableCell align="center">38</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2" color="primary">
                            Listening
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Comprehension & Response
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{selectedLevel === 'N4' ? '35' : '30'} min</TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N4' ? '30' : '25'} questions
                        </TableCell>
                        <TableCell align="center">60</TableCell>
                        <TableCell align="center">19</TableCell>
                      </TableRow>
                      <TableRow className={styles.totalRow}>
                        <TableCell>Total</TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N4' ? '95' : '85'} min
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N4' ? '65' : '55'} questions
                        </TableCell>
                        <TableCell align="center">180</TableCell>
                        <TableCell align="center">95</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2" color="primary">
                            Language Knowledge
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Vocabulary & Grammar
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '45' : selectedLevel === 'N2' ? '40' : '35'} min
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '40' : selectedLevel === 'N2' ? '35' : '30'} questions
                        </TableCell>
                        <TableCell align="center">60</TableCell>
                        <TableCell align="center">19</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2" color="primary">
                            Reading
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Comprehension & Speed
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '80' : selectedLevel === 'N2' ? '75' : '70'} min
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '35' : selectedLevel === 'N2' ? '30' : '25'} questions
                        </TableCell>
                        <TableCell align="center">60</TableCell>
                        <TableCell align="center">19</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2" color="primary">
                            Listening
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Comprehension & Response
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '45' : selectedLevel === 'N2' ? '40' : '35'} min
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '30' : selectedLevel === 'N2' ? '25' : '20'} questions
                        </TableCell>
                        <TableCell align="center">60</TableCell>
                        <TableCell align="center">19</TableCell>
                      </TableRow>
                      <TableRow className={styles.totalRow}>
                        <TableCell>Total</TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '170' : selectedLevel === 'N2' ? '155' : '140'} min
                        </TableCell>
                        <TableCell align="center">
                          {selectedLevel === 'N1' ? '105' : selectedLevel === 'N2' ? '90' : '75'} questions
                        </TableCell>
                        <TableCell align="center">180</TableCell>
                        <TableCell align="center">110</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Important Notes:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  You must pass each section individually to pass the exam
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Missing any section results in automatic failure
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Scores are scaled using equalization
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Required Language Skills Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
              Required Language Skills
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Skill</TableCell>
                  <TableCell align="center" sx={{ color: 'white' }}>Required Level</TableCell>
                  <TableCell sx={{ color: 'white' }}>Examples</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Kanji Recognition
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Character reading & writing
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {selectedLevel === 'N1' ? '2000+' : 
                     selectedLevel === 'N2' ? '1000+' :
                     selectedLevel === 'N3' ? '650+' :
                     selectedLevel === 'N4' ? '300+' : '100+'} characters
                  </TableCell>
                  <TableCell>
                    <span className={styles.japaneseText}>
                      {selectedLevel === 'N1' ? '読解、規制、概要' : 
                       selectedLevel === 'N2' ? '説明、経験、結果' :
                       selectedLevel === 'N3' ? '写真、歩道、病院' :
                       selectedLevel === 'N4' ? '会社、食堂、電車' : '日本、学校、先生'}
                    </span>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {selectedLevel === 'N1' ? 'Reading comprehension, regulation, overview' : 
                       selectedLevel === 'N2' ? 'Explanation, experience, result' :
                       selectedLevel === 'N3' ? 'Photo, sidewalk, hospital' :
                       selectedLevel === 'N4' ? 'Company, cafeteria, train' : 'Japan, school, teacher'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Vocabulary
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Words & expressions
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {selectedLevel === 'N1' ? '10000+' : 
                     selectedLevel === 'N2' ? '6000+' :
                     selectedLevel === 'N3' ? '3750+' :
                     selectedLevel === 'N4' ? '1500+' : '800+'} words
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {selectedLevel === 'N1' ? 'Academic & specialized vocabulary, abstract concepts' : 
                       selectedLevel === 'N2' ? 'Business terms, current events, social issues' :
                       selectedLevel === 'N3' ? 'Daily life vocabulary, basic business terms' :
                       selectedLevel === 'N4' ? 'Basic daily conversation, simple descriptions' : 'Simple greetings, basic needs, numbers'}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      Grammar Points
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sentence patterns & usage
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {selectedLevel === 'N1' ? '200+' : 
                     selectedLevel === 'N2' ? '150+' :
                     selectedLevel === 'N3' ? '100+' :
                     selectedLevel === 'N4' ? '50+' : '30+'} patterns
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {selectedLevel === 'N1' ? 'Complex subordinate clauses, formal writing styles' : 
                       selectedLevel === 'N2' ? 'Honorifics, causative-passive forms, advanced conditionals' :
                       selectedLevel === 'N3' ? 'Te-form variations, potential form, basic honorifics' :
                       selectedLevel === 'N4' ? 'Basic conjugations, te-form, simple requests' : 'Basic particles, present/past tense, simple questions'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          {/* Study Hours Chart */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
              Study Hours by Level
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Estimated hours needed to pass each JLPT level from zero knowledge
            </Typography>
            <StudyHoursChart level={selectedLevel} />
            <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, display: 'block' }}>
              Note: Actual hours may vary based on your native language, prior Japanese knowledge, and study methods
            </Typography>
          </Box>

          {/* Study Strategy Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom align="center">
              Recommended Study Strategy
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      3-6 Months Before
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Master Core Content"
                          secondary="Focus on required kanji, vocabulary, and grammar points"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Build Reading Speed"
                          secondary="Practice reading Japanese texts daily"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Regular Listening"
                          secondary="Watch Japanese media with subtitles"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      1-3 Months Before
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Practice Tests"
                          secondary="Take full-length practice exams under timed conditions"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Review Weak Areas"
                          secondary="Focus on sections where you score lowest"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Time Management"
                          secondary="Practice completing sections within time limits"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Final Month
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Mock Exams"
                          secondary="Complete 2-3 full practice tests"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Quick Reviews"
                          secondary="Use flashcards for rapid content review"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Test Strategy"
                          secondary="Practice question types you find challenging"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Sign Up CTA */}
          <Box 
            sx={{ 
              mt: 8,
              mb: 4,
              py: 8,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Start Your JLPT Journey Today
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Get a personalized study plan and track your progress with JLPT Professor
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  color: 'white',
                  bgcolor: 'primary.dark'
                }
              }}
              href="/signup"
            >
              Create Free Account
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No credit card required
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
