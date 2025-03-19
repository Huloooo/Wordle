import React from 'react';
import { Box, Button, Grid } from '@mui/material';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters?: { [key: string]: 'correct' | 'present' | 'absent' };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, usedLetters = {} }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyColor = (key: string) => {
    const letter = key === 'BACKSPACE' ? 'BACKSPACE' : key;
    const status = usedLetters[letter];
    
    switch (status) {
      case 'correct':
        return '#538d4e';
      case 'present':
        return '#b59f3b';
      case 'absent':
        return '#3a3a3c';
      default:
        return '#818384';
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {rows.map((row, rowIndex) => (
        <Grid 
          container 
          key={rowIndex} 
          spacing={1} 
          justifyContent="center"
          sx={{ 
            mb: 1,
            '&:last-child': { mb: 0 }
          }}
        >
          {row.map((key, keyIndex) => (
            <Grid item key={keyIndex}>
              <Button
                variant="contained"
                onClick={() => onKeyPress(key)}
                sx={{
                  width: key === 'ENTER' || key === 'BACKSPACE' ? '65px' : '40px',
                  height: '58px',
                  backgroundColor: getKeyColor(key),
                  color: '#ffffff',
                  fontSize: key === 'ENTER' || key === 'BACKSPACE' ? '1rem' : '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: getKeyColor(key),
                    filter: 'brightness(1.1)',
                  },
                  imageRendering: 'pixelated',
                  fontFamily: '"Press Start 2P", monospace',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                  border: '2px solid rgba(255,255,255,0.1)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease-in-out',
                  padding: '0 8px',
                  margin: '0 2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default Keyboard; 