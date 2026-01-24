import { Smile, Zap, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { InterviewMode } from '@/hooks/useInterviewAI';

interface ModeSelectorProps {
  selectedMode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
}

const modes: { id: InterviewMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Warm and encouraging atmosphere',
    icon: <Smile className="h-5 w-5" />,
  },
  {
    id: 'standard',
    label: 'Standard',
    description: 'Professional and balanced',
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: 'stress',
    label: 'Stress Test',
    description: 'Challenging and fast-paced',
    icon: <Zap className="h-5 w-5" />,
  },
];

export const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Interview Mode</h3>
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className={cn(
              'cursor-pointer transition-all hover:border-primary/50',
              selectedMode === mode.id && 'border-primary bg-primary/5'
            )}
            onClick={() => onModeChange(mode.id)}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                'mx-auto mb-2 h-10 w-10 rounded-lg flex items-center justify-center',
                selectedMode === mode.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {mode.icon}
              </div>
              <p className="font-medium text-sm">{mode.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{mode.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
