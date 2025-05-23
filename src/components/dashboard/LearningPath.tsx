import { Box, Card, Typography, Button, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import styles from '@/app/dashboard/page.module.css';

const mockBlocks = [
  { id: 1, title: 'Basic Greetings', progress: 100, completed: true },
  { id: 2, title: 'Numbers & Counting', progress: 60, completed: false },
  { id: 3, title: 'Daily Activities', progress: 0, completed: false },
  { id: 4, title: 'Basic Adjectives', progress: 0, completed: false },
  // Add more mock data as needed
];

export default function LearningPath() {
  return (
    <div className={styles.gridContainer}>
      {mockBlocks.map((block) => (
        <Card key={block.id} className={styles.card}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {block.title}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={block.progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: block.completed ? '#4caf50' : '#7c4dff',
                }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {block.progress}% Complete
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<PlayArrowIcon />}
              size="small"
              sx={{ 
                bgcolor: '#7c4dff',
                '&:hover': {
                  bgcolor: '#6b42e0'
                }
              }}
            >
              {block.progress > 0 ? 'Continue' : 'Start'}
            </Button>
          </Box>
        </Card>
      ))}
    </div>
  );
}
