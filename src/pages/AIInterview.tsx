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
import { useInterviewAI, type InterviewMode } from '@/hooks/useInterviewAI';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useCamera } from '@/hooks/useCamera';

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
  
  // Session state
  const [sessionStarted, setSessionStarted] = useState(false);

  const { isLoading, conversationHistory, feedback, startInterview, respondToAI, endInterview, reset } = useInterviewAI();
  const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech();
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
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
    
    const message = await startInterview(
      resumeData.content + '\n\n' + instructions,
      resumeData.role,
      mode
    );
    
    if (message) {
      setSessionStarted(true);
      speak(message);
    }
  }, [interviewType, interviewRound, duration, customInstructions, resumeData, startInterview, speak]);

  const handleToggleMic = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        handleSendResponse(transcript);
        resetTranscript();
      }
    } else {
      startListening();
    }
  }, [isListening, isSpeaking, stopListening, stopSpeaking, startListening, transcript, resetTranscript]);

  const handleSendResponse = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopSpeaking();
    
    const modeMap: Record<string, InterviewMode> = {
      'Behavioral': 'friendly',
      'Technical / Coding': 'standard',
      'System Design': 'stress',
    };
    const mode = modeMap[interviewType] || 'standard';
    
    const message = await respondToAI(text, mode);
    if (message) {
      speak(message);
    }
  }, [isLoading, stopSpeaking, respondToAI, interviewType, speak]);

  const handleEndSession = useCallback(async () => {
    stopListening();
    stopSpeaking();
    stopCamera();
    await endInterview();
    setStep('feedback');
  }, [stopListening, stopSpeaking, stopCamera, endInterview]);

  const handleStartNew = useCallback(() => {
    reset();
    setStep('details');
    setResumeData({ content: '', role: '' });
    setDuration('15');
    setInterviewType('');
    setInterviewRound('');
    setCustomInstructions('');
    setShowCustomInstructions(false);
    setCameraGranted(false);
    setMicGranted(false);
    setSessionStarted(false);
  }, [reset]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeaking();
      stopListening();
    };
  }, []);

  const getStepNumber = () => {
    switch (step) {
      case 'details': return 1;
      case 'config': return 2;
      default: return 0;
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
            <ResumeUpload onUpload={handleUpload} isLoading={isLoading} />
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
              isLoading={isLoading}
              isCameraActive={isCameraActive}
              stream={stream}
              resumeContent={resumeData.content}
              onToggleMic={handleToggleMic}
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
