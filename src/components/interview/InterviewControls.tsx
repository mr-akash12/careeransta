import { Mic, MicOff, Camera, CameraOff, Phone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InterviewControlsProps {
  isListening: boolean;
  isCameraActive: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  textInput: string;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndInterview: () => void;
  onSendText: () => void;
  onTextChange: (text: string) => void;
}

export const InterviewControls = ({
  isListening,
  isCameraActive,
  isLoading,
  isSpeaking,
  textInput,
  onToggleMic,
  onToggleCamera,
  onEndInterview,
  onSendText,
  onTextChange,
}: InterviewControlsProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && textInput.trim()) {
      e.preventDefault();
      onSendText();
    }
  };

  return (
    <div className="border-t border-border bg-card p-4 space-y-4">
      {/* Text input for backup */}
      <div className="flex gap-2">
        <Input
          placeholder="Type your response (or use the microphone)..."
          value={textInput}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || isSpeaking}
          className="flex-1"
        />
        <Button
          onClick={onSendText}
          disabled={!textInput.trim() || isLoading || isSpeaking}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Microphone */}
        <Button
          variant={isListening ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full',
            isListening && 'bg-primary ring-4 ring-primary/30'
          )}
          onClick={onToggleMic}
          disabled={isLoading || isSpeaking}
        >
          {isListening ? (
            <Mic className="h-6 w-6 animate-pulse" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>

        {/* End call */}
        <Button
          variant="destructive"
          size="lg"
          className="h-14 w-14 rounded-full"
          onClick={onEndInterview}
          disabled={isLoading}
        >
          <Phone className="h-6 w-6 rotate-[135deg]" />
        </Button>

        {/* Camera */}
        <Button
          variant={isCameraActive ? 'default' : 'outline'}
          size="lg"
          className={cn(
            'h-14 w-14 rounded-full',
            isCameraActive && 'bg-primary'
          )}
          onClick={onToggleCamera}
        >
          {isCameraActive ? (
            <Camera className="h-6 w-6" />
          ) : (
            <CameraOff className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Status text */}
      <p className="text-center text-sm text-muted-foreground">
        {isLoading ? 'AI is thinking...' : 
         isSpeaking ? 'AI is speaking...' :
         isListening ? 'Listening... Speak now' : 
         'Click the microphone to speak'}
      </p>
    </div>
  );
};
