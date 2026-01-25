import { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript]);

  // Show only the last 4 messages
  const recentMessages = messages.slice(-4);

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="p-4 space-y-4">
        {/* Show indicator if there are older messages */}
        {messages.length > 4 && (
          <div className="text-center text-xs text-muted-foreground py-2">
            {messages.length - 4} earlier message{messages.length - 4 > 1 ? 's' : ''} hidden
          </div>
        )}
        
        {recentMessages.map((message, index) => (
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
