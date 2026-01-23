import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, TrendingUp, TrendingDown, Lightbulb, RotateCcw } from "lucide-react";

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

interface Question {
  id: number;
  text: string;
  marks: number;
}

interface ResultsStepProps {
  results: ResultsData;
  questions: Question[];
  onRetry: () => void;
}

export const ResultsStep = ({ results, questions, onRetry }: ResultsStepProps) => {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    if (percentage >= 40) return "text-yellow-500";
    return "text-destructive";
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  return (
    <div className="animate-fade-in">
      {/* Score Summary */}
      <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border border-primary/20">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Your Results
        </h2>
        <div className="flex items-center justify-center gap-8">
          <div>
            <p className={`font-display text-5xl font-bold ${getGradeColor(results.percentage)}`}>
              {results.percentage.toFixed(0)}%
            </p>
            <p className="text-muted-foreground text-sm mt-1">Percentage</p>
          </div>
          <div className="h-16 w-px bg-border" />
          <div>
            <p className={`font-display text-5xl font-bold ${getGradeColor(results.percentage)}`}>
              {getGrade(results.percentage)}
            </p>
            <p className="text-muted-foreground text-sm mt-1">Grade</p>
          </div>
          <div className="h-16 w-px bg-border" />
          <div>
            <p className="font-display text-3xl font-bold text-foreground">
              {results.totalObtained}/{results.totalMarks}
            </p>
            <p className="text-muted-foreground text-sm mt-1">Marks</p>
          </div>
        </div>
      </div>

      {/* Question-wise Evaluation */}
      <div className="mb-8">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Question-wise Evaluation
        </h3>
        <div className="space-y-3">
          {results.evaluations.map((evaluation, index) => {
            const question = questions.find((q) => q.id === evaluation.questionId);
            return (
              <div
                key={evaluation.questionId}
                className={`p-4 rounded-xl border ${
                  evaluation.isCorrect
                    ? "border-success/30 bg-success/5"
                    : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {evaluation.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground text-sm">
                        Q{index + 1}: {question?.text?.substring(0, 60)}...
                      </p>
                      <span className="text-sm font-medium">
                        {evaluation.givenMarks}/{evaluation.totalMarks}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{evaluation.feedback}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-success/30 bg-success/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-success" />
            <h4 className="font-medium text-foreground">Strengths</h4>
          </div>
          <ul className="space-y-1">
            {results.performance.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {strength}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-destructive" />
            <h4 className="font-medium text-foreground">Areas to Improve</h4>
          </div>
          <ul className="space-y-1">
            {results.performance.weakAreas.map((area, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {area}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h4 className="font-medium text-foreground">How to Improve</h4>
          </div>
          <ul className="space-y-1">
            {results.performance.improvements.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground">• {tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" size="lg" className="flex-1" onClick={onRetry}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Practice Again
        </Button>
        <Link to="/dashboard" className="flex-1">
          <Button variant="hero" size="lg" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
