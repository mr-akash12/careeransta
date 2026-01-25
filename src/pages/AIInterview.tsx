import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft, Sparkles } from 'lucide-react';
import { ResumeUpload } from '@/components/interview/ResumeUpload';
import { SetupConfigStep } from '@/components/interview/SetupConfigStep';
import { PermissionRequest } from '@/components/interview/PermissionRequest';
import { InterviewSession } from '@/components/interview/InterviewSession';
import { StepTabs } from '@/components/interview/StepTabs';
import { FeedbackReport } from '@/components/interview/FeedbackReport';
import { useConversationController, type ConversationState } from '@/hooks/useConversationController';
import { useCamera } from '@/hooks/useCamera';
import { type InterviewMode } from '@/hooks/useInterviewAI';

type Step = 'details' | 'config' | 'permission' | 'interview' | 'feedback';

const AIInterview = () => {
  const [step, setStep] = useState<Step>('details');
  const [resumeData, setResumeData] = useState({ content: '', role: '' });
  
  // Config state
  const [duration, setDuration] = useState<'15' | '30' | '60'>('15');
  const [interviewType, setInterviewType] = useState('');
  const [interviewRound, setInterviewRound] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showCustomInstructions, setShowCustomInstructions] = useState(false);
  
  // Permission state
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);

  // Conversation state tracking
  const [convState, setConvState] = useState<ConversationState>('idle');

  const {
    state,
    sessionStarted,
    isAILoading,
    isSpeaking,
    isListening,
    transcript,
    interimTranscript,
    conversationHistory,
    feedback,
    start: startConversation,
    toggleMic,
    forceSend,
    end: endConversation,
    reset: resetConversation,
  } = useConversationController({
    onStateChange: setConvState,
    silenceTimeout: 2500, // 2.5 seconds of silence before processing
  });

  const { isActive: isCameraActive, stream, startCamera, stopCamera } = useCamera();

  const handleUpload = useCallback((content: string, role: string) => {
    setResumeData({ content, role });
    setStep('config');
  }, []);

  const handleConfigNext = useCallback(() => {
    setStep('permission');
  }, []);

  const handleRequestAccess = useCallback(async () => {
    setIsRequestingAccess(true);
    try {
      // Request camera
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraGranted(true);
      
      // Request microphone
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
      
      // Start camera
      await startCamera();
      
      // Move to interview
      setStep('interview');
    } catch (error) {
      console.error('Permission error:', error);
    } finally {
      setIsRequestingAccess(false);
    }
  }, [startCamera]);

  const handleStartSession = useCallback(async () => {
    // Map interview type to mode
    const modeMap: Record<string, InterviewMode> = {
      'Behavioral': 'friendly',
      'Technical / Coding': 'standard',
      'System Design': 'stress',
    };
    const mode = modeMap[interviewType] || 'standard';
    
    // Build enhanced instructions
    const instructions = [
      `Interview Type: ${interviewType}`,
      `Interview Round: ${interviewRound}`,
      `Duration: ${duration} minutes`,
      customInstructions && `Custom Instructions: ${customInstructions}`,
    ].filter(Boolean).join('\n');
    
    await startConversation(
      resumeData.content + '\n\n' + instructions,
      resumeData.role,
      mode
    );
  }, [interviewType, interviewRound, duration, customInstructions, resumeData, startConversation]);

  const handleEndSession = useCallback(async () => {
    stopCamera();
    await endConversation();
    setStep('feedback');
  }, [stopCamera, endConversation]);

  const handleStartNew = useCallback(() => {
    resetConversation();
    setStep('details');
    setResumeData({ content: '', role: '' });
    setDuration('15');
    setInterviewType('');
    setInterviewRound('');
    setCustomInstructions('');
    setShowCustomInstructions(false);
    setCameraGranted(false);
    setMicGranted(false);
  }, [resetConversation]);

  useEffect(() => {
    return () => {
      stopCamera();
      resetConversation();
    };
  }, []);

  const getStepNumber = () => {
    switch (step) {
      case 'details': return 1;
      case 'config': return 2;
      default: return 0;
    }
  };

  // Get status text based on conversation state
  const getStatusText = () => {
    switch (state) {
      case 'ai_speaking': return 'AI is speaking...';
      case 'user_listening': return 'Listening for your response...';
      case 'user_processing': return 'Processing your response...';
      case 'ai_responding': return 'AI is thinking...';
      default: return 'Ready to start';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">CareerANSTA</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        {/* Step Tabs for details/config */}
        {(step === 'details' || step === 'config') && (
          <StepTabs 
            currentStep={getStepNumber()} 
            steps={['Add Details', 'Setup Config']} 
          />
        )}

        {step === 'details' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">AI Mock Interview</h1>
              <p className="text-muted-foreground">Practice with our AI interviewer and get personalized feedback</p>
            </div>
            <ResumeUpload onUpload={handleUpload} isLoading={isAILoading} />
          </div>
        )}

        {step === 'config' && (
          <div className="max-w-xl mx-auto">
            <SetupConfigStep
              duration={duration}
              interviewType={interviewType}
              interviewRound={interviewRound}
              customInstructions={customInstructions}
              showCustomInstructions={showCustomInstructions}
              onDurationChange={setDuration}
              onInterviewTypeChange={setInterviewType}
              onInterviewRoundChange={setInterviewRound}
              onCustomInstructionsChange={setCustomInstructions}
              onToggleCustomInstructions={setShowCustomInstructions}
              onNext={handleConfigNext}
              onPrev={() => setStep('details')}
            />
          </div>
        )}

        {step === 'permission' && (
          <div className="max-w-2xl mx-auto">
            <PermissionRequest
              cameraGranted={cameraGranted}
              micGranted={micGranted}
              onRequestAccess={handleRequestAccess}
              isRequesting={isRequestingAccess}
            />
          </div>
        )}

        {step === 'interview' && (
          <div className="h-[calc(100vh-10rem)]">
            <InterviewSession
              targetRole={resumeData.role}
              messages={conversationHistory.map(m => ({ ...m, timestamp: new Date() }))}
              currentTranscript={isListening ? (transcript + ' ' + interimTranscript).trim() : undefined}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isLoading={isAILoading}
              isCameraActive={isCameraActive}
              stream={stream}
              resumeContent={resumeData.content}
              conversationState={state}
              statusText={getStatusText()}
              onToggleMic={toggleMic}
              onForceSend={forceSend}
              onToggleCamera={isCameraActive ? stopCamera : startCamera}
              onStartSession={handleStartSession}
              onPauseSession={() => {}}
              onEndSession={handleEndSession}
              sessionStarted={sessionStarted}
            />
          </div>
        )}

        {step === 'feedback' && feedback && (
          <FeedbackReport feedback={feedback} onStartNew={handleStartNew} />
        )}
      </main>
    </div>
  );
};

export default AIInterview;
