import { useState, useCallback, useRef, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mountedRef = useRef(true);

  // Preload voices on mount
  useEffect(() => {
    mountedRef.current = true;
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0 && mountedRef.current) {
          setVoicesReady(true);
        }
      };
      
      // Load immediately if available
      loadVoices();
      
      // Also listen for voices changed event (Chrome loads async)
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      mountedRef.current = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    
    if (mountedRef.current) {
      setIsSpeaking(true);
    }
    
    // Get voices (may need to wait for them)
    let voices = window.speechSynthesis.getVoices();
    
    // If no voices yet, wait a bit for them to load
    if (voices.length === 0) {
      await new Promise<void>((resolve) => {
        const checkVoices = () => {
          voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve();
          } else {
            setTimeout(checkVoices, 100);
          }
        };
        setTimeout(checkVoices, 100);
        // Timeout after 2 seconds
        setTimeout(resolve, 2000);
      });
      voices = window.speechSynthesis.getVoices();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure voice settings for natural speech
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a good English voice
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      if (mountedRef.current) {
        setIsSpeaking(false);
      }
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      // Ignore 'interrupted' errors (happens when we cancel intentionally)
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event.error);
      }
      if (mountedRef.current) {
        setIsSpeaking(false);
      }
      utteranceRef.current = null;
    };
    
    // Chrome workaround: Resume if paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    window.speechSynthesis.speak(utterance);
    
    // Chrome bug workaround: Speech can stop after ~15s, need to keep it alive
    const keepAlive = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(keepAlive);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
    
    utterance.onend = () => {
      clearInterval(keepAlive);
      if (mountedRef.current) {
        setIsSpeaking(false);
      }
      utteranceRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    if (mountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    voicesReady,
    speak,
    stop,
  };
};
