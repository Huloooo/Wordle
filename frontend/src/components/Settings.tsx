import React from 'react';
import {
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Slider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEmotions,
  Speed,
  Mic,
  Lightbulb,
  Palette,
  Vibration,
} from '@mui/icons-material';

interface SettingsProps {
  emojiMode: boolean;
  hardcoreMode: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: string;
  hintCount: number;
  onSettingChange: (setting: string, value: any) => void;
}

const Settings: React.FC<SettingsProps> = ({
  emojiMode,
  hardcoreMode,
  soundEnabled,
  hapticEnabled,
  theme,
  hintCount,
  onSettingChange,
}) => {
  const handleThemeChange = () => {
    const themes = ['default', 'retro', 'dark', 'light'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    onSettingChange('theme', nextTheme);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Game Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={emojiMode}
              onChange={(e) => onSettingChange('emojiMode', e.target.checked)}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmojiEmotions />
              <Typography>Emoji Mode</Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={hardcoreMode}
              onChange={(e) => onSettingChange('hardcoreMode', e.target.checked)}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed />
              <Typography>Hardcore Mode</Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={soundEnabled}
              onChange={(e) => onSettingChange('soundEnabled', e.target.checked)}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mic />
              <Typography>Sound Effects</Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={hapticEnabled}
              onChange={(e) => onSettingChange('hapticEnabled', e.target.checked)}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Vibration />
              <Typography>Haptic Feedback</Typography>
            </Box>
          }
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Lightbulb />
          <Typography>AI Hints Remaining: {hintCount}/3</Typography>
        </Box>

        <Tooltip title="Change Theme">
          <IconButton onClick={handleThemeChange}>
            <Palette />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Settings; 