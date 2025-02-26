//Libraries
import { useMemo } from 'react';
import { createTheme } from '@mui/material';

//Context
import { useThemeProvider } from '../context/ThemeContext.jsx';

const useTableTheme = () => {
  const { currentTheme } = useThemeProvider();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: currentTheme === 'dark' ? 'dark' : 'light',
          background: {
            default: currentTheme === 'dark' ? '#1f2937' : '#fff',
          },
        },
        typography: {
          button: {
            textTransform: 'none',
            fontSize: '1rem',
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: '12px',
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: currentTheme === 'dark' ? 'white' : '',
              },
            },
          },
        },
      }),
    [currentTheme]
  );

  return tableTheme;
};

export default useTableTheme;
