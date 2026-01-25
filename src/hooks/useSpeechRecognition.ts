import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: { transcript: string; confidence: number };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventType {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventType {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventType) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventType) => void) | null;
  onend: (() => void) | null;
  onspeechend: (() => void) | null;
  onsoundend: (() => void) | null;
  onaudioend: (() => void) | null;
  onstart: (() => void) | null;
}

interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
}

export const useSpeechRecognition = (options: UseSpeechRecognitionOptions = {}) => {
  const { language = 'en-US', continuous = true } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mountedRef = useRef(true);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Initialize recognition
  useEffect(() => {
    mountedRef.current = true;
    
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor() as SpeechRecognitionInstance;
    
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (!mountedRef.current) return;
      console.log('Speech recognition started');
      isStartingRef.current = false;
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEventType) => {
      if (!mountedRef.current) return;
      
      let finalTranscript = '';
      let interim = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;
        const resultConfidence = result[0].confidence || 0;
        
        if (result.isFinal) {
          finalTranscript += transcriptText;
          if (resultConfidence > maxConfidence) {
            maxConfidence = resultConfidence;
          }
        } else {
          interim += transcriptText;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => {
          const newTranscript = prev ? prev + ' ' + finalTranscript : finalTranscript;
          return newTranscript.trim();
        });
        setConfidence(maxConfidence);
      }
      
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
      if (!mountedRef.current) return;
      
      console.error('Speech recognition error:', event.error, event.message);
      isStartingRef.current = false;
      
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          toast.error('Microphone access denied. Please enable it in your browser settings.');
          setIsListening(false);
          shouldRestartRef.current = false;
          break;
        case 'no-speech':
          // User hasn't said anything, this is normal
          console.log('No speech detected');
          break;
        case 'aborted':
          // Intentionally aborted, ignore
          break;
        case 'network':
          toast.error('Network error during speech recognition');
          setIsListening(false);
          break;
        case 'audio-capture':
          toast.error('No microphone found. Please check your audio settings.');
          setIsListening(false);
          break;
        default:
          console.warn('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      if (!mountedRef.current) return;
      console.log('Speech recognition ended');
      isStartingRef.current = false;
      
      // Auto-restart if we should still be listening
      if (shouldRestartRef.current && mountedRef.current) {
        console.log('Auto-restarting speech recognition');
        try {
          recognition.start();
          isStartingRef.current = true;
        } catch (e) {
          console.error('Failed to restart recognition:', e);
          setIsListening(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onspeechend = () => {
      console.log('Speech ended (silence detected)');
    };

    recognitionRef.current = recognition;

    return () => {
      mountedRef.current = false;
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isSupported, language, continuous]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || !mountedRef.current) {
      toast.error('Speech recognition not available');
      return false;
    }

    if (isStartingRef.current || isListening) {
      console.log('Already listening or starting');
      return true;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!mountedRef.current) return false;
      
      setTranscript('');
      setInterimTranscript('');
      setConfidence(0);
      shouldRestartRef.current = true;
      isStartingRef.current = true;
      
      recognitionRef.current.start();
      console.log('Starting speech recognition...');
      return true;
    } catch (error) {
      console.error('Microphone access error:', error);
      isStartingRef.current = false;
      shouldRestartRef.current = false;
      
      if (mountedRef.current) {
        toast.error('Could not access microphone. Please check permissions.');
      }
      return false;
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
    }
    
    if (mountedRef.current) {
      setIsListening(false);
      setInterimTranscript('');
    }
  }, []);

  const resetTranscript = useCallback(() => {
    if (mountedRef.current) {
      setTranscript('');
      setInterimTranscript('');
      setConfidence(0);
    }
  }, []);

  // Get the full current transcript (final + interim)
  const fullTranscript = (transcript + ' ' + interimTranscript).trim();

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  };
};
