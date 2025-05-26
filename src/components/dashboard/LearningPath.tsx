import { Box, Typography, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import styles from '@/app/dashboard/page.module.css';

const units = [
  { 
    id: 1, 
    title: 'Basic Greetings',
    wordCount: 25,
    completed: true,
    started: true
  },
  { 
    id: 2, 
    title: 'Daily Life',
    wordCount: 40,
    completed: false,
    started: false
  },
  { 
    id: 3, 
    title: 'Travel & Transport',
    wordCount: 35,
    completed: false,
    started: false
  },
  { 
    id: 4, 
    title: 'Food & Dining',
    wordCount: 30,
    completed: false,
    started: false
  }
];

export default function LearningPath() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '8px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          backgroundColor: '#e0e0e0',
          zIndex: 0
        }
      }}>
        {units.map((unit, index) => (
          <Box
            key={unit.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 3,
              position: 'relative',
              pl: 4
            }}
          >
            {/* Timeline Node */}
            <Box
              sx={{
                position: 'absolute',
                left: '4px',
                top: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: unit.started ? '#2dde98' : 'white',
                border: '2px solid',
                borderColor: unit.started ? '#2dde98' : '#e0e0e0',
                zIndex: 1
              }}
            />

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography 
                sx={{ 
                  color: '#666',
                  fontSize: '0.875rem',
                  mb: 1
                }}
              >
                Unit {String(index + 1).padStart(2, '0')}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#1a1a1a',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  mb: 1.5
                }}
              >
                {unit.title}
              </Typography>

              <Typography
                sx={{
                  color: '#666',
                  fontSize: '0.875rem',
                  mb: 2
                }}
              >
                {unit.wordCount} words with example sentences and audio
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MenuBookIcon sx={{ 
                  color: unit.started ? '#2dde98' : '#666',
                  fontSize: '1.25rem'
                }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: unit.started ? '#2dde98' : '#666',
                    borderColor: unit.started ? '#2dde98' : '#e0e0e0',
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    py: 1,
                    minWidth: '120px',
                    '&:hover': {
                      borderColor: '#2dde98',
                      color: '#2dde98',
                      backgroundColor: 'rgba(45, 222, 152, 0.04)'
                    }
                  }}
                >
                  {unit.started ? 'Continue' : 'Start Unit'}
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
