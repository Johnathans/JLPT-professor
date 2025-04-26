'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import { School as SchoolIcon } from '@mui/icons-material';

const LogoWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '12px',
  backgroundColor: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    color: 'white',
    fontSize: '1.5rem'
  }
}));

interface LogoProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Logo component for JLPT Professor
 * 
 * Uses the Material UI School icon in white
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 40,
  className,
  color = '#7c4dff'
}) => {
  return (
    <LogoWrapper className={className} style={{ width: size, height: size, backgroundColor: color }}>
      <SchoolIcon />
    </LogoWrapper>
  );
};

export default Logo;
