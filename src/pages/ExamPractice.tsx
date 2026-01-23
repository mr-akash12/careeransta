import { useState } from "react";
import { ExamHeader, ExamTitle } from "@/components/exam/ExamHeader";
import { StepIndicator, ExamStep, getAllSteps, getStepIndex } from "@/components/exam/StepIndicator";
import { SelectionStep } from "@/components/exam/SelectionStep";
import { SettingsStep } from "@/components/exam/SettingsStep";
import { QuestionsStep } from "@/components/exam/QuestionsStep";
import { ResultsStep } from "@/components/exam/ResultsStep";
import { useExamEngine } from "@/hooks/useExamEngine";

const boards = ["CBSE", "ICSE", "State Board", "Other"];
const classes = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Economics"];

const ExamPractice = () => {
  const [step, setStep] = useState<ExamStep>("board");
  const [selections, setSelections] = useState({
    board: "",
    class: "",
    subject: "",
    difficulty: "Medium",
    questionType: "MCQ",
    numQuestions: 5,
  });

  const {
    isGenerating,
    isEvaluating,
    questions,
    results,
    generateQuestions,
    evaluateAnswers,
    reset,
  } = useExamEngine();

  const handleSelection = (key: string, value: string | number) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    const steps = getAllSteps();
    const currentIndex = getStepIndex(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps = getAllSteps();
    const currentIndex = getStepIndex(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleGenerateQuestions = async () => {
    const success = await generateQuestions(selections);
    if (success) {
      nextStep();
    }
  };

  const handleSubmitAnswers = async (answers: Record<number, string>) => {
    const success = await evaluateAnswers(selections, answers);
    if (success) {
      nextStep();
    }
  };

  const handleRetry = () => {
    reset();
    setStep("board");
    setSelections({
      board: "",
      class: "",
      subject: "",
      difficulty: "Medium",
      questionType: "MCQ",
      numQuestions: 5,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ExamHeader />

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl">
        <ExamTitle />
        <StepIndicator currentStep={step} />

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          {step === "board" && (
            <SelectionStep
              title="Select Your Board"
              options={boards}
              selectedValue={selections.board}
              onSelect={(value) => handleSelection("board", value)}
              onNext={nextStep}
              showIcon
            />
          )}

          {step === "class" && (
            <SelectionStep
              title="Select Your Class"
              options={classes}
              selectedValue={selections.class}
              onSelect={(value) => handleSelection("class", value)}
              onNext={nextStep}
              onPrev={prevStep}
              showBack
              gridCols="grid-cols-2 md:grid-cols-3"
            />
          )}

          {step === "subject" && (
            <SelectionStep
              title="Select Subject"
              options={subjects}
              selectedValue={selections.subject}
              onSelect={(value) => handleSelection("subject", value)}
              onNext={nextStep}
              onPrev={prevStep}
              showBack
              gridCols="grid-cols-2 md:grid-cols-4"
            />
          )}

          {step === "settings" && (
            <SettingsStep
              difficulty={selections.difficulty}
              questionType={selections.questionType}
              numQuestions={selections.numQuestions}
              onDifficultyChange={(value) => handleSelection("difficulty", value)}
              onQuestionTypeChange={(value) => handleSelection("questionType", value)}
              onNumQuestionsChange={(value) => handleSelection("numQuestions", value)}
              onNext={handleGenerateQuestions}
              onPrev={prevStep}
              isLoading={isGenerating}
            />
          )}

          {step === "questions" && questions.length > 0 && (
            <QuestionsStep
              questions={questions}
              subject={selections.subject}
              board={selections.board}
              classLevel={selections.class}
              onSubmit={handleSubmitAnswers}
              onPrev={prevStep}
              isEvaluating={isEvaluating}
            />
          )}

          {step === "results" && results && (
            <ResultsStep
              results={results}
              questions={questions}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Summary Card */}
        {(step === "class" || step === "subject" || step === "settings") && (
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
