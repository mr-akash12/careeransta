import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  GraduationCap
} from "lucide-react";

type Step = "board" | "class" | "subject" | "condition" | "questions" | "results";

const boards = ["CBSE", "ICSE", "State Board", "Other"];
const classes = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Economics"];
const preparationLevels = ["Poor", "Average", "Good"];

const ExamPractice = () => {
  const [step, setStep] = useState<Step>("board");
  const [selections, setSelections] = useState({
    board: "",
    class: "",
    subject: "",
    examDate: "",
    preparationLevel: "",
    hoursPerDay: "",
  });

  const handleSelection = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    const steps: Step[] = ["board", "class", "subject", "condition", "questions", "results"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ["board", "class", "subject", "condition", "questions", "results"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: "board", label: "Board" },
      { id: "class", label: "Class" },
      { id: "subject", label: "Subject" },
      { id: "condition", label: "Preparation" },
      { id: "questions", label: "Practice" },
      { id: "results", label: "Results" },
    ];
    const currentIndex = steps.findIndex(s => s.id === step);

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

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          {step === "board" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Select Your Board
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {boards.map((board) => (
                  <button
                    key={board}
                    onClick={() => handleSelection("board", board)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selections.board === board
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <GraduationCap className={`h-8 w-8 mx-auto mb-3 ${
                      selections.board === board ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <p className="font-medium text-foreground">{board}</p>
                  </button>
                ))}
              </div>
              <Button
                variant="hero"
                size="lg"
                className="w-full mt-6"
                disabled={!selections.board}
                onClick={nextStep}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {step === "class" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Select Your Class
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleSelection("class", cls)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selections.class === cls
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground">{cls}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!selections.class}
                  onClick={nextStep}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === "subject" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Select Subject
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSelection("subject", subject)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selections.subject === subject
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground text-sm">{subject}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!selections.subject}
                  onClick={nextStep}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === "condition" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Tell Us About Your Preparation
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={selections.examDate}
                    onChange={(e) => handleSelection("examDate", e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Preparation Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {preparationLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSelection("preparationLevel", level)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selections.preparationLevel === level
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
                    Hours available per day for study
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="e.g., 4"
                    value={selections.hoursPerDay}
                    onChange={(e) => handleSelection("hoursPerDay", e.target.value)}
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!selections.preparationLevel}
                  onClick={nextStep}
                >
                  Generate Questions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === "questions" && (
            <div className="animate-fade-in text-center py-12">
              <div className="animate-pulse">
                <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Generating Questions...
                </h2>
                <p className="text-muted-foreground mb-4">
                  AI is creating personalized questions for {selections.subject} ({selections.board} {selections.class})
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                This feature will be fully functional once the AI integration is complete.
              </p>
              <Link to="/dashboard" className="block mt-6">
                <Button variant="outline">Return to Dashboard</Button>
              </Link>
            </div>
          )}

          {step === "results" && (
            <div className="animate-fade-in text-center py-12">
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Results
              </h2>
              <p className="text-muted-foreground">
                Your exam results will appear here after completing the practice session.
              </p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        {(step === "class" || step === "subject" || step === "condition") && (
          <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Selected:</span>{" "}
              {selections.board}
              {selections.class && ` → ${selections.class}`}
              {selections.subject && ` → ${selections.subject}`}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamPractice;
