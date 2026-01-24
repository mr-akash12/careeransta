import { useEffect, useRef } from 'react';
import { Camera, CameraOff, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraDisplayProps {
  stream: MediaStream | null;
  isActive: boolean;
  label?: string;
  className?: string;
  showPlaceholder?: boolean;
}

export const CameraDisplay = ({ 
  stream, 
  isActive, 
  label = 'You',
  className,
  showPlaceholder = true 
}: CameraDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={cn('relative rounded-2xl overflow-hidden bg-muted', className)}>
      {isActive && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
      ) : showPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
          <div className="h-20 w-20 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-3">
            <User className="h-10 w-10" />
          </div>
          <p className="text-sm">Camera off</p>
        </div>
      ) : null}
      
      {/* Label */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {isActive ? (
            <Camera className="h-3.5 w-3.5 text-success" />
          ) : (
            <CameraOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs font-medium">{label}</span>
        </div>
      </div>

      {/* Recording indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-medium text-white">Live</span>
        </div>
      )}
    </div>
  );
};
