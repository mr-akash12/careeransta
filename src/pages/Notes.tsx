import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles, ArrowRight, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";

const topics = [
  { id: "python", label: "Python", icon: "🐍", description: "Core Python concepts, OOP, data structures" },
  { id: "sql", label: "SQL", icon: "🗄️", description: "Queries, joins, indexing, normalization" },
  { id: "machine-learning", label: "Machine Learning", icon: "🤖", description: "Algorithms, models, evaluation metrics" },
  { id: "data-science", label: "Data Science", icon: "📊", description: "Statistics, visualization, EDA" },
  { id: "javascript", label: "JavaScript", icon: "⚡", description: "ES6+, async, DOM, closures" },
  { id: "react", label: "React", icon: "⚛️", description: "Hooks, state, components, routing" },
  { id: "dsa", label: "DSA", icon: "🧩", description: "Arrays, trees, graphs, dynamic programming" },
  { id: "system-design", label: "System Design", icon: "🏗️", description: "Scalability, microservices, databases" },
];

const subtopicMap: Record<string, string[]> = {
  python: ["Variables & Data Types", "Control Flow", "Functions", "OOP", "File Handling", "Libraries (NumPy, Pandas)", "Error Handling", "Decorators & Generators"],
  sql: ["SELECT & Filtering", "JOINs", "Aggregations", "Subqueries", "Indexing", "Normalization", "Transactions", "Window Functions"],
  "machine-learning": ["Linear Regression", "Logistic Regression", "Decision Trees", "SVM", "Neural Networks", "Clustering", "Evaluation Metrics", "Feature Engineering"],
  "data-science": ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Data Cleaning", "EDA", "Visualization", "Pandas & NumPy", "Statistical Modeling"],
  javascript: ["Variables & Scope", "Functions & Closures", "Promises & Async/Await", "DOM Manipulation", "ES6+ Features", "Event Loop", "Prototypes", "Modules"],
  react: ["JSX & Components", "State & Props", "Hooks (useState, useEffect)", "Context API", "React Router", "Performance Optimization", "Custom Hooks", "Forms & Validation"],
  dsa: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & BST", "Graphs", "Dynamic Programming", "Sorting & Searching", "Recursion & Backtracking"],
  "system-design": ["Load Balancing", "Caching", "Database Sharding", "Microservices", "Message Queues", "API Design", "CAP Theorem", "Rate Limiting"],
};

interface NoteSection {
  heading: string;
  content: string;
  code?: string;
}

const Notes = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateNotes = async () => {
    if (!selectedTopic || !selectedSubtopic) return;
    setIsLoading(true);
    setNotes([]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            topic: topics.find(t => t.id === selectedTopic)?.label || selectedTopic,
            subtopic: selectedSubtopic,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate notes");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.sections)) {
        setNotes(data.sections);
        setExpandedSections(new Set(data.sections.map((_: any, i: number) => i)));
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error generating notes:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate notes");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleBack = () => {
    if (notes.length > 0) {
      setNotes([]);
    } else if (selectedSubtopic) {
      setSelectedSubtopic(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
    }
  };

  const currentStep = !selectedTopic ? "topic" : !selectedSubtopic ? "subtopic" : notes.length > 0 ? "notes" : "subtopic";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span><span className="text-[#ff9f1c]">ANSTA</span>
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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-accent mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Study Notes
          </h1>
          <p className="text-muted-foreground">
            AI-generated notes on any topic — pick a subject and start learning
          </p>
        </div>

        {/* Breadcrumb */}
        {selectedTopic && (
          <div className="mb-6 p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {topics.find(t => t.id === selectedTopic)?.icon}{" "}
              <span className="font-medium text-foreground">
                {topics.find(t => t.id === selectedTopic)?.label}
              </span>
            </span>
            {selectedSubtopic && (
              <>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium text-foreground">{selectedSubtopic}</span>
              </>
            )}
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          {/* Step 1: Topic Selection */}
          {currentStep === "topic" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Choose a Topic
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className="p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all text-center group"
                  >
                    <span className="text-3xl mb-2 block">{topic.icon}</span>
                    <p className="font-medium text-foreground text-sm">{topic.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Subtopic Selection */}
          {currentStep === "subtopic" && selectedTopic && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                Choose a Subtopic
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(subtopicMap[selectedTopic] || []).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubtopic(sub)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedSubtopic === sub
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium text-foreground text-sm">{sub}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  disabled={!selectedSubtopic || isLoading}
                  onClick={handleGenerateNotes}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Notes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Notes Display */}
          {currentStep === "notes" && notes.length > 0 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                {selectedSubtopic} — Notes
              </h2>
              <div className="space-y-4">
                {notes.map((section, index) => (
                  <div key={index} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-semibold text-foreground text-left">{section.heading}</span>
                      {expandedSections.has(index) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {expandedSections.has(index) && (
                      <div className="p-4 space-y-3">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                        {section.code && (
                          <div className="relative">
                            <button
                              onClick={() => copyCode(section.code!, index)}
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted transition-colors"
                            >
                              {copiedIndex === index ? (
                                <Check className="h-3.5 w-3.5 text-green-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                            <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono text-foreground">
                              <code>{section.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleGenerateNotes}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notes;
