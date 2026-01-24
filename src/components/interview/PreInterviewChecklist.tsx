import { Check, Camera, Mic, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PreInterviewChecklistProps {
  onReady: () => void;
}

const tips = [
  {
    icon: <Monitor className="h-5 w-5" />,
    title: 'Good lighting',
    description: 'Make sure your face is well-lit and visible',
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: 'Look at the camera',
    description: 'Maintain eye contact with the camera lens',
  },
  {
    icon: <Mic className="h-5 w-5" />,
    title: 'Speak clearly',
    description: 'Enunciate and speak at a moderate pace',
  },
];

export const PreInterviewChecklist = ({ onReady }: PreInterviewChecklistProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Before We Begin
        </h3>
        
        <div className="space-y-4 mb-6">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                {tip.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground">
            <strong>Pro tip:</strong> Find a quiet space with minimal background noise. 
            Take a deep breath and remember - this is practice, not the real thing!
          </p>
        </div>

        <Button onClick={onReady} variant="hero" size="lg" className="w-full">
          <Check className="h-4 w-4 mr-2" />
          I'm Ready to Start
        </Button>
      </CardContent>
    </Card>
  );
};
