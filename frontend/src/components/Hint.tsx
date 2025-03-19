import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Lightbulb } from '@mui/icons-material';
import axios from 'axios';

interface HintProps {
  currentGuess: string;
  previousGuesses: string[];
  feedback: Array<Array<'correct' | 'present' | 'absent' | 'empty'>>;
  onHintUsed: () => void;
  disabled: boolean;
}

const Hint: React.FC<HintProps> = ({
  currentGuess,
  previousGuesses,
  feedback,
  onHintUsed,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);

  const generateHint = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/hint', {
        currentGuess,
        previousGuesses,
        feedback,
      });
      setHint(response.data.hint);
      onHintUsed();
    } catch (error) {
      setHint('Unable to generate hint. Please try again.');
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(true);
    generateHint();
  };

  const handleClose = () => {
    setOpen(false);
    setHint('');
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Lightbulb />}
        onClick={handleOpen}
        disabled={disabled}
      >
        Get Hint
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>AI Hint</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography>{hint}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Hint; 