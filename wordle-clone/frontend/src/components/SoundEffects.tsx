import React, { useEffect, useRef } from 'react';

interface SoundEffectsProps {
  playKeyPress: boolean;
  playInvalid: boolean;
  playWin: boolean;
  playLose: boolean;
  volume: number;
}

const SoundEffects: React.FC<SoundEffectsProps> = ({
  playKeyPress,
  playInvalid,
  playWin,
  playLose,
  volume,
}) => {
  const keyPressSound = useRef<HTMLAudioElement | null>(null);
  const invalidSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    keyPressSound.current = new Audio('/sounds/keypress.mp3');
    invalidSound.current = new Audio('/sounds/invalid.mp3');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/lose.mp3');

    // Set initial volume
    [keyPressSound, invalidSound, winSound, loseSound].forEach(sound => {
      if (sound.current) {
        sound.current.volume = volume;
      }
    });

    // Cleanup function
    return () => {
      [keyPressSound, invalidSound, winSound, loseSound].forEach(sound => {
        if (sound.current) {
          sound.current.pause();
          sound.current = null;
        }
      });
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    [keyPressSound, invalidSound, winSound, loseSound].forEach(sound => {
      if (sound.current) {
        sound.current.volume = volume;
      }
    });
  }, [volume]);

  useEffect(() => {
    if (playKeyPress && keyPressSound.current) {
      keyPressSound.current.currentTime = 0;
      keyPressSound.current.play().catch(() => {});
    }
  }, [playKeyPress]);

  useEffect(() => {
    if (playInvalid && invalidSound.current) {
      invalidSound.current.currentTime = 0;
      invalidSound.current.play().catch(() => {});
    }
  }, [playInvalid]);

  useEffect(() => {
    if (playWin && winSound.current) {
      winSound.current.currentTime = 0;
      winSound.current.play().catch(() => {});
    }
  }, [playWin]);

  useEffect(() => {
    if (playLose && loseSound.current) {
      loseSound.current.currentTime = 0;
      loseSound.current.play().catch(() => {});
    }
  }, [playLose]);

  return null;
};

export default SoundEffects; 