import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  ArrowLeft,
  Upload,
  Sparkles
} from "lucide-react";

const AIInterview = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                CareerAscend
              </span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            AI Mock Interview
          </h1>
          <p className="text-muted-foreground">
            Practice with our AI interviewer and get personalized feedback
          </p>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="text-center py-8">
            <div className="h-24 w-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Upload Your Resume
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your resume (PDF) and select your target role. Our AI will analyze it and generate personalized interview questions.
            </p>
            <Button variant="hero" size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resume (PDF)
            </Button>
            <p className="text-sm text-muted-foreground mt-8">
              This feature will be fully functional once the AI integration is complete.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIInterview;
