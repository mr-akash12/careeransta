import { cn } from '@/lib/utils';
import { Bot, Volume2 } from 'lucide-react';

interface InterviewerAvatarProps {
  isSpeaking: boolean;
  className?: string;
}

export const InterviewerAvatar = ({ isSpeaking, className }: InterviewerAvatarProps) => {
  return (
    <div className={cn('relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5', className)}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Avatar */}
        <div className={cn(
          'relative h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center transition-all',
          isSpeaking && 'ring-4 ring-primary/30 ring-offset-2 ring-offset-background'
        )}>
          <Bot className="h-12 w-12 text-primary" />
          
          {/* Speaking animation */}
          {isSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-primary-foreground animate-pulse" />
              </div>
            </>
          )}
        </div>
        
        <p className="mt-4 font-medium text-foreground">AI Interviewer</p>
        <p className="text-sm text-muted-foreground">
          {isSpeaking ? 'Speaking...' : 'Listening'}
        </p>
      </div>

      {/* Status indicator */}
      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className={cn(
            'h-2 w-2 rounded-full',
            isSpeaking ? 'bg-primary animate-pulse' : 'bg-success'
          )} />
          <span className="text-xs font-medium">
            {isSpeaking ? 'Speaking' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
