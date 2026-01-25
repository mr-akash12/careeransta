import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioAnalyzerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
}

export const useAudioAnalyzer = (options: UseAudioAnalyzerOptions = {}) => {
  const { fftSize = 256, smoothingTimeConstant = 0.8 } = options;
  
  const [volume, setVolume] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const analyze = useCallback(() => {
    if (!analyzerRef.current || !mountedRef.current) return;

    const analyzer = analyzerRef.current;
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    const tick = () => {
      if (!mountedRef.current || !analyzerRef.current) return;
      
      analyzer.getByteFrequencyData(dataArray);
      
      // Calculate average volume (0-1)
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const avg = sum / dataArray.length;
      const normalizedVolume = Math.min(avg / 128, 1); // Normalize to 0-1
      
      setVolume(normalizedVolume);
      
      // Get frequency bands for visualization (reduce to fewer bars)
      const bands = 16;
      const bandSize = Math.floor(dataArray.length / bands);
      const freqBands: number[] = [];
      
      for (let i = 0; i < bands; i++) {
        let bandSum = 0;
        for (let j = 0; j < bandSize; j++) {
          bandSum += dataArray[i * bandSize + j];
        }
        freqBands.push((bandSum / bandSize) / 255); // Normalize to 0-1
      }
      
      setFrequencyData(freqBands);
      
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    
    tick();
  }, []);

  const start = useCallback(async () => {
    if (isActive) return true;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }
      
      streamRef.current = stream;
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Create analyzer
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = fftSize;
      analyzer.smoothingTimeConstant = smoothingTimeConstant;
      analyzerRef.current = analyzer;
      
      // Connect microphone to analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      sourceRef.current = source;
      
      setIsActive(true);
      analyze();
      
      return true;
    } catch (error) {
      console.error('Failed to start audio analyzer:', error);
      return false;
    }
  }, [isActive, fftSize, smoothingTimeConstant, analyze]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    analyzerRef.current = null;
    
    if (mountedRef.current) {
      setIsActive(false);
      setVolume(0);
      setFrequencyData([]);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    volume,
    frequencyData,
    isActive,
    start,
    stop,
  };
};
