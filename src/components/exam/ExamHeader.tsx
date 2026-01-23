import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, BookOpen } from "lucide-react";

export const ExamHeader = () => {
  return (
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
  );
};

export const ExamTitle = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success mb-4">
        <BookOpen className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">
        Exam Practice
      </h1>
      <p className="text-muted-foreground">
        AI-generated questions based on your board, class, and syllabus
      </p>
    </div>
  );
};
