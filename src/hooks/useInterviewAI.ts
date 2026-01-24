import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ResponsePatterns {
  averageLength: number;
  hesitationCount: number;
  fillerWordCount: number;
}

interface InterviewFeedback {
  closingRemarks: string;
  scores: {
    communication: number;
    confidence: number;
    technicalKnowledge: number;
    bodyLanguage: number;
    overallImpression: number;
  };
  strengths: string[];
  improvements: string[];
  actionableTips: string[];
  overallFeedback: string;
}

export type InterviewMode = 'friendly' | 'stress' | 'standard';

export const useInterviewAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const responseMetrics = useRef<{ lengths: number[]; hesitations: number; fillers: number }>({
    lengths: [],
    hesitations: 0,
    fillers: 0,
  });

  const analyzeResponse = (text: string): void => {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    responseMetrics.current.lengths.push(wordCount);
    
    // Detect hesitation patterns
    const hesitationPatterns = /\b(um+|uh+|er+|hmm+|well\.\.+|so\.\.+)\b/gi;
    const hesitationMatches = text.match(hesitationPatterns);
    if (hesitationMatches) {
      responseMetrics.current.hesitations += hesitationMatches.length;
    }
    
    // Detect filler words
    const fillerPatterns = /\b(like|basically|actually|you know|i mean|sort of|kind of)\b/gi;
    const fillerMatches = text.match(fillerPatterns);
    if (fillerMatches) {
      responseMetrics.current.fillers += fillerMatches.length;
    }
  };

  const getResponsePatterns = (): ResponsePatterns => {
    const lengths = responseMetrics.current.lengths;
    const avgLength = lengths.length > 0 ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0;
    return {
      averageLength: avgLength,
      hesitationCount: responseMetrics.current.hesitations,
      fillerWordCount: responseMetrics.current.fillers,
    };
  };

  const startInterview = useCallback(async (resumeContent: string, targetRole: string, mode: InterviewMode = 'standard') => {
    setIsLoading(true);
    setConversationHistory([]);
    setFeedback(null);
    responseMetrics.current = { lengths: [], hesitations: 0, fillers: 0 };
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'start',
          resumeContent,
          targetRole,
          mode,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const aiMessage = data.data.message;
      setConversationHistory([{ role: 'assistant', content: aiMessage }]);
      setIsInterviewActive(true);
      
      return aiMessage;
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const respondToAI = useCallback(async (userResponse: string, mode: InterviewMode = 'standard') => {
    setIsLoading(true);
    
    // Analyze the user's response
    analyzeResponse(userResponse);
    
    const updatedHistory: ConversationMessage[] = [...conversationHistory, { role: 'user', content: userResponse }];
    setConversationHistory(updatedHistory);
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'respond',
          conversationHistory: updatedHistory,
          userResponse,
          mode,
          responsePatterns: getResponsePatterns(),
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const aiMessage = data.data.message;
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiMessage }]);
      
      return aiMessage;
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast.error('Failed to get response. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const endInterview = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('interview-ai', {
        body: {
          action: 'end',
          conversationHistory,
          responsePatterns: getResponsePatterns(),
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setFeedback(data.data);
      setIsInterviewActive(false);
      
      return data.data;
    } catch (error) {
      console.error('Failed to end interview:', error);
      toast.error('Failed to get feedback. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  const reset = useCallback(() => {
    setConversationHistory([]);
    setFeedback(null);
    setIsInterviewActive(false);
    responseMetrics.current = { lengths: [], hesitations: 0, fillers: 0 };
  }, []);

  return {
    isLoading,
    conversationHistory,
    feedback,
    isInterviewActive,
    startInterview,
    respondToAI,
    endInterview,
    reset,
  };
};
