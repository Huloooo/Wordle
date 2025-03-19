import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onWordGuessed: (word: string) => void;
  disabled: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onWordGuessed, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const word = transcript.trim().toUpperCase();
      if (word.length === 5) {
        onWordGuessed(word);
        setIsListening(false);
        resetTranscript();
      }
    }
  }, [transcript, onWordGuessed, resetTranscript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
    setIsListening(!isListening);
  };

  return (
    <Tooltip title={isListening ? "Stop Listening" : "Start Voice Input"}>
      <IconButton
        onClick={toggleListening}
        disabled={disabled}
        color={isListening ? "error" : "primary"}
      >
        {isListening ? <MicOff /> : <Mic />}
      </IconButton>
    </Tooltip>
  );
};

export default VoiceInput; 