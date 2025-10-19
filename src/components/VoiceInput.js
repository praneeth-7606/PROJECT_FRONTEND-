import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function VoiceInput({ value, onChange, placeholder, name = 'description' }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const accumulatedTextRef = useRef('');
  const startingValueRef = useRef('');

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        isListeningRef.current = true;
        // Don't reset starting value here - it's set in toggleListening
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        // Process all results from the beginning
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update accumulated text with final results
        if (finalTranscript) {
          accumulatedTextRef.current = finalTranscript;
          const newValue = startingValueRef.current + accumulatedTextRef.current;
          
          // Create a proper synthetic event object
          const syntheticEvent = {
            target: {
              name: name,
              value: newValue
            }
          };
          
          console.log('Voice input updating field:', name, 'with value:', newValue);
          onChange(syntheticEvent);
          setInterimText('');
        } else if (interimTranscript) {
          // Show interim results
          setInterimText(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Don't stop on no-speech error, just continue
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return;
        }
        
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable it in browser settings.');
          setIsListening(false);
          isListeningRef.current = false;
        } else if (event.error === 'aborted') {
          console.log('Recognition aborted');
        } else {
          console.log('Error:', event.error);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        // Restart if still supposed to be listening
        if (isListeningRef.current) {
          console.log('Restarting recognition...');
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting:', error);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  // Update value when onChange is called
  useEffect(() => {
    if (recognitionRef.current && value !== undefined) {
      // This ensures the component stays in sync with parent value
    }
  }, [value]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping:', error);
      }
      setIsListening(false);
      setInterimText('');
      toast.success('Voice recording stopped');
    } else {
      // Save current value BEFORE starting
      const currentValue = value || '';
      console.log('Starting voice input. Current value in field:', currentValue);
      
      startingValueRef.current = currentValue;
      accumulatedTextRef.current = '';
      
      isListeningRef.current = true;
      setIsListening(true);
      setInterimText('');
      
      try {
        recognitionRef.current.start();
        toast.success('🎤 Listening... Speak now!', {
          duration: 2000,
          icon: '🎤',
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Failed to start voice recognition');
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  };

  // Display value: show current value + interim text while listening
  const displayValue = isListening 
    ? (value || '') + (interimText ? ' ' + interimText : '')
    : (value || '');

  // Handle manual typing
  const handleChange = (e) => {
    if (!isListening) {
      // Only allow manual changes when not listening
      onChange(e);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 50px 12px 16px',
          border: isListening ? '2px solid var(--primary)' : '2px solid var(--light-gray)',
          borderRadius: 'var(--radius)',
          fontSize: '15px',
          transition: 'var(--transition)',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: '100px',
          backgroundColor: isListening ? 'rgba(124, 58, 237, 0.05)' : 'white',
          cursor: 'text'
        }}
      />
      {isListening && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          fontSize: '12px',
          color: 'var(--primary)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ef4444',
            animation: 'pulse 1s infinite'
          }}></span>
          Recording...
        </div>
      )}
      <button
        type="button"
        onClick={toggleListening}
        disabled={!isSupported}
        style={{
          position: 'absolute',
          right: '12px',
          top: '12px',
          width: '36px',
          height: '36px',
          border: 'none',
          background: isListening ? '#ef4444' : 'var(--primary)',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isSupported ? 'pointer' : 'not-allowed',
          transition: 'var(--transition)',
          opacity: isSupported ? 1 : 0.5,
          boxShadow: isListening ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      {!isSupported && (
        <p style={{ 
          fontSize: '12px', 
          color: '#ef4444', 
          marginTop: '4px' 
        }}>
          Voice input not supported in this browser
        </p>
      )}
    </div>
  );
}

export default VoiceInput;
