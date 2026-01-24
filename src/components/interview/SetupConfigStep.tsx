import { Video, Mic, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SetupConfigStepProps {
  duration: '15' | '30' | '60';
  interviewType: string;
  interviewRound: string;
  customInstructions: string;
  showCustomInstructions: boolean;
  onDurationChange: (value: '15' | '30' | '60') => void;
  onInterviewTypeChange: (value: string) => void;
  onInterviewRoundChange: (value: string) => void;
  onCustomInstructionsChange: (value: string) => void;
  onToggleCustomInstructions: (value: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

const durations = [
  { value: '15', label: '15 mins', description: 'Quick' },
  { value: '30', label: '30 mins', description: 'Standard' },
  { value: '60', label: '60 mins', description: 'In-depth' },
] as const;

const interviewTypes = [
  'Technical / Coding',
  'Behavioral',
  'System Design',
  'Case Study',
  'HR / General',
];

const interviewRounds = [
  'Phone Screen',
  'Technical Round 1',
  'Technical Round 2',
  'System Design',
  'Behavioral',
  'Final Round',
  'HR Round',
];

export const SetupConfigStep = ({
  duration,
  interviewType,
  interviewRound,
  customInstructions,
  showCustomInstructions,
  onDurationChange,
  onInterviewTypeChange,
  onInterviewRoundChange,
  onCustomInstructionsChange,
  onToggleCustomInstructions,
  onNext,
  onPrev,
}: SetupConfigStepProps) => {
  return (
    <div className="space-y-8">
      {/* Interview Duration */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Interview duration*</Label>
        <div className="grid grid-cols-3 gap-3">
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => onDurationChange(d.value)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-center',
                duration === d.value
                  ? 'border-primary bg-accent/20 shadow-sm'
                  : 'border-border bg-card hover:border-muted-foreground/30'
              )}
            >
              <p className={cn(
                'font-semibold',
                duration === d.value ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {d.label}
              </p>
              <p className="text-sm text-muted-foreground">{d.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interview Type */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Interview type*</Label>
        <Select value={interviewType} onValueChange={onInterviewTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select interview type" />
          </SelectTrigger>
          <SelectContent>
            {interviewTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interview Round */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Interview round*</Label>
        <Select value={interviewRound} onValueChange={onInterviewRoundChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select the interview round" />
          </SelectTrigger>
          <SelectContent>
            {interviewRounds.map((round) => (
              <SelectItem key={round} value={round}>
                {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Instructions */}
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Label className="text-foreground font-medium">Custom Instructions to the AI interviewer</Label>
            <p className="text-sm text-muted-foreground mt-1">
              (This enhances your practice with questions asked in past interviews or instructs AI to focus on specific skills for the interview)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={showCustomInstructions}
              onCheckedChange={onToggleCustomInstructions}
            />
            <span className="text-sm text-muted-foreground">Upload files or type instructions</span>
          </div>
        </div>
        
        {showCustomInstructions && (
          <Textarea
            placeholder="e.g., Focus on React hooks and state management. Ask about my experience with TypeScript..."
            value={customInstructions}
            onChange={(e) => onCustomInstructionsChange(e.target.value)}
            rows={4}
            className="resize-none"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Back
        </Button>
        <Button
          variant="hero"
          onClick={onNext}
          disabled={!interviewType || !interviewRound}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
