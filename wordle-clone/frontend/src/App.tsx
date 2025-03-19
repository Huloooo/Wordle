import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import GameBoard from './components/GameBoard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121213',
      paper: '#1a1a1b',
    },
  },
  typography: {
    fontFamily: '"Arial", "Helvetica", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameBoard />
    </ThemeProvider>
  );
}

export default App;
