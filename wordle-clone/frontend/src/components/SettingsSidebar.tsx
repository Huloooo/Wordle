import React from 'react';
import { Box, Typography, Slider, IconButton, Drawer, Switch, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';

interface SettingsSidebarProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  hardcoreMode: boolean;
  onHardcoreModeChange: (value: boolean) => void;
  onNewGame: () => void;
}

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    width: 300,
    backgroundColor: '#1a1a1b',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    padding: '20px',
    color: '#ffffff',
  },
});

const SettingsButton = styled(IconButton)({
  position: 'fixed',
  right: '20px',
  top: '20px',
  backgroundColor: 'rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  color: '#ffffff',
  zIndex: 1000,
});

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  volume,
  onVolumeChange,
  hardcoreMode,
  onHardcoreModeChange,
  onNewGame,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <SettingsButton onClick={handleDrawerOpen}>
        <SettingsIcon />
      </SettingsButton>

      <StyledDrawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        variant="temporary"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '1rem',
              color: '#ffffff'
            }}
          >
            Settings
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}
          >
            Sound Volume
          </Typography>
          <Slider
            value={volume}
            onChange={(_, value) => onVolumeChange(value as number)}
            min={0}
            max={1}
            step={0.1}
            sx={{
              color: '#538d4e',
              '& .MuiSlider-thumb': {
                backgroundColor: '#ffffff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(83, 141, 78, 0.16)',
                },
                '&.Mui-active': {
                  boxShadow: '0 0 0 14px rgba(83, 141, 78, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.8rem',
              color: '#ffffff'
            }}
          >
            Game Mode
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.8rem',
                color: '#ffffff'
              }}
            >
              Hardcore Mode
            </Typography>
            <Switch
              checked={hardcoreMode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onHardcoreModeChange(e.target.checked)}
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
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            onNewGame();
            handleDrawerClose();
          }}
          sx={{
            backgroundColor: '#538d4e',
            '&:hover': {
              backgroundColor: '#4a7c44',
            },
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.8rem',
            padding: '8px 16px',
            textTransform: 'none',
            width: '100%',
          }}
        >
          New Game
        </Button>
      </StyledDrawer>
    </>
  );
};

export default SettingsSidebar; 