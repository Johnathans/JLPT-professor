import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Logo component for JLPT Professor
 * 
 * Uses a custom SVG logo with configurable color (defaults to white)
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 24, 
  className, 
  color = 'white'
}) => {
  return (
    <div 
      className={className} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <Image 
        src="/assets/logo.svg"
        alt="JLPT Professor Logo" 
        width={size} 
        height={size}
        style={{ 
          filter: color === 'white' ? 'none' : `brightness(0) saturate(100%) ${getColorFilter(color)}`,
          objectFit: 'contain',
          objectPosition: 'center'
        }}
      />
    </div>
  );
};

// Helper function to convert color names to CSS filters
function getColorFilter(color: string): string {
  switch (color.toLowerCase()) {
    case 'purple':
    case '#7c4dff':
      return 'invert(32%) sepia(93%) saturate(7466%) hue-rotate(254deg) brightness(101%) contrast(108%)';
    case 'orange':
    case '#ff9100':
      return 'invert(56%) sepia(86%) saturate(1096%) hue-rotate(360deg) brightness(103%) contrast(105%)';
    case 'teal':
    case '#00bfa5':
      return 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(155deg) brightness(97%) contrast(101%)';
    case 'black':
      return 'invert(0%) sepia(0%) saturate(0%) hue-rotate(324deg) brightness(96%) contrast(104%)';
    default:
      return ''; // Default is white (no filter)
  }
}

export default Logo;
