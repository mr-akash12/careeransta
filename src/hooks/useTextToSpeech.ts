import { useState, useCallback, useRef, useEffect } from 'react';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mountedRef = useRef(true);
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!text.trim() || !mountedRef.current) return;
    
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
    }
    
    setIsSpeaking(true);
    
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (mountedRef.current) setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (mountedRef.current) setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
    
    // Chrome workaround for 15s timeout
    keepAliveRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        if (mountedRef.current) setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 10000);
  }, []);

  const stop = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, stop };
};
