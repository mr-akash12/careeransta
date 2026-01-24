import { useState, useEffect } from 'react';
import { Mic, Video, Clock, Circle, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface InterviewSessionProps {
  targetRole: string;
  company?: string;
  messages: Message[];
  currentTranscript?: string;
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  isCameraActive: boolean;
  stream: MediaStream | null;
  resumeContent?: string;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onStartSession: () => void;
  onPauseSession: () => void;
  onEndSession: () => void;
  sessionStarted: boolean;
}

// Audio waveform visualization
const AudioWaveform = ({ isActive }: { isActive: boolean }) => {
  const bars = 40;
  return (
    <div className="flex items-center justify-center gap-[2px] h-16">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-150',
            isActive ? 'bg-accent' : 'bg-muted-foreground/20'
          )}
          style={{
            height: isActive ? `${Math.random() * 100}%` : '10%',
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
};

// Camera display component
const CameraView = ({ 
  stream, 
  isActive,
  isRecording 
}: { 
  stream: MediaStream | null; 
  isActive: boolean;
  isRecording: boolean;
}) => {
  return (
    <div className="relative bg-muted rounded-xl overflow-hidden aspect-video">
      {isActive && stream ? (
        <>
          <video
            ref={(el) => { if (el && stream) el.srcObject = stream; }}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
              <Circle className="h-2 w-2 fill-current animate-pulse" />
              REC
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

// Timer component
const Timer = ({ startTime, isRunning }: { startTime: Date | null; isRunning: boolean }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning || !startTime) return;
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className="font-mono text-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export const InterviewSession = ({
  targetRole,
  company,
  messages,
  currentTranscript,
  isListening,
  isSpeaking,
  isLoading,
  isCameraActive,
  stream,
  resumeContent,
  onToggleMic,
  onToggleCamera,
  onStartSession,
  onPauseSession,
  onEndSession,
  sessionStarted,
}: InterviewSessionProps) => {
  const [sessionTime, setSessionTime] = useState<Date | null>(null);
  const [showTalkingPoints, setShowTalkingPoints] = useState(true);

  useEffect(() => {
    if (sessionStarted && !sessionTime) {
      setSessionTime(new Date());
    }
  }, [sessionStarted, sessionTime]);

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');

  // Extract key points from resume for talking points
  const talkingPoints = resumeContent?.split('\n')
    .filter(line => line.trim().length > 20)
    .slice(0, 6)
    .map(line => line.trim().substring(0, 100)) || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="font-display text-xl">
            <span className="font-bold text-foreground">Practice Your Mock Interview</span>
            {' '}
            <span className="text-accent font-medium">for {targetRole}{company && ` @ ${company}`}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {sessionStarted && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">AI Talking Points</span>
              <Switch checked={showTalkingPoints} onCheckedChange={setShowTalkingPoints} />
            </div>
          )}
          <Timer startTime={sessionTime} isRunning={sessionStarted} />
          {!sessionStarted ? (
            <Button variant="hero" onClick={onStartSession}>
              Start Session
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={onPauseSession}>
                Pause Session
              </Button>
              <Button variant="destructive" onClick={onEndSession}>
                End Session
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-4 pt-4 min-h-0">
        {/* Left Panel - Video & Transcription */}
        <div className="col-span-2 flex flex-col gap-4 min-h-0">
          {/* Video Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* AI Interviewer */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">AI Interviewer</p>
              <div className="bg-muted/50 rounded-xl p-4 aspect-video flex items-center justify-center border border-dashed border-border">
                <AudioWaveform isActive={isSpeaking} />
              </div>
            </div>

            {/* User Camera */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">Your Camera</p>
              <CameraView 
                stream={stream} 
                isActive={isCameraActive} 
                isRecording={sessionStarted && isCameraActive}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              className={cn(
                'h-12 w-12 rounded-full',
                isListening && 'bg-success hover:bg-success/90'
              )}
              onClick={onToggleMic}
            >
              <Mic className={cn('h-5 w-5', isListening && 'animate-pulse')} />
            </Button>
            <Button
              variant={isCameraActive ? 'outline' : 'ghost'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={onToggleCamera}
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>

          {/* Transcription Panel */}
          <Card className="flex-1 min-h-0 flex flex-col">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <CardTitle className="text-sm font-medium">Transcription of Your Interview</CardTitle>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  Live
                </span>
                <Timer startTime={sessionTime} isRunning={sessionStarted} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
              <ScrollArea className="h-full p-4">
                {messages.length === 0 && !currentTranscript ? (
                  <p className="text-center text-muted-foreground py-8">
                    Transcripts will appear here during the interview...
                  </p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={cn(
                        'flex gap-3',
                        msg.role === 'user' && 'flex-row-reverse'
                      )}>
                        <div className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                          msg.role === 'assistant' ? 'bg-accent text-accent-foreground' : 'bg-primary/10 text-primary'
                        )}>
                          {msg.role === 'assistant' ? (
                            <span className="text-xs font-bold">AI</span>
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div className={cn(
                          'flex-1 max-w-[80%]',
                          msg.role === 'user' && 'text-right'
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              {msg.role === 'assistant' ? 'AI Interviewer' : 'You'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={cn(
                            'inline-block p-3 rounded-xl text-sm',
                            msg.role === 'assistant' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-accent/20 text-foreground'
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentTranscript && (
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 max-w-[80%] text-right">
                          <div className="inline-block p-3 rounded-xl text-sm bg-accent/30 text-foreground italic">
                            {currentTranscript}...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Current Question & Talking Points */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Current Question */}
          <Card className="bg-accent/10 border-accent/30">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Current Question</CardTitle>
              <Timer startTime={sessionTime} isRunning={sessionStarted} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-foreground">
                {lastAssistantMessage?.content || 
                  'Start your mock interview by clicking "Start Session"'}
              </p>
            </CardContent>
          </Card>

          {/* AI Talking Points */}
          {showTalkingPoints && (
            <Card className="flex-1 min-h-0 bg-primary/5 border-primary/20">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-primary/10">
                <CardTitle className="text-base font-semibold">AI Talking Points</CardTitle>
                <Timer startTime={sessionTime} isRunning={sessionStarted} />
              </CardHeader>
              <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-[300px] p-4">
                  {talkingPoints.length > 0 ? (
                    <div className="space-y-3">
                      {talkingPoints.map((point, i) => (
                        <p key={i} className="text-sm text-foreground">
                          <span className="font-semibold">Key Project:</span> {point}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      AI talking points will appear here after the interviewer asks a question.
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
