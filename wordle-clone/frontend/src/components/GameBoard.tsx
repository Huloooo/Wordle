import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Grid, Button, Alert, Paper, FormControlLabel } from '@mui/material';
import GameTile from './GameTile';
import Keyboard from './Keyboard';
import Settings from './Settings';
import Confetti from 'react-confetti';
import SoundEffects from './SoundEffects';
import SettingsSidebar from './SettingsSidebar';

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
  shouldShake: boolean;
  wins: number;
  losses: number;
}

const GameBoard: React.FC = () => {
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    targetWord: '',
    currentGuess: '',
    guesses: [],
    feedback: [],
    gameOver: false,
    won: false,
    error: '',
    hardcoreMode: false,
    usedLetters: {},
    shouldShake: false,
    wins: 0,
    losses: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [soundState, setSoundState] = useState({
    playKeyPress: false,
    playInvalid: false,
    playWin: false,
    playLose: false,
  });
  const [volume, setVolume] = useState(0.5); // Default volume at 50%

  const handleKeyPress = useCallback(async (key: string) => {
    if (gameState.gameOver) return;

    setSoundState(prev => ({ ...prev, playKeyPress: true }));
    
    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== 5) {
        setGameState((prev: GameState) => ({ ...prev, error: 'Word must be 5 letters long' }));
        return;
      }

      try {
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
        
        if (!response.ok) {
          setSoundState(prev => ({ ...prev, playInvalid: true }));
          setGameState((prev: GameState) => ({ 
            ...prev, 
            error: data.error,
            shouldShake: true 
          }));
          setTimeout(() => {
            setGameState((prev: GameState) => ({ ...prev, shouldShake: false }));
          }, 500);
          return;
        }

        const newFeedback = [...gameState.feedback, data.feedback];
        const newGuesses = [...gameState.guesses, gameState.currentGuess];
        const newUsedLetters = { ...gameState.usedLetters };
        
        // Update used letters
        gameState.currentGuess.split('').forEach((letter, index) => {
          if (data.feedback[index] === 'correct') {
            newUsedLetters[letter] = 'correct';
          } else if (data.feedback[index] === 'present' && newUsedLetters[letter] !== 'correct') {
            newUsedLetters[letter] = 'present';
          } else if (!newUsedLetters[letter]) {
            newUsedLetters[letter] = 'absent';
          }
        });

        const isGameOver = data.is_correct || newGuesses.length === 6;
        const hasWon = data.is_correct;

        setGameState((prev: GameState) => ({
          ...prev,
          currentGuess: '',
          guesses: newGuesses,
          feedback: newFeedback,
          gameOver: isGameOver,
          won: hasWon,
          error: '',
          usedLetters: newUsedLetters,
          shouldShake: false,
          wins: hasWon ? prev.wins + 1 : prev.wins,
          losses: !hasWon && isGameOver ? prev.losses + 1 : prev.losses
        }));

        if (hasWon) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          setSoundState(prev => ({ ...prev, playWin: true }));
        } else if (isGameOver) {
          setSoundState(prev => ({ ...prev, playLose: true }));
        }

        // Save score
        await fetch(`${API_BASE_URL}/api/save-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: hasWon ? newGuesses.length : 0,
            hardcore_mode: gameState.hardcoreMode,
          }),
        });

      } catch (error) {
        console.error('Error checking word:', error);
        setSoundState(prev => ({ ...prev, playInvalid: true }));
        setGameState((prev: GameState) => ({ 
          ...prev, 
          error: 'Failed to check word. Please try again.',
          shouldShake: true 
        }));
        setTimeout(() => {
          setGameState((prev: GameState) => ({ ...prev, shouldShake: false }));
        }, 500);
      }
    } else if (key === 'BACKSPACE') {
      setSoundState(prev => ({ ...prev, playKeyPress: true }));
      setGameState((prev: GameState) => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
        error: '',
        shouldShake: false
      }));
    } else if (gameState.currentGuess.length < 5) {
      setGameState((prev: GameState) => ({
        ...prev,
        currentGuess: prev.currentGuess + key,
        error: '',
        shouldShake: false
      }));
    }
  }, [gameState, setGameState, setSoundState, setShowConfetti]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.currentGuess, gameState.gameOver, handleKeyPress]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    startNewGame();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHardcoreModeChange = async (value: boolean) => {
    console.log('Toggling hardcore mode to:', value);
    setHardcoreMode(value);
    setGameState(prev => ({ ...prev, hardcoreMode: value }));
    await new Promise(resolve => setTimeout(resolve, 0));
    await startNewGame();
  };

  const startNewGame = async () => {
    try {
      console.log('Starting new game with hardcore mode:', hardcoreMode);
      const response = await fetch(`${API_BASE_URL}/api/word?hardcore=${hardcoreMode}`);
      if (!response.ok) {
        throw new Error('Failed to get new word');
      }
      const data = await response.json();
      console.log('Received word:', data.word, 'for hardcore mode:', hardcoreMode);
      setGameState(prev => ({
        ...prev,
        targetWord: data.word,
        currentGuess: '',
        guesses: [],
        feedback: [],
        gameOver: false,
        won: false,
        error: '',
        usedLetters: {},
        shouldShake: false
      }));
    } catch (error) {
      console.error('Error starting new game:', error);
      setGameState((prev: GameState) => ({ 
        ...prev, 
        error: 'Failed to start new game. Please try again.',
        shouldShake: false
      }));
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 2,
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#121213',
      color: '#ffffff',
      padding: '20px',
    }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
      <SoundEffects 
        {...soundState} 
        volume={volume}
      />
      <SettingsSidebar
        volume={volume}
        onVolumeChange={setVolume}
        hardcoreMode={hardcoreMode}
        onHardcoreModeChange={handleHardcoreModeChange}
        onNewGame={startNewGame}
      />
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '500px',
            px: 2
          }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontFamily: '"Press Start 2P", monospace',
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                margin: 0,
                flex: 1,
                textAlign: 'center'
              }}
            >
              WORDLE
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              ml: 'auto'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#ffffff',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.8rem'
              }}>
                W:{gameState.wins}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#ffffff',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.8rem'
              }}>
                L:{gameState.losses}
              </Typography>
            </Box>
          </Box>
        </Box>
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
          <Settings
            hardcoreMode={hardcoreMode}
            onHardcoreModeChange={handleHardcoreModeChange}
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
                        shouldShake={rowIndex === gameState.guesses.length && gameState.shouldShake}
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
                  fontFamily: '"Press Start 2P", monospace',
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
                    fontFamily: '"Press Start 2P", monospace',
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
                New Game
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default GameBoard; 