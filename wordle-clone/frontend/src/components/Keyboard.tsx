import React from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: { [key: string]: 'correct' | 'present' | 'absent' };
}

const Key = styled(Button)(({ status }: { status?: 'correct' | 'present' | 'absent' }) => ({
  minWidth: '40px',
  height: '58px',
  padding: '0 8px',
  margin: '0 3px',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  backgroundColor: status === 'correct' ? '#538d4e' :
                  status === 'present' ? '#b59f3b' :
                  status === 'absent' ? '#3a3a3c' : '#818384',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: status === 'correct' ? '#4a7c44' :
                    status === 'present' ? '#a18f35' :
                    status === 'absent' ? '#2d2d2f' : '#6b6c6d',
  },
  fontFamily: '"Press Start 2P", monospace',
  imageRendering: 'pixelated',
}));

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, usedLetters }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', justifyContent: 'center' }}>
          {row.map((key, keyIndex) => (
            <Key
              key={keyIndex}
              onClick={() => onKeyPress(key)}
              status={usedLetters[key]}
              sx={{
                minWidth: key === 'ENTER' || key === 'BACKSPACE' ? '65px' : '40px',
                fontSize: key === 'ENTER' || key === 'BACKSPACE' ? '0.8rem' : '1.25rem',
              }}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </Key>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default Keyboard; 