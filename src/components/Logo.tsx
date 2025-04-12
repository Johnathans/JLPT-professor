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
}

/**
 * Logo component for JLPT Professor
 * 
 * Uses the Material UI School icon in white
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 40
}) => {
  return (
    <LogoWrapper style={{ width: size, height: size, backgroundColor: '#7c4dff' }}>
      <SchoolIcon />
    </LogoWrapper>
  );
};

export default Logo;
