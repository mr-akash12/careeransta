import { CheckCircle } from "lucide-react";

export type ExamStep = "board" | "class" | "subject" | "settings" | "questions" | "results";

interface StepIndicatorProps {
  currentStep: ExamStep;
}

const steps: { id: ExamStep; label: string }[] = [
  { id: "board", label: "Board" },
  { id: "class", label: "Class" },
  { id: "subject", label: "Subject" },
  { id: "settings", label: "Settings" },
  { id: "questions", label: "Practice" },
  { id: "results", label: "Results" },
];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, index) => (
        <div key={s.id} className="flex items-center">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index < currentIndex
                ? "bg-success text-success-foreground"
                : index === currentIndex
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index < currentIndex ? <CheckCircle className="h-4 w-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-1 ${
                index < currentIndex ? "bg-success" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const getStepIndex = (step: ExamStep): number => {
  return steps.findIndex(s => s.id === step);
};

export const getAllSteps = (): ExamStep[] => {
  return steps.map(s => s.id);
};
