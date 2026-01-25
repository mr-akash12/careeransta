import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check camera permission state on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          
          result.onchange = () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          };
        }
      } catch (err) {
        // Some browsers don't support permission query for camera
        setPermissionState('unknown');
      }
    };
    
    checkPermission();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // If we already have an active stream, just return it
      if (stream && stream.active) {
        setIsActive(true);
        return stream;
      }
      
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });
      
      console.log('Camera access granted, stream:', mediaStream.id);
      
      setStream(mediaStream);
      setIsActive(true);
      setPermissionState('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      return mediaStream;
    } catch (err) {
      console.error('Camera access error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setIsActive(false);
      
      // More specific error messages
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          toast.error('Camera access denied. Please allow camera access in your browser settings.');
          setPermissionState('denied');
        } else if (err.name === 'NotFoundError') {
          toast.error('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError') {
          toast.error('Camera is in use by another application. Please close other apps using the camera.');
        } else {
          toast.error('Could not access camera. Please check permissions.');
        }
      } else {
        toast.error('Could not access camera. Please check permissions.');
      }
      
      return null;
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, [stream]);

  const setVideoElement = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && stream) {
      element.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    isActive,
    stream,
    error,
    permissionState,
    startCamera,
    stopCamera,
    setVideoElement,
  };
};
