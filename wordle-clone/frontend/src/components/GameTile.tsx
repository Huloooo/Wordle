import React from 'react';
import { Box, Typography } from '@mui/material';

interface GameTileProps {
  letter: string;
  feedback: string;
  isActive: boolean;
}

const GameTile: React.FC<GameTileProps> = ({ letter, feedback, isActive }) => {
  const getBackgroundColor = () => {
    switch (feedback) {
      case 'correct':
        return '#538d4e';
      case 'present':
        return '#b59f3b';
      case 'absent':
        return '#3a3a3c';
      default:
        return isActive ? '#121213' : '#2d2d2d';
    }
  };

  const getBorderColor = () => {
    if (feedback) return 'transparent';
    return isActive ? '#565758' : '#3a3a3c';
  };

  return (
    <Box
      sx={{
        width: 62,
        height: 62,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getBackgroundColor(),
        border: `2px solid ${getBorderColor()}`,
        borderRadius: 1,
        transition: 'all 0.2s ease-in-out',
        animation: feedback ? 'flip 0.5s ease-in-out' : 'none',
        '@keyframes flip': {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {letter}
      </Typography>
    </Box>
  );
};

export default GameTile; 