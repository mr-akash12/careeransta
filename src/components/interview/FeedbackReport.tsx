import { 
  Award, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  MessageSquare,
  Eye,
  Smile,
  Brain,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FeedbackReportProps {
  feedback: {
    closingRemarks: string;
    scores: {
      communication: number;
      confidence: number;
      technicalKnowledge: number;
      bodyLanguage: number;
      overallImpression: number;
    };
    strengths: string[];
    improvements: string[];
    actionableTips: string[];
    overallFeedback: string;
  };
  onStartNew: () => void;
}

const ScoreItem = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-primary">{score}/10</span>
    </div>
    <Progress value={score * 10} className="h-2" />
  </div>
);

export const FeedbackReport = ({ feedback, onStartNew }: FeedbackReportProps) => {
  const averageScore = Object.values(feedback.scores).reduce((a, b) => a + b, 0) / Object.values(feedback.scores).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
          <Award className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Interview Complete!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {feedback.closingRemarks}
        </p>
      </div>

      {/* Overall Score */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {averageScore.toFixed(1)}
          </div>
          <p className="text-sm text-muted-foreground">Overall Score</p>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreItem 
            label="Communication" 
            score={feedback.scores.communication || 0} 
            icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
          />
          <ScoreItem 
            label="Confidence" 
            score={feedback.scores.confidence || 0} 
            icon={<Smile className="h-4 w-4 text-muted-foreground" />}
          />
          <ScoreItem 
            label="Technical Knowledge" 
            score={feedback.scores.technicalKnowledge || 0} 
            icon={<Brain className="h-4 w-4 text-muted-foreground" />}
          />
          <ScoreItem 
            label="Body Language" 
            score={feedback.scores.bodyLanguage || 0} 
            icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          />
          <ScoreItem 
            label="Overall Impression" 
            score={feedback.scores.overallImpression || 0} 
            icon={<Award className="h-4 w-4 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              What You Did Well
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Actionable Tips for Your Next Interview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {feedback.actionableTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent">{index + 1}</span>
                </div>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed text-foreground">
            {feedback.overallFeedback}
          </p>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button onClick={onStartNew} variant="hero" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Practice Another Interview
        </Button>
      </div>
    </div>
  );
};
