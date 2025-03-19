import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Alert } from '@mui/material';
import GameTile from './GameTile';
import Keyboard from './Keyboard';
import Settings from './Settings';

const API_BASE_URL = 'http://localhost:5001';

interface GameState {
  targetWord: string;
  currentGuess: string;
  guesses: string[];
  feedback: string[][];
  gameOver: boolean;
  won: boolean;
  error: string;
  hardcoreMode: boolean;
  usedLetters: { [key: string]: 'correct' | 'present' | 'absent' };
}

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    currentGuess: '',
    guesses: [],
    feedback: [],
    gameOver: false,
    won: false,
    error: '',
    hardcoreMode: false,
    usedLetters: {}
  });

  const startNewGame = async () => {
    try {
      console.log('Starting new game...');
      const response = await fetch(`${API_BASE_URL}/api/word`);
      if (!response.ok) {
        throw new Error('Failed to start new game');
      }
      const data = await response.json();
      console.log('Received word:', data.word);
      
      setGameState((prev: GameState) => {
        const newState = {
          ...prev,
          currentGuess: '',
          guesses: [],
          feedback: [],
          gameOver: false,
          won: false,
          targetWord: data.word,
          error: '',
          usedLetters: {}
        };
        console.log('New game state:', newState);
        return newState;
      });
    } catch (error) {
      console.error('Error starting new game:', error);
      setGameState((prev: GameState) => ({
        ...prev,
        error: 'Failed to start new game. Please try again.',
      }));
    }
  };

  useEffect(() => {
    startNewGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.currentGuess, gameState.gameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUsedLetters = (guess: string, feedback: string[]) => {
    const newUsedLetters = { ...gameState.usedLetters };
    guess.split('').forEach((letter, index) => {
      const currentStatus = newUsedLetters[letter];
      const newStatus = feedback[index];
      
      // Only update if the new status is better than the current one
      if (!currentStatus || 
          (currentStatus === 'absent' && newStatus !== 'absent') ||
          (currentStatus === 'present' && newStatus === 'correct')) {
        newUsedLetters[letter] = newStatus as 'correct' | 'present' | 'absent';
      }
    });
    
    setGameState((prev: GameState) => ({ ...prev, usedLetters: newUsedLetters }));
  };

  const handleKeyPress = async (key: string) => {
    if (gameState.gameOver) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== 5) {
        setGameState((prev: GameState) => ({ ...prev, error: 'Word must be 5 letters long' }));
        return;
      }

      try {
        console.log('Submitting guess:', gameState.currentGuess);
        const response = await fetch(`${API_BASE_URL}/api/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: gameState.currentGuess,
            target: gameState.targetWord,
            hardcore_mode: gameState.hardcoreMode,
            previous_guesses: gameState.guesses,
            previous_feedback: gameState.feedback
          }),
        });

        const data = await response.json();
        console.log('Received response:', data);
        
        if (!response.ok) {
          setGameState((prev: GameState) => ({ ...prev, error: data.error }));
          return;
        }

        const newFeedback = data.feedback;
        updateUsedLetters(gameState.currentGuess, newFeedback);

        const isGameOver = data.is_correct || gameState.guesses.length >= 5;
        
        setGameState((prev: GameState) => ({
          ...prev,
          guesses: [...prev.guesses, prev.currentGuess],
          feedback: [...prev.feedback, newFeedback],
          currentGuess: '',
          error: '',
          gameOver: isGameOver,
          won: data.is_correct
        }));

        if (isGameOver) {
          // Save score
          await fetch(`${API_BASE_URL}/api/save-score`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              score: gameState.guesses.length + 1,
              word: gameState.targetWord,
            }),
          });
        }
      } catch (error) {
        console.error('Error checking word:', error);
        setGameState((prev: GameState) => ({ ...prev, error: 'Failed to check word. Please try again.' }));
      }
    } else if (key === 'BACKSPACE') {
      setGameState((prev: GameState) => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
        error: ''
      }));
    } else if (gameState.currentGuess.length < 5) {
      setGameState((prev: GameState) => ({
        ...prev,
        currentGuess: prev.currentGuess + key,
        error: ''
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          my: 4,
          background: 'rgba(18, 18, 19, 0.95)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          imageRendering: 'pixelated',
          fontFamily: '"Press Start 2P", monospace',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '2px',
            fontWeight: 'bold',
            fontSize: '2.5rem',
            fontFamily: '"Press Start 2P", monospace',
            imageRendering: 'pixelated',
            marginBottom: '1.5rem',
          }}
        >
          WORDLE
        </Typography>
        
        <Settings
          hardcoreMode={gameState.hardcoreMode}
          onHardcoreModeChange={(value: boolean) => setGameState((prev: GameState) => ({ ...prev, hardcoreMode: value }))}
          onNewGame={startNewGame}
        />

        {gameState.error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              imageRendering: 'pixelated',
              '& .MuiAlert-icon': {
                imageRendering: 'pixelated',
              }
            }}
          >
            {gameState.error}
          </Alert>
        )}

        <Grid container spacing={1} sx={{ mb: 4 }}>
          {[...Array(6)].map((_, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                {[...Array(5)].map((_, colIndex) => {
                  const guess = gameState.guesses[rowIndex] || '';
                  const letter = rowIndex === gameState.guesses.length
                    ? gameState.currentGuess[colIndex] || ''
                    : guess[colIndex] || '';
                  const feedback = gameState.feedback[rowIndex]?.[colIndex] || '';

                  return (
                    <GameTile
                      key={colIndex}
                      letter={letter}
                      feedback={feedback}
                      isActive={rowIndex === gameState.guesses.length}
                    />
                  );
                })}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Keyboard 
          onKeyPress={handleKeyPress} 
          usedLetters={gameState.usedLetters}
        />

        {gameState.gameOver && (
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center',
            background: 'rgba(0,0,0,0.8)',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(5px)',
          }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: gameState.won ? '#538d4e' : '#c03d3d',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                imageRendering: 'pixelated',
                fontSize: '2rem',
                marginBottom: '1rem',
              }}
            >
              {gameState.won ? 'You Win! 🎉' : 'You Lose! 😢'}
            </Typography>
            {!gameState.won && (
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  imageRendering: 'pixelated',
                  fontSize: '1.2rem',
                  marginBottom: '1.5rem',
                }}
              >
                The word was: <span style={{ color: '#538d4e', fontWeight: 'bold' }}>{gameState.targetWord}</span>
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={startNewGame}
              sx={{
                mt: 2,
                backgroundColor: gameState.won ? '#538d4e' : '#c03d3d',
                '&:hover': {
                  backgroundColor: gameState.won ? '#4a7c44' : '#a33232',
                },
                fontSize: '1.2rem',
                padding: '10px 30px',
                imageRendering: 'pixelated',
                fontFamily: '"Press Start 2P", monospace',
                textTransform: 'none',
              }}
            >
              Play Again
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GameBoard; 