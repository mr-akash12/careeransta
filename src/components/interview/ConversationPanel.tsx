import { useRef, useEffect, useState } from 'react';
import { Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationPanelProps {
  messages: Message[];
  currentTranscript?: string;
  isAISpeaking?: boolean;
}

export const ConversationPanel = ({ messages, currentTranscript, isAISpeaking }: ConversationPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript, showFullTranscript]);

  // Show only the last 4 messages or all if expanded
  const displayMessages = showFullTranscript ? messages : messages.slice(-4);
  const hiddenCount = messages.length - 4;

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="p-4 space-y-4">
        {/* Show expand/collapse button if there are more than 4 messages */}
        {hiddenCount > 0 && (
          <div className="text-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullTranscript(!showFullTranscript)}
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              {showFullTranscript ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show {hiddenCount} earlier message{hiddenCount > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}
        
        {displayMessages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
              message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.role === 'assistant' 
                ? 'bg-muted text-foreground rounded-tl-sm' 
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Live transcript */}
        {currentTranscript && (
          <div className="flex gap-3 flex-row-reverse">
            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary/50 text-primary-foreground rounded-tr-sm">
              <p className="text-sm leading-relaxed">{currentTranscript}</p>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* AI typing indicator */}
        {isAISpeaking && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-muted rounded-tl-sm">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
