import React from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Button } from '@mui/material';

interface SettingsProps {
  hardcoreMode: boolean;
  onHardcoreModeChange: (value: boolean) => void;
  onNewGame: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  hardcoreMode,
  onHardcoreModeChange,
  onNewGame,
}) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={hardcoreMode}
              onChange={(e) => onHardcoreModeChange(e.target.checked)}
              color="primary"
            />
          }
          label="Hardcore Mode"
        />
      </FormGroup>
      <Button
        variant="contained"
        onClick={onNewGame}
        sx={{
          backgroundColor: '#538d4e',
          '&:hover': {
            backgroundColor: '#4a7c44',
          },
        }}
      >
        New Game
      </Button>
    </Box>
  );
};

export default Settings; 