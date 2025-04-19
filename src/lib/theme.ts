import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7c4dff',
      light: '#e8e3ff',
      dark: '#5e35b1',
    },
    secondary: {
      main: '#ff9100',
      light: '#ffd180',
    },
    success: {
      main: '#00bfa5', // accent color
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d2d2d',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      color: '#2d2d2d',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
          border: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&.Mui-selected': {
            color: '#7c4dff',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#7c4dff',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#e8e3ff',
            '&:hover': {
              backgroundColor: '#e8e3ff',
            },
          },
        },
      },
    },
  },
});
