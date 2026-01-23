import { useState } from "react";
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  marks: number;
  type: string;
  options?: string[];
}

interface Evaluation {
  questionId: number;
  givenMarks: number;
  totalMarks: number;
  feedback: string;
  isCorrect: boolean;
}

interface Performance {
  strengths: string[];
  weakAreas: string[];
  improvements: string[];
}

interface ResultsData {
  evaluations: Evaluation[];
  totalObtained: number;
  totalMarks: number;
  percentage: number;
  performance: Performance;
}

interface ExamSelections {
  board: string;
  class: string;
  subject: string;
  difficulty: string;
  questionType: string;
  numQuestions: number;
}

export const useExamEngine = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<ResultsData | null>(null);

  const generateQuestions = async (selections: ExamSelections) => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exam-engine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "generate",
            board: selections.board,
            class: selections.class,
            subject: selections.subject,
            difficulty: selections.difficulty,
            questionType: selections.questionType,
            numQuestions: selections.numQuestions,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setQuestions(data.data);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate questions");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluateAnswers = async (
    selections: ExamSelections,
    answers: Record<number, string>
  ) => {
    setIsEvaluating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exam-engine`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "evaluate",
            board: selections.board,
            class: selections.class,
            subject: selections.subject,
            difficulty: selections.difficulty,
            questionType: selections.questionType,
            numQuestions: selections.numQuestions,
            questions,
            answers,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to evaluate answers");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setResults(data.data);
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error evaluating answers:", error);
      toast.error(error instanceof Error ? error.message : "Failed to evaluate answers");
      return false;
    } finally {
      setIsEvaluating(false);
    }
  };

  const reset = () => {
    setQuestions([]);
    setResults(null);
  };

  return {
    isGenerating,
    isEvaluating,
    questions,
    results,
    generateQuestions,
    evaluateAnswers,
    reset,
  };
};
