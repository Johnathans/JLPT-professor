import React, { useState, useRef } from 'react';
import { IconButton, LinearProgress, Box } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PlayerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const Progress = styled(LinearProgress)(({ theme }) => ({
  flexGrow: 1,
  height: 4,
  borderRadius: 2,
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface AudioPlayerProps {
  src: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  onComplete,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    onComplete?.();
  };

  return (
    <PlayerContainer>
      <IconButton 
        onClick={togglePlay}
        size="small"
        sx={{ 
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
          }
        }}
      >
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      
      <Progress variant="determinate" value={progress} />
      
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        autoPlay={autoPlay}
      />
    </PlayerContainer>
  );
};

export default AudioPlayer;
