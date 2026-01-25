import { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceInfo {
  name: string;
  lang: string;
  default: boolean;
}

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  
  const mountedRef = useRef(true);
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    mountedRef.current = true;

    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && mountedRef.current) {
        setAvailableVoices(voices.map(v => ({
          name: v.name,
          lang: v.lang,
          default: v.default
        })));
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Also listen for voice changes (some browsers load async)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      mountedRef.current = false;
      window.speechSynthesis.onvoiceschanged = null;
      
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!text.trim() || !mountedRef.current) {
        resolve();
        return;
      }
      
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
      
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      // Configure voice settings
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Select a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Google') || 
          v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel')
        )
      ) || voices.find(v => v.lang.startsWith('en-US')) 
        || voices.find(v => v.lang.startsWith('en')) 
        || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }
        if (mountedRef.current) {
          setIsSpeaking(false);
        }
        utteranceRef.current = null;
        resolve();
      };
      
      utterance.onerror = (event) => {
        if (keepAliveRef.current) {
          clearInterval(keepAliveRef.current);
          keepAliveRef.current = null;
        }
        if (mountedRef.current) {
          setIsSpeaking(false);
        }
        utteranceRef.current = null;
        
        // Don't treat "interrupted" as an error (it's usually intentional)
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event.error);
          reject(new Error(event.error));
        } else {
          resolve();
        }
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
      
      // Chrome workaround: Chrome pauses speech synthesis after ~15 seconds
      // We need to periodically pause/resume to keep it alive
      keepAliveRef.current = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          if (keepAliveRef.current) {
            clearInterval(keepAliveRef.current);
            keepAliveRef.current = null;
          }
          if (mountedRef.current) {
            setIsSpeaking(false);
          }
          return;
        }
        
        // Pause and immediately resume to reset Chrome's timer
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
    });
  }, []);

  const stop = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    utteranceRef.current = null;
    
    if (mountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { 
    isSpeaking, 
    speak, 
    stop,
    isSupported,
    availableVoices
  };
};
