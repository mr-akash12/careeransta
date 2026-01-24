import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft, Sparkles } from 'lucide-react';
import { ResumeUpload } from '@/components/interview/ResumeUpload';
import { ModeSelector } from '@/components/interview/ModeSelector';
import { PreInterviewChecklist } from '@/components/interview/PreInterviewChecklist';
import { CameraDisplay } from '@/components/interview/CameraDisplay';
import { InterviewerAvatar } from '@/components/interview/InterviewerAvatar';
import { ConversationPanel } from '@/components/interview/ConversationPanel';
import { InterviewControls } from '@/components/interview/InterviewControls';
import { FeedbackReport } from '@/components/interview/FeedbackReport';
import { useInterviewAI, type InterviewMode } from '@/hooks/useInterviewAI';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useCamera } from '@/hooks/useCamera';

type Step = 'upload' | 'checklist' | 'interview' | 'feedback';

const AIInterview = () => {
  const [step, setStep] = useState<Step>('upload');
  const [mode, setMode] = useState<InterviewMode>('standard');
  const [textInput, setTextInput] = useState('');
  const [resumeData, setResumeData] = useState({ content: '', role: '' });

  const { isLoading, conversationHistory, feedback, startInterview, respondToAI, endInterview, reset } = useInterviewAI();
  const { isSpeaking, speak, stop: stopSpeaking } = useTextToSpeech();
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { isActive: isCameraActive, stream, startCamera, stopCamera } = useCamera();

  const handleUpload = useCallback((content: string, role: string) => {
    setResumeData({ content, role });
    setStep('checklist');
  }, []);

  const handleReady = useCallback(async () => {
    await startCamera();
    const message = await startInterview(resumeData.content, resumeData.role, mode);
    if (message) {
      setStep('interview');
      speak(message);
    }
  }, [startCamera, startInterview, resumeData, mode, speak]);

  const handleToggleMic = useCallback(() => {
    // Stop AI speech when user wants to talk
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
    const message = await respondToAI(text, mode);
    if (message) {
      speak(message);
    }
  }, [isLoading, stopSpeaking, respondToAI, mode, speak]);

  const handleSendText = useCallback(() => {
    if (textInput.trim()) {
      handleSendResponse(textInput);
      setTextInput('');
    }
  }, [textInput, handleSendResponse]);

  const handleEndInterview = useCallback(async () => {
    stopListening();
    stopSpeaking();
    stopCamera();
    await endInterview();
    setStep('feedback');
  }, [stopListening, stopSpeaking, stopCamera, endInterview]);

  const handleStartNew = useCallback(() => {
    reset();
    setStep('upload');
    setResumeData({ content: '', role: '' });
  }, [reset]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeaking();
      stopListening();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">CareerAscend</span>
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
        {step === 'upload' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">AI Mock Interview</h1>
              <p className="text-muted-foreground">Practice with our AI interviewer and get personalized feedback</p>
            </div>
            <ModeSelector selectedMode={mode} onModeChange={setMode} />
            <ResumeUpload onUpload={handleUpload} isLoading={isLoading} />
          </div>
        )}

        {step === 'checklist' && (
          <div className="max-w-md mx-auto">
            <PreInterviewChecklist onReady={handleReady} />
          </div>
        )}

        {step === 'interview' && (
          <div className="h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
              <div className="lg:col-span-2 grid grid-rows-2 gap-4">
                <InterviewerAvatar isSpeaking={isSpeaking} className="h-full min-h-[200px]" />
                <CameraDisplay stream={stream} isActive={isCameraActive} className="h-full min-h-[200px]" />
              </div>
              <div className="bg-card border border-border rounded-2xl flex flex-col min-h-[400px] lg:min-h-0">
                <div className="p-3 border-b border-border">
                  <h3 className="font-medium text-sm">Conversation</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ConversationPanel 
                    messages={conversationHistory} 
                    currentTranscript={isListening ? (transcript + ' ' + interimTranscript).trim() : undefined}
                    isAISpeaking={isLoading}
                  />
                </div>
              </div>
            </div>
            <InterviewControls
              isListening={isListening}
              isCameraActive={isCameraActive}
              isLoading={isLoading}
              isSpeaking={isSpeaking}
              textInput={textInput}
              onToggleMic={handleToggleMic}
              onToggleCamera={isCameraActive ? stopCamera : startCamera}
              onEndInterview={handleEndInterview}
              onSendText={handleSendText}
              onTextChange={setTextInput}
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
