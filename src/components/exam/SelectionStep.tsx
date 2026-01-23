import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";

interface SelectionStepProps {
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onPrev?: () => void;
  showBack?: boolean;
  nextLabel?: string;
  gridCols?: string;
  showIcon?: boolean;
}

export const SelectionStep = ({
  title,
  options,
  selectedValue,
  onSelect,
  onNext,
  onPrev,
  showBack = false,
  nextLabel = "Continue",
  gridCols = "grid-cols-2",
  showIcon = false,
}: SelectionStepProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
        {title}
      </h2>
      <div className={`grid ${gridCols} gap-4`}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`p-4 md:p-6 rounded-xl border-2 transition-all ${
              selectedValue === option
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            {showIcon && (
              <GraduationCap className={`h-8 w-8 mx-auto mb-3 ${
                selectedValue === option ? "text-primary" : "text-muted-foreground"
              }`} />
            )}
            <p className="font-medium text-foreground">{option}</p>
          </button>
        ))}
      </div>
      <div className={`flex gap-4 mt-6 ${showBack ? "" : "justify-center"}`}>
        {showBack && onPrev && (
          <Button variant="outline" size="lg" className="flex-1" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          variant="hero"
          size="lg"
          className={showBack ? "flex-1" : "w-full"}
          disabled={!selectedValue}
          onClick={onNext}
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
