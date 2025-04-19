import { School as SchoolIcon } from '@mui/icons-material';
import { Box } from '@mui/material';

interface BrandLogoProps {
  size?: number;
}

export default function BrandLogo({ size = 40 }: BrandLogoProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#7c4dff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <SchoolIcon sx={{ fontSize: size * 0.6 }} />
    </Box>
  );
}
