'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: '0.9375rem',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
};

export function getTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: isDark ? '#e94560' : '#1a1a2e',
        light: isDark ? '#ff6b81' : '#16213e',
        dark: isDark ? '#c0392b' : '#0f3460',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#16213e' : '#e94560',
        light: isDark ? '#1a1a2e' : '#ff6b81',
        dark: isDark ? '#0f3460' : '#c0392b',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0a0a0a' : '#f8f9fa',
        paper: isDark ? '#111111' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f5f5f5' : '#1a1a2e',
        secondary: isDark ? '#a0a0a0' : '#6c757d',
      },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      ...sharedComponents,
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: isDark
                ? '0 10px 40px rgba(0,0,0,0.3)'
                : '0 10px 40px rgba(0,0,0,0.08)',
            },
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
}
