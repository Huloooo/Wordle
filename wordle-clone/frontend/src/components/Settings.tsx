import React from 'react';
import { Box, Switch, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface SettingsProps {
  hardcoreMode: boolean;
  onHardcoreModeChange: (value: boolean) => void;
  onNewGame: () => void;
}

const StyledButton = styled(Button)({
  backgroundColor: '#538d4e',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#4a7c44',
  },
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '0.8rem',
  padding: '8px 16px',
  textTransform: 'none',
  imageRendering: 'pixelated',
});

const Settings: React.FC<SettingsProps> = ({
  hardcoreMode,
  onHardcoreModeChange,
  onNewGame,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Switch
          checked={hardcoreMode}
          onChange={(e) => onHardcoreModeChange(e.target.checked)}
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: '#ffffff',
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#ffffff',
            },
            '& .Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#538d4e',
            },
            '& .Mui-checked .MuiSwitch-thumb': {
              backgroundColor: '#ffffff',
            },
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#ffffff',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.8rem',
            imageRendering: 'pixelated',
          }}
        >
          Hardcore Mode
        </Typography>
      </Box>
      <StyledButton onClick={onNewGame}>
        New Game
      </StyledButton>
    </Box>
  );
};

export default Settings; 