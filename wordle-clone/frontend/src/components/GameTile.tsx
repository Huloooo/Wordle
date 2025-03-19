import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GameTileProps {
  letter: string;
  feedback: string;
  isActive: boolean;
  shouldShake?: boolean;
}

interface TileProps {
  feedback: string;
  isActive: boolean;
  shouldShake?: boolean;
}

const Tile = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'feedback' && prop !== 'isActive' && prop !== 'shouldShake'
})<TileProps>(({ feedback, isActive, shouldShake }) => ({
  width: '62px',
  height: '62px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  backgroundColor: isActive ? 'transparent' : 
    feedback === 'correct' ? '#538d4e' :
    feedback === 'present' ? '#b59f3b' :
    feedback === 'absent' ? '#3a3a3c' : '#121213',
  border: `2px solid ${isActive ? '#565758' : 'transparent'}`,
  color: '#ffffff',
  fontFamily: '"Press Start 2P", monospace',
  imageRendering: 'pixelated',
  animation: shouldShake ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none',
  '@keyframes shake': {
    '10%, 90%': {
      transform: 'translate3d(-1px, 0, 0)',
    },
    '20%, 80%': {
      transform: 'translate3d(2px, 0, 0)',
    },
    '30%, 50%, 70%': {
      transform: 'translate3d(-4px, 0, 0)',
    },
    '40%, 60%': {
      transform: 'translate3d(4px, 0, 0)',
    },
  },
}));

const GameTile: React.FC<GameTileProps> = ({ letter, feedback, isActive, shouldShake }) => {
  return (
    <Tile feedback={feedback} isActive={isActive} shouldShake={shouldShake}>
      {letter}
    </Tile>
  );
};

export default GameTile; 