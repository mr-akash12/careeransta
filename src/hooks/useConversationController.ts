import { useState, useCallback, useEffect, useRef } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useInterviewAI, type InterviewMode } from './useInterviewAI';
import { toast } from 'sonner';

export type ConversationState = 
  | 'idle'           // Not started
  | 'ai_speaking'    // AI is talking via TTS
  | 'user_listening' // Mic active, waiting for user input
  | 'user_processing'// Processing user speech to text
  | 'ai_responding'; // Waiting for AI response

interface UseConversationControllerOptions {
  onStateChange?: (state: ConversationState) => void;
  silenceTimeout?: number; // ms to wait for silence before processing
  mode?: InterviewMode;
}

export const useConversationController = (options: UseConversationControllerOptions = {}) => {
  const { 
    onStateChange, 
    silenceTimeout = 2500,
    mode = 'standard'
  } = options;

  const [state, setState] = useState<ConversationState>('idle');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentMode, setCurrentMode] = useState<InterviewMode>(mode);
  
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptLengthRef = useRef<number>(0);
  const isProcessingRef = useRef(false);
  const mountedRef = useRef(true);
  const pendingListenRef = useRef(false);

  // Hooks
  const { 
    isSpeaking, 
    speak, 
    stop: stopSpeaking,
    isSupported: isTTSSupported
  } = useTextToSpeech();

  const { 
    isListening, 
    transcript, 
    interimTranscript,
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported: isSpeechSupported
  } = useSpeechRecognition();

  const {
    isLoading: isAILoading,
    conversationHistory,
    feedback,
    startInterview,
    respondToAI,
    endInterview,
    reset: resetAI
  } = useInterviewAI();

  // Update state and notify
  const updateState = useCallback((newState: ConversationState) => {
    if (!mountedRef.current) return;
    console.log('Conversation state:', newState);
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // Clear silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Process user's final transcript and send to AI
  const processUserResponse = useCallback(async (text: string) => {
    if (!text.trim() || isProcessingRef.current || !mountedRef.current) return;
    
    console.log('Processing user response:', text);
    isProcessingRef.current = true;
    updateState('ai_responding');
    
    try {
      const aiResponse = await respondToAI(text, currentMode);
      
      if (aiResponse && mountedRef.current) {
        console.log('AI response received, starting TTS...');
        updateState('ai_speaking');
        
        // Speak the response - when it ends, we'll auto-listen
        await speak(aiResponse);
        
        // After speaking ends, start listening automatically
        if (mountedRef.current && sessionStarted) {
          pendingListenRef.current = true;
        }
      } else if (mountedRef.current && sessionStarted) {
        // If no response, go back to listening
        console.log('No AI response, going back to listening');
        updateState('user_listening');
        resetTranscript();
        startListening();
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      if (mountedRef.current) {
        toast.error('Failed to get AI response');
        if (sessionStarted) {
          updateState('user_listening');
          resetTranscript();
          startListening();
        }
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, [respondToAI, currentMode, speak, sessionStarted, startListening, resetTranscript, updateState]);

  // Start listening for user input
  const startUserListening = useCallback(async () => {
    if (!mountedRef.current || !sessionStarted) return;
    
    console.log('Starting user listening...');
    resetTranscript();
    lastTranscriptLengthRef.current = 0;
    updateState('user_listening');
    
    const success = await startListening();
    if (!success && mountedRef.current) {
      toast.error('Failed to start listening');
    }
  }, [sessionStarted, resetTranscript, startListening, updateState]);

  // Monitor when AI finishes speaking
  useEffect(() => {
    if (!mountedRef.current) return;
    
    // When speaking stops and we have a pending listen request
    if (!isSpeaking && pendingListenRef.current && sessionStarted) {
      pendingListenRef.current = false;
      
      // Small delay for natural flow before listening
      const timer = setTimeout(() => {
        if (mountedRef.current && sessionStarted) {
          startUserListening();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, sessionStarted, startUserListening]);

  // Monitor transcript changes for silence detection
  useEffect(() => {
    if (state !== 'user_listening' || !isListening) return;

    const currentLength = (transcript + interimTranscript).length;
    
    // If transcript changed, reset silence timer
    if (currentLength !== lastTranscriptLengthRef.current) {
      lastTranscriptLengthRef.current = currentLength;
      clearSilenceTimer();
      
      // Only start silence timer if we have some content
      if (transcript.trim().length > 3) {
        silenceTimerRef.current = setTimeout(() => {
          if (mountedRef.current && transcript.trim() && state === 'user_listening') {
            console.log('Silence detected, processing transcript');
            stopListening();
            updateState('user_processing');
            const finalTranscript = transcript.trim();
            resetTranscript();
            processUserResponse(finalTranscript);
          }
        }, silenceTimeout);
      }
    }
  }, [transcript, interimTranscript, isListening, state, silenceTimeout, 
      clearSilenceTimer, stopListening, processUserResponse, resetTranscript, updateState]);

  // Start the interview session
  const start = useCallback(async (resumeContent: string, targetRole: string, interviewMode: InterviewMode = 'standard') => {
    if (!isSpeechSupported || !isTTSSupported) {
      toast.error('Speech features are not supported in your browser. Please use Chrome or Edge.');
      return null;
    }

    console.log('Starting interview session...');
    setCurrentMode(interviewMode);
    updateState('ai_responding');

    try {
      const aiResponse = await startInterview(resumeContent, targetRole, interviewMode);
      
      if (aiResponse && mountedRef.current) {
        setSessionStarted(true);
        updateState('ai_speaking');
        
        // Speak the first message
        await speak(aiResponse);
        
        // After first message, start listening
        if (mountedRef.current) {
          pendingListenRef.current = true;
        }
        
        return aiResponse;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to start interview:', error);
      if (mountedRef.current) {
        updateState('idle');
        toast.error('Failed to start interview');
      }
      return null;
    }
  }, [isSpeechSupported, isTTSSupported, startInterview, speak, updateState]);

  // Force send current transcript (manual intervention)
  const forceSend = useCallback(() => {
    if (transcript.trim() && state === 'user_listening') {
      console.log('Force sending transcript:', transcript);
      clearSilenceTimer();
      stopListening();
      updateState('user_processing');
      const finalTranscript = transcript.trim();
      resetTranscript();
      processUserResponse(finalTranscript);
    }
  }, [transcript, state, clearSilenceTimer, stopListening, 
      processUserResponse, resetTranscript, updateState]);

  // Toggle microphone manually (allows interruption)
  const toggleMic = useCallback(() => {
    console.log('Toggle mic - current state:', state, 'isSpeaking:', isSpeaking, 'isListening:', isListening);
    
    if (isSpeaking) {
      // Stop AI speaking to allow user to talk
      console.log('Stopping AI speech to allow user input');
      stopSpeaking();
      pendingListenRef.current = false;
      
      // Start listening after stopping
      setTimeout(() => {
        if (mountedRef.current && sessionStarted) {
          startUserListening();
        }
      }, 100);
      return;
    }

    if (isListening) {
      // User wants to stop listening and send what they have
      if (transcript.trim()) {
        forceSend();
      } else {
        // Nothing to send, just stop listening
        stopListening();
        updateState('idle');
      }
    } else if (state !== 'ai_responding' && state !== 'user_processing' && sessionStarted) {
      // Start listening
      startUserListening();
    }
  }, [isSpeaking, isListening, state, sessionStarted, transcript,
      stopSpeaking, stopListening, forceSend, startUserListening, updateState]);

  // End the interview
  const end = useCallback(async () => {
    console.log('Ending interview...');
    clearSilenceTimer();
    stopListening();
    stopSpeaking();
    pendingListenRef.current = false;
    setSessionStarted(false);
    updateState('idle');
    
    return await endInterview();
  }, [clearSilenceTimer, stopListening, stopSpeaking, endInterview, updateState]);

  // Reset everything
  const reset = useCallback(() => {
    console.log('Resetting conversation...');
    clearSilenceTimer();
    stopListening();
    stopSpeaking();
    resetTranscript();
    resetAI();
    pendingListenRef.current = false;
    setSessionStarted(false);
    updateState('idle');
  }, [clearSilenceTimer, stopListening, stopSpeaking, resetTranscript, resetAI, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      clearSilenceTimer();
      pendingListenRef.current = false;
    };
  }, [clearSilenceTimer]);

  return {
    // State
    state,
    sessionStarted,
    isAILoading,
    isSpeaking,
    isListening,
    transcript,
    interimTranscript,
    conversationHistory,
    feedback,
    isSpeechSupported: isSpeechSupported && isTTSSupported,

    // Actions
    start,
    toggleMic,
    forceSend,
    end,
    reset,
  };
};
