import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Settings from './Settings';
import VoiceInput from './VoiceInput';
import Hint from './Hint';

interface TileProps {
  letter: string;
  status: 'correct' | 'present' | 'absent' | 'empty';
  isActive: boolean;
}

const Tile: React.FC<TileProps> = ({ letter, status, isActive }) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'correct':
        return '#538d4e';
      case 'present':
        return '#b59f3b';
      case 'absent':
        return '#3a3a3c';
      default:
        return isActive ? '#121213' : '#818384';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        sx={{
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getBackgroundColor(),
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          cursor: 'default',
        }}
      >
        {letter}
      </Paper>
    </motion.div>
  );
};

const GameBoard: React.FC = () => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Array<Array<'correct' | 'present' | 'absent' | 'empty'>>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState('');
  
  // Game settings
  const [emojiMode, setEmojiMode] = useState(false);
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [theme, setTheme] = useState('default');
  const [hintCount, setHintCount] = useState(3);

  useEffect(() => {
    fetchNewWord();
  }, [emojiMode]);

  const fetchNewWord = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/word?emoji_mode=${emojiMode}`);
      setTargetWord(response.data.word);
    } catch (err) {
      setError('Failed to fetch word');
    }
  };

  const handleKeyPress = async (event: KeyboardEvent) => {
    if (gameOver) return;

    if (event.key === 'Enter' && currentGuess.length === 5) {
      try {
        const response = await axios.post('http://localhost:5000/api/check', {
          guess: currentGuess,
          target: targetWord,
          hardcore_mode: hardcoreMode,
          previous_guesses: guesses,
          previous_feedback: feedback,
        });

        const newFeedback = response.data.feedback;
        setFeedback([...feedback, newFeedback]);
        setGuesses([...guesses, currentGuess]);

        // Play sound effect if enabled
        if (soundEnabled) {
          const audio = new Audio('/sounds/keypress.mp3');
          audio.play().catch(() => {});
        }

        // Trigger haptic feedback if enabled
        if (hapticEnabled && navigator.vibrate) {
          navigator.vibrate(50);
        }

        if (response.data.is_correct) {
          setGameOver(true);
          saveScore(guesses.length + 1);
        } else if (guesses.length >= 5) {
          setGameOver(true);
          saveScore(6);
        }

        setCurrentGuess('');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Invalid word');
      }
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + event.key.toUpperCase());
    }
  };

  const handleVoiceInput = (word: string) => {
    setCurrentGuess(word);
  };

  const handleHintUsed = () => {
    setHintCount(prev => prev - 1);
  };

  const handleSettingChange = (setting: string, value: any) => {
    switch (setting) {
      case 'emojiMode':
        setEmojiMode(value);
        break;
      case 'hardcoreMode':
        setHardcoreMode(value);
        break;
      case 'soundEnabled':
        setSoundEnabled(value);
        break;
      case 'hapticEnabled':
        setHapticEnabled(value);
        break;
      case 'theme':
        setTheme(value);
        break;
      default:
        break;
    }
  };

  const saveScore = async (score: number) => {
    try {
      await axios.post('http://localhost:5000/api/save-score', {
        player: 'anonymous',
        score,
        word: targetWord,
      });
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, guesses, gameOver, hardcoreMode]);

  const renderRow = (guess: string, rowIndex: number) => {
    const rowFeedback = feedback[rowIndex] || Array(5).fill('empty');
    return (
      <Grid container spacing={1} justifyContent="center" key={rowIndex}>
        {Array(5).fill(null).map((_, colIndex) => (
          <Grid item key={colIndex}>
            <Tile
              letter={guess[colIndex] || ''}
              status={rowFeedback[colIndex]}
              isActive={rowIndex === guesses.length}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Wordle Clone
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <Box sx={{ mb: 3 }}>
              {Array(6).fill(null).map((_, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  {renderRow(guesses[index] || currentGuess, index)}
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <VoiceInput
                onWordGuessed={handleVoiceInput}
                disabled={gameOver}
              />
              <Hint
                currentGuess={currentGuess}
                previousGuesses={guesses}
                feedback={feedback}
                onHintUsed={handleHintUsed}
                disabled={gameOver || hintCount <= 0}
              />
            </Box>
            
            {gameOver && (
              <Typography variant="h6">
                {guesses[guesses.length - 1] === targetWord ? 'Congratulations!' : 'Game Over!'}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Settings
              emojiMode={emojiMode}
              hardcoreMode={hardcoreMode}
              soundEnabled={soundEnabled}
              hapticEnabled={hapticEnabled}
              theme={theme}
              hintCount={hintCount}
              onSettingChange={handleSettingChange}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GameBoard; 