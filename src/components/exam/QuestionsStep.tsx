import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

interface Question {
  id: number;
  text: string;
  marks: number;
  type: string;
  options?: string[];
}

interface QuestionsStepProps {
  questions: Question[];
  subject: string;
  board: string;
  classLevel: string;
  onSubmit: (answers: Record<number, string>) => void;
  onPrev: () => void;
  isEvaluating: boolean;
}

export const QuestionsStep = ({
  questions,
  subject,
  board,
  classLevel,
  onSubmit,
  onPrev,
  isEvaluating,
}: QuestionsStepProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const answeredCount = Object.keys(answers).filter((k) => answers[parseInt(k)]?.trim()).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          {subject} - {board} {classLevel}
        </h2>
        <div className="text-sm text-muted-foreground">
          Total Marks: <span className="font-semibold text-foreground">{totalMarks}</span>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 rounded-xl border border-border bg-card"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="font-medium text-foreground">
                Q{index + 1}. {question.text}
              </p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap ml-2">
                {question.marks} marks
              </span>
            </div>

            {question.type === "MCQ" && question.options ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                {question.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleAnswerChange(question.id, option)}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      answers[question.id] === option
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="text-sm text-foreground">{option}</p>
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                placeholder={
                  question.type === "Short Answer"
                    ? "Write your answer in 2-3 sentences..."
                    : "Write your detailed answer..."
                }
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className={`w-full p-3 rounded-xl border border-border bg-background text-foreground resize-none ${
                  question.type === "Long Answer" ? "min-h-[150px]" : "min-h-[80px]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          Answered: <span className="font-medium text-foreground">{answeredCount}</span> of{" "}
          <span className="font-medium text-foreground">{questions.length}</span> questions
        </p>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" size="lg" className="flex-1" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-1"
          disabled={answeredCount === 0 || isEvaluating}
          onClick={() => onSubmit(answers)}
        >
          {isEvaluating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              Submit Answers
              <Send className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
