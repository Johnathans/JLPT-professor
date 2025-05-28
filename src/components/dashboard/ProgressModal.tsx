'use client';

import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card,
  IconButton
} from '@mui/material';
import { X, Book, RefreshCw, Edit3 } from 'react-feather';
import Link from 'next/link';

interface ProgressModalProps {
  open: boolean;
  onClose: () => void;
  level: string;
  progress: number;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  open,
  onClose,
  level,
  progress
}) => {
    const sections = [
    {
      title: 'Vocabulary',
      icon: Book,
      href: `/progress/${level.toLowerCase()}/vocabulary`
    },
    {
      title: 'Kanji',
      icon: Edit3,
      href: `/progress/${level.toLowerCase()}/kanji`
    },
    {
      title: 'Grammar',
      icon: RefreshCw,
      href: `/progress/${level.toLowerCase()}/grammar`
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#FFFFFF',
          maxWidth: '600px',
          mx: 'auto',
          '& .MuiDialogContent-root': {
            p: { xs: 3, sm: 4 }
          }
        }
      }}
    >
      <DialogTitle 
        component="div"
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        <Typography 
          component="h2"
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontFamily: 'Poppins'
          }}
        >
          {level} Progress
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Overall Progress Circle */}
        <Box sx={{ 
          position: 'relative',
          mb: 4,
          mt: 2,
          height: '240px'
        }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={160}
            thickness={4}
            sx={{ 
              color: 'rgba(89, 206, 143, 0.12)', 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={160}
            thickness={4}
            sx={{ 
              color: '#27cc56', 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <Box sx={{ 
            position: 'absolute', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 800,
              color: '#000000',
              fontSize: '3rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              mb: -0.5
            }}>
              {progress}%
            </Typography>
            <Typography sx={{ 
              color: '#666666',
              mt: 1,
              fontSize: '0.875rem',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}>
              Complete
            </Typography>
          </Box>
        </Box>

        {/* Progress Cards */}
        <Box sx={{ width: '100%', px: 3 }}>
          <Grid container spacing={2}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Grid item xs={12} sm={4} key={section.title}>
                  <Link href={section.href} style={{ textDecoration: 'none' }}>
                    <Card sx={{
                      py: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid rgba(89, 206, 143, 0.2)',
                      boxShadow: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#27cc56',
                        backgroundColor: 'rgba(89, 206, 143, 0.05)'
                      }
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Icon size={24} color="#27cc56" />
                        <Typography sx={{ 
                          fontWeight: 600,
                          color: '#000000',
                          fontSize: '0.875rem'
                        }}>
                          {section.title}
                        </Typography>
                      </Box>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;
