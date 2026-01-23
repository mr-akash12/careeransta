import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface SettingsStepProps {
  difficulty: string;
  questionType: string;
  numQuestions: number;
  onDifficultyChange: (value: string) => void;
  onQuestionTypeChange: (value: string) => void;
  onNumQuestionsChange: (value: number) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const difficultyLevels = ["Easy", "Medium", "Hard"];
const questionTypes = ["MCQ", "Short Answer", "Long Answer", "Mixed"];

export const SettingsStep = ({
  difficulty,
  questionType,
  numQuestions,
  onDifficultyChange,
  onQuestionTypeChange,
  onNumQuestionsChange,
  onNext,
  onPrev,
  isLoading,
}: SettingsStepProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
        Configure Your Exam
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                onClick={() => onDifficultyChange(level)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  difficulty === level
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground">{level}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Question Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {questionTypes.map((type) => (
              <button
                key={type}
                onClick={() => onQuestionTypeChange(type)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  questionType === type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-medium text-foreground text-sm">{type}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => onNumQuestionsChange(parseInt(e.target.value) || 5)}
            className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
          />
        </div>
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
          disabled={!difficulty || !questionType || isLoading}
          onClick={onNext}
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Questions
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
