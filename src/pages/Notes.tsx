import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Sparkles, ArrowRight, Search } from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import NotesDisplay, { type NotesData } from "@/components/notes/NotesDisplay";

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

const Notes = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [notesData, setNotesData] = useState<NotesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(t =>
      t.label.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleGenerateNotes = async () => {
    if (!selectedTopic || !selectedSubtopic) return;
    setIsLoading(true);
    setNotesData(null);

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
        setNotesData({
          title: data.title || selectedSubtopic,
          subtitle: data.subtitle || "",
          tags: data.tags || [],
          sections: data.sections,
        });
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

  const handleBack = () => {
    if (notesData) {
      setNotesData(null);
    } else if (selectedSubtopic) {
      setSelectedSubtopic(null);
    } else if (selectedTopic) {
      setSelectedTopic(null);
    }
  };

  const currentStep = !selectedTopic ? "topic" : !selectedSubtopic ? "subtopic" : notesData ? "notes" : "subtopic";

  return (
    <div className="min-h-screen bg-[hsl(240,25%,4%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(240,20%,5%)]/92 backdrop-blur-xl border-b border-[hsl(240,15%,20%)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span><span className="text-[hsl(35,100%,55%)]">ANSTA</span>
              </span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-[hsl(240,15%,65%)] hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[hsl(240,15%,92%)] mb-2 tracking-tight">
            Study Notes
          </h1>
          <p className="text-[hsl(240,15%,60%)]">
            AI-generated notes on any topic — pick a subject and start learning
          </p>
        </div>

        {/* Breadcrumb */}
        {selectedTopic && (
          <div className="mb-6 p-3 rounded-xl bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] flex items-center gap-2 text-sm">
            <span className="text-[hsl(240,15%,60%)]">
              {topics.find(t => t.id === selectedTopic)?.icon}{" "}
              <span className="font-medium text-[hsl(240,15%,90%)]">
                {topics.find(t => t.id === selectedTopic)?.label}
              </span>
            </span>
            {selectedSubtopic && (
              <>
                <ArrowRight className="h-3 w-3 text-[hsl(240,15%,40%)]" />
                <span className="font-medium text-[hsl(240,15%,90%)]">{selectedSubtopic}</span>
              </>
            )}
          </div>
        )}

        <div className={currentStep === "notes" ? "" : "bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-2xl p-6 md:p-8"}>
          {/* Step 1: Topic Selection */}
          {currentStep === "topic" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-[hsl(240,15%,92%)] mb-4 text-center">
                Choose a Topic
              </h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(240,15%,40%)]" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[hsl(240,20%,6%)] border-[hsl(240,15%,20%)] text-[hsl(240,15%,90%)] placeholder:text-[hsl(240,15%,35%)]"
                />
              </div>
              {filteredTopics.length === 0 ? (
                <p className="text-center text-[hsl(240,15%,50%)] py-8">No topics match your search.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => { setSelectedTopic(topic.id); setSearchQuery(""); }}
                      className="p-4 rounded-xl border-2 border-[hsl(240,15%,20%)] hover:border-[hsl(250,100%,70%)]/50 bg-[hsl(240,15%,8%)] transition-all text-center group active:scale-[0.97]"
                    >
                      <span className="text-3xl mb-2 block">{topic.icon}</span>
                      <p className="font-medium text-[hsl(240,15%,90%)] text-sm">{topic.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Subtopic Selection */}
          {currentStep === "subtopic" && selectedTopic && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-semibold text-[hsl(240,15%,92%)] mb-6 text-center">
                Choose a Subtopic
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(subtopicMap[selectedTopic] || []).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubtopic(sub)}
                    className={`p-3 rounded-xl border-2 transition-all text-left active:scale-[0.97] ${
                      selectedSubtopic === sub
                        ? "border-[hsl(250,100%,70%)] bg-[hsl(250,100%,70%)]/5"
                        : "border-[hsl(240,15%,20%)] hover:border-[hsl(250,100%,70%)]/50 bg-[hsl(240,15%,8%)]"
                    }`}
                  >
                    <p className="font-medium text-[hsl(240,15%,90%)] text-sm">{sub}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="lg" className="flex-1 border-[hsl(240,15%,20%)] text-[hsl(240,15%,70%)] hover:bg-[hsl(240,15%,12%)]" onClick={handleBack}>
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
          {currentStep === "notes" && notesData && (
            <div className="animate-fade-in">
              <NotesDisplay data={notesData} />

              <div className="flex gap-4 mt-8">
                <Button variant="outline" size="lg" className="flex-1 border-[hsl(240,15%,20%)] text-[hsl(240,15%,70%)] hover:bg-[hsl(240,15%,12%)]" onClick={handleBack}>
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
