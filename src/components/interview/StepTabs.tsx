import { cn } from '@/lib/utils';

interface StepTabsProps {
  currentStep: number;
  steps: string[];
}

export const StepTabs = ({ currentStep, steps }: StepTabsProps) => {
  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      {steps.map((step, index) => (
        <div
          key={step}
          className={cn(
            'relative pb-2 font-medium transition-colors',
            index + 1 === currentStep
              ? 'text-foreground'
              : index + 1 < currentStep
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          <span className="mr-2">{index + 1}.</span>
          {step}
          {index + 1 === currentStep && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </div>
      ))}
    </div>
  );
};
