import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import logo from "@/assets/logo.png";
import { LangToggle } from "@/components/LangToggle";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── DATA ────────────────────────────────────────────────────────────────────

const allTopics = [
  { id: "python-basics",       label: "Python Basics",         icon: "🐍", tag: "Python" },
  { id: "numpy",               label: "NumPy",                 icon: "🔢", tag: "Python" },
  { id: "pandas",              label: "Pandas",                icon: "🐼", tag: "Python" },
  { id: "matplotlib",          label: "Matplotlib",            icon: "📈", tag: "Visualization" },
  { id: "seaborn",             label: "Seaborn",               icon: "🎨", tag: "Visualization" },
  { id: "preprocessing",       label: "Data Preprocessing",    icon: "🧹", tag: "ML" },
  { id: "linear-regression",   label: "Linear Regression",     icon: "📉", tag: "ML" },
  { id: "logistic-regression", label: "Logistic Regression",   icon: "🎯", tag: "ML" },
  { id: "decision-tree",       label: "Decision Tree",         icon: "🌳", tag: "ML" },
  { id: "random-forest",       label: "Random Forest",         icon: "🌲", tag: "ML" },
  { id: "svm",                 label: "SVM",                   icon: "🔪", tag: "ML" },
  { id: "kmeans",              label: "K-Means Clustering",    icon: "🎯", tag: "ML" },
  { id: "knn",                 label: "KNN",                   icon: "👥", tag: "ML" },
  { id: "naive-bayes",         label: "Naive Bayes",           icon: "📊", tag: "ML" },
];

// Notes content — EN and HI
const notesContent: Record<string, { en: any; hi: any }> = {
  "python-basics": {
    en: {
      title: "Python Basics",
      subtitle: "The foundation of Data Science & ML",
      sections: [
        {
          heading: "What is Python?",
          icon: "🤔",
          blocks: [
            { type: "text", content: "Python is a <hl>high-level, interpreted programming language</hl> created by Guido van Rossum in 1991. It reads almost like English — making it the #1 choice for Data Science and ML worldwide." },
            { type: "real-world", content: "Netflix uses Python for its recommendation engine. When Netflix says 'You might like this show' — that's Python + ML working behind the scenes!" },
            { type: "info", variant: "tip", content: "Python is free, open-source, and runs on all operating systems." },
          ]
        },
        {
          heading: "Variables & Data Types",
          icon: "🔤",
          blocks: [
            { type: "text", content: "A <hl>variable</hl> is a named container that stores data. Python automatically detects the type — no need to declare!" },
            { type: "code", lang: "python", code: `# Variables — type declare nahi karte\nname     = "Rahul"      # str  (text)\nage      = 22            # int  (integer)\nsalary   = 45000.50     # float (decimal)\nis_student = True        # bool (True/False)\n\nprint(type(name))        # <class 'str'>\nprint(type(age))         # <class 'int'>\n\n# Multiple assignment\nx, y, z = 10, 20, 30\nprint(x + y + z)         # 60` },
            { type: "output", content: "<class 'str'>\n<class 'int'>\n60" },
          ]
        },
        {
          heading: "Functions",
          icon: "⚙️",
          blocks: [
            { type: "text", content: "Functions are <hl>reusable blocks of code</hl>. Define once, use many times." },
            { type: "code", lang: "python", code: `def greet(name, lang="en"):\n    if lang == "hi":\n        return f"Namaste, {name}!"\n    return f"Hello, {name}!"\n\nprint(greet("Aman"))         # Hello, Aman!\nprint(greet("Aman", "hi"))   # Namaste, Aman!\n\n# Lambda — one-line function\nsquare = lambda x: x ** 2\nprint(square(5))             # 25` },
          ]
        },
      ]
    },
    hi: {
      title: "Python Basics",
      subtitle: "Data Science aur ML ki buniyaad",
      sections: [
        {
          heading: "Python kya hai?",
          icon: "🤔",
          blocks: [
            { type: "text", content: "Python ek <hl>high-level programming language</hl> hai jo Guido van Rossum ne 1991 mein banai. Ye almost English jaisi padhi jaati hai — isliye Data Science aur ML ke liye duniya mein #1 choice hai." },
            { type: "real-world", content: "Netflix apna recommendation engine Python se chalata hai. Jab Netflix kehta hai 'Aapko ye show pasand aa sakta hai' — wahan Python + ML kaam kar raha hota hai!" },
            { type: "info", variant: "tip", content: "Python free, open-source hai aur sabhi operating systems pe chalta hai." },
          ]
        },
        {
          heading: "Variables aur Data Types",
          icon: "🔤",
          blocks: [
            { type: "text", content: "<hl>Variable</hl> ek named container hai jo data store karta hai. Python automatically type samajh leta hai — declare karne ki zaroorat nahi!" },
            { type: "code", lang: "python", code: `# Variables — type declare nahi karte\nname     = "Rahul"      # str  (text)\nage      = 22            # int  (poora number)\nsalary   = 45000.50     # float (decimal)\nis_student = True        # bool (True/False)\n\nprint(type(name))        # <class 'str'>\nprint(type(age))         # <class 'int'>\n\n# Ek saath multiple assignment\nx, y, z = 10, 20, 30\nprint(x + y + z)         # 60` },
            { type: "output", content: "<class 'str'>\n<class 'int'>\n60" },
          ]
        },
        {
          heading: "Functions",
          icon: "⚙️",
          blocks: [
            { type: "text", content: "Functions <hl>reusable code ke blocks</hl> hote hain. Ek baar define karo, baar baar use karo." },
            { type: "code", lang: "python", code: `def greet(name, lang="en"):\n    if lang == "hi":\n        return f"Namaste, {name}!"\n    return f"Hello, {name}!"\n\nprint(greet("Aman"))         # Hello, Aman!\nprint(greet("Aman", "hi"))   # Namaste, Aman!\n\n# Lambda — ek line ka function\nsquare = lambda x: x ** 2\nprint(square(5))             # 25` },
          ]
        },
      ]
    }
  },
  "linear-regression": {
    en: {
      title: "Linear Regression",
      subtitle: "Supervised Learning — Predicting continuous values",
      sections: [
        {
          heading: "What is Linear Regression?",
          icon: "🎯",
          blocks: [
            { type: "text", content: "Linear Regression finds the <hl>best straight line</hl> through data points to predict a continuous output like house price, salary, or temperature." },
            { type: "real-world", content: "Predicting a student's exam score based on hours studied. More hours → Higher score. That straight-line relationship = Linear Regression!" },
            { type: "math", title: "📐 EQUATION", content: "ŷ = mx + b\n\nŷ = predicted value\nm = slope (how steep the line is)\nb = intercept (y when x=0)\n\nExample: Score = 6.5 × hours + 28\nStudy 5 hours → Score = 6.5×5 + 28 = 60.5" },
          ]
        },
        {
          heading: "Cost Function — MSE",
          icon: "📐",
          blocks: [
            { type: "math", title: "📐 MEAN SQUARED ERROR", content: "MSE = (1/n) × Σ(yᵢ - ŷᵢ)²\n\nyᵢ = actual value\nŷᵢ = predicted value\nn  = number of samples\n\nWe MINIMIZE this using Gradient Descent!" },
          ]
        },
        {
          heading: "Full Code",
          icon: "💻",
          blocks: [
            { type: "code", lang: "python", code: `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\n\nhours  = np.array([1,2,3,4,5,6,7,8,9,10]).reshape(-1,1)\nscores = np.array([35,42,50,58,65,70,78,85,88,95])\n\nX_train, X_test, y_train, y_test = train_test_split(\n    hours, scores, test_size=0.2, random_state=42\n)\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint(f"Slope: {model.coef_[0]:.2f}")\nprint(f"Intercept: {model.intercept_:.2f}")\n\ny_pred = model.predict(X_test)\nprint(f"R² Score: {r2_score(y_test, y_pred):.4f}")\nprint(model.predict([[7]]))  # 7 hours ka score?` },
            { type: "output", content: "Slope: 6.52\nIntercept: 28.14\nR² Score: 0.9823\n[73.78]" },
            { type: "info", variant: "tip", content: "R² = 1.0 means perfect model. R² = 0 means model is useless. Aim for R² > 0.85!" },
          ]
        },
        {
          heading: "Advantages & Disadvantages",
          icon: "⚖️",
          blocks: [
            { type: "table", headers: ["✅ Advantages", "❌ Disadvantages"], rows: [
              ["Simple to understand", "Assumes linear relationship"],
              ["Very fast training", "Sensitive to outliers"],
              ["Works great on linear data", "Poor on complex data"],
            ]},
          ]
        },
      ]
    },
    hi: {
      title: "Linear Regression",
      subtitle: "Supervised Learning — Continuous values predict karna",
      sections: [
        {
          heading: "Linear Regression kya hai?",
          icon: "🎯",
          blocks: [
            { type: "text", content: "Linear Regression data points ke through <hl>sabse acchi seedhi line</hl> dhundhta hai taaki continuous output predict kar sake — jaise ghar ka daam, salary, ya temperature." },
            { type: "real-world", content: "Ek student ka exam score padhne ke ghanton ke basis par predict karna. Zyada ghante → Zyada score. Ye seedha sambandh = Linear Regression!" },
            { type: "math", title: "📐 EQUATION", content: "ŷ = mx + b\n\nŷ = predicted value (jo hum chahte hain)\nm = slope (line kitni tedhi hai)\nb = intercept (jab x=0 tab y ki value)\n\nExample: Score = 6.5 × ghante + 28\n5 ghante padho → Score = 6.5×5 + 28 = 60.5" },
          ]
        },
        {
          heading: "Cost Function — MSE",
          icon: "📐",
          blocks: [
            { type: "math", title: "📐 MEAN SQUARED ERROR", content: "MSE = (1/n) × Σ(yᵢ - ŷᵢ)²\n\nyᵢ = actual value (jo sach mein hai)\nŷᵢ = predicted value (model ne kya kaha)\nn  = kitne samples hain\n\nHum isko MINIMIZE karte hain Gradient Descent se!" },
          ]
        },
        {
          heading: "Poora Code",
          icon: "💻",
          blocks: [
            { type: "code", lang: "python", code: `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\n\n# Data: padhne ke ghante vs exam score\nhours  = np.array([1,2,3,4,5,6,7,8,9,10]).reshape(-1,1)\nscores = np.array([35,42,50,58,65,70,78,85,88,95])\n\n# Train-Test split karo\nX_train, X_test, y_train, y_test = train_test_split(\n    hours, scores, test_size=0.2, random_state=42\n)\n\n# Model banao aur train karo\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\nprint(f"Slope: {model.coef_[0]:.2f}")\nprint(f"Intercept: {model.intercept_:.2f}")\n\ny_pred = model.predict(X_test)\nprint(f"R² Score: {r2_score(y_test, y_pred):.4f}")\nprint(model.predict([[7]]))  # 7 ghante padha toh score?` },
            { type: "output", content: "Slope: 6.52\nIntercept: 28.14\nR² Score: 0.9823\n[73.78]" },
            { type: "info", variant: "tip", content: "R² = 1.0 matlab perfect model. R² = 0 matlab model bekaar hai. R² > 0.85 ka target rakho!" },
          ]
        },
        {
          heading: "Fayde aur Nuksan",
          icon: "⚖️",
          blocks: [
            { type: "table", headers: ["✅ Fayde (Advantages)", "❌ Nuksan (Disadvantages)"], rows: [
              ["Samajhna aasaan hai", "Seedha sambandh maanta hai"],
              ["Training bahut tez hoti hai", "Outliers se affected hota hai"],
              ["Linear data pe zabardast", "Complex data pe kamzor"],
            ]},
          ]
        },
      ]
    }
  },
};

// Fallback for topics not yet written
const fallbackNote = (label: string, icon: string) => ({
  en: { title: label, subtitle: "Coming soon with full notes!", sections: [{ heading: "Coming Soon", icon: "🚧", blocks: [{ type: "info" as const, variant: "note" as const, content: `Full notes for ${label} are being prepared. Check back soon!` }] }] },
  hi: { title: label, subtitle: "Jald aa raha hai!", sections: [{ heading: "Jald Aa Raha Hai", icon: "🚧", blocks: [{ type: "info" as const, variant: "note" as const, content: `${label} ke poore notes teyar ho rahe hain. Thoda wait karo!` }] }] },
});

// ─── RENDERERS ───────────────────────────────────────────────────────────────

function HighlightedText({ content }: { content: string }) {
  const parts = content.split(/(<hl>.*?<\/hl>)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^<hl>(.*)<\/hl>$/);
        if (match) return <span key={i} className="text-[hsl(160,80%,65%)] font-semibold">{match[1]}</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function CodeBlock({ block }: { block: any }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-[10px] border border-[hsl(240,15%,20%)] overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(240,15%,12%)] border-b border-[hsl(240,15%,20%)]">
        <span className="font-mono text-[0.72rem] font-semibold text-[hsl(250,100%,75%)] uppercase tracking-wider">{block.lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(block.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="font-mono text-[0.72rem] px-2 py-0.5 border border-[hsl(240,15%,20%)] text-[hsl(240,20%,50%)] rounded hover:border-[hsl(250,100%,75%)] hover:text-[hsl(250,100%,75%)] transition-colors flex items-center gap-1">
          {copied ? <><Check className="h-3 w-3" /> copied</> : <><Copy className="h-3 w-3" /> copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[0.82rem] leading-[1.7] text-[hsl(240,20%,85%)] bg-[hsl(240,20%,5%)] whitespace-pre"><code>{block.code}</code></pre>
    </div>
  );
}

const infoStyles: Record<string, any> = {
  tip:    { bg: "bg-[hsl(160,40%,8%)]",  border: "border-[hsl(160,60%,30%)]", text: "text-[hsl(160,60%,80%)]", icon: "💡" },
  warn:   { bg: "bg-[hsl(45,40%,8%)]",   border: "border-[hsl(45,60%,30%)]",  text: "text-[hsl(45,60%,80%)]",  icon: "⚠️" },
  note:   { bg: "bg-[hsl(250,40%,10%)]", border: "border-[hsl(250,60%,35%)]", text: "text-[hsl(250,60%,80%)]", icon: "📝" },
  danger: { bg: "bg-[hsl(0,40%,10%)]",   border: "border-[hsl(0,60%,30%)]",   text: "text-[hsl(0,60%,80%)]",   icon: "🚨" },
};

function BlockRenderer({ block }: { block: any }) {
  switch (block.type) {
    case "text":
      return <p className="text-[0.92rem] leading-[1.75] text-[hsl(240,15%,70%)] my-2"><HighlightedText content={block.content} /></p>;
    case "code":
      return <CodeBlock block={block} />;
    case "info": {
      const s = infoStyles[block.variant] || infoStyles.note;
      return (
        <div className={`rounded-[10px] p-3 px-4 my-3 flex gap-3 items-start border ${s.bg} ${s.border} ${s.text}`}>
          <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
          <p className="text-[0.88rem] leading-[1.7]"><HighlightedText content={block.content} /></p>
        </div>
      );
    }
    case "real-world":
      return (
        <div className="my-3 rounded-[10px] border border-[hsl(45,60%,30%)] border-l-4 border-l-[hsl(45,80%,60%)] bg-gradient-to-r from-[hsl(45,30%,7%)] to-[hsl(0,20%,6%)] p-4 px-5">
          <div className="font-mono text-[0.7rem] font-bold tracking-[2px] uppercase text-[hsl(45,80%,60%)] mb-2">🌍 Real World Example</div>
          <p className="text-[0.88rem] text-[hsl(45,60%,80%)] leading-[1.7]"><HighlightedText content={block.content} /></p>
        </div>
      );
    case "math":
      return (
        <div className="my-3 rounded-[10px] border border-[hsl(250,60%,35%)] border-l-4 border-l-[hsl(250,100%,70%)] bg-gradient-to-r from-[hsl(250,30%,8%)] to-[hsl(160,20%,6%)] p-4 px-5">
          <div className="font-mono text-[0.7rem] font-bold tracking-[2px] uppercase text-[hsl(250,100%,70%)] mb-2">{block.title}</div>
          <pre className="font-mono text-[0.9rem] text-[hsl(250,40%,85%)] leading-[1.8] whitespace-pre-wrap">{block.content}</pre>
        </div>
      );
    case "table":
      return (
        <div className="overflow-x-auto my-3 rounded-[10px] border border-[hsl(240,15%,20%)]">
          <table className="w-full text-[0.85rem] border-collapse">
            <thead>
              <tr>{block.headers.map((h: string, i: number) => (
                <th key={i} className="bg-[hsl(240,15%,12%)] px-4 py-2.5 text-left font-mono text-[0.75rem] uppercase tracking-wider text-[hsl(240,20%,50%)] border-b border-[hsl(240,15%,20%)]">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {block.rows.map((row: string[], ri: number) => (
                <tr key={ri} className="hover:bg-[hsl(250,30%,12%)] transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 border-b border-[hsl(240,10%,15%)] text-[hsl(240,15%,70%)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "output":
      return (
        <div className="my-3">
          <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-[hsl(240,20%,50%)] mb-1">Output</div>
          <div className="bg-[hsl(240,20%,3%)] border border-dashed border-[hsl(240,15%,20%)] rounded-lg p-3 font-mono text-[0.8rem] text-[hsl(120,100%,75%)] leading-[1.7] whitespace-pre-wrap">{block.content}</div>
        </div>
      );
    default: return null;
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const Notes = () => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    if (!search.trim()) return allTopics;
    const q = search.toLowerCase();
    return allTopics.filter(t => t.label.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q));
  }, [search]);

  const selectedTopic = allTopics.find(t => t.id === selectedId);
  const noteData = selectedId
    ? (notesContent[selectedId] || fallbackNote(selectedTopic?.label || "", selectedTopic?.icon || ""))[lang]
    : null;

  const toggleSection = (i: number) => {
    setCollapsed(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const tags = ["All", "Python", "Visualization", "ML"];
  const [activeTag, setActiveTag] = useState("All");

  const finalTopics = useMemo(() => {
    const base = activeTag === "All" ? allTopics : allTopics.filter(t => t.tag === activeTag);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(t => t.label.toLowerCase().includes(q));
  }, [search, activeTag]);

  return (
    <div className="min-h-screen bg-[hsl(240,25%,4%)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[hsl(240,20%,5%)]/92 backdrop-blur-xl border-b border-[hsl(240,15%,20%)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span>
                <span className="text-[hsl(35,100%,55%)]">ANSTA</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <LangToggle />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-[hsl(240,15%,65%)] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t("Back to Dashboard", "Dashboard par Wapas")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">
        {!selectedId ? (
          // ── TOPIC LIST ──
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] mb-4 shadow-lg text-3xl">📚</div>
              <h1 className="font-display text-3xl font-extrabold text-[hsl(240,15%,92%)] mb-2">
                {t("Study Notes", "Study Notes (Padhai ke Notes)")}
              </h1>
              <p className="text-[hsl(240,15%,60%)]">
                {t("Python & ML complete notes — Theory, Code, Math, Real Life Examples", "Python & ML ke poore notes — Theory, Code, Math, Real Life Examples")}
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(240,15%,40%)]" />
              <Input
                placeholder={t("Search topics...", "Topics khojein...")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-[hsl(240,20%,6%)] border-[hsl(240,15%,20%)] text-[hsl(240,15%,90%)] placeholder:text-[hsl(240,15%,35%)]"
              />
            </div>

            {/* Tag filters */}
            <div className="flex gap-2 flex-wrap mb-6">
              {tags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide border transition-all ${
                    activeTag === tag
                      ? "bg-[hsl(250,100%,70%)] border-[hsl(250,100%,70%)] text-white"
                      : "bg-transparent border-[hsl(240,15%,25%)] text-[hsl(240,15%,55%)] hover:border-[hsl(250,100%,70%)] hover:text-[hsl(240,15%,85%)]"
                  }`}
                >{tag}</button>
              ))}
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {finalTopics.map(topic => (
                <button key={topic.id} onClick={() => { setSelectedId(topic.id); setCollapsed(new Set()); }}
                  className="p-4 rounded-xl border-2 border-[hsl(240,15%,20%)] hover:border-[hsl(250,100%,70%)]/60 bg-[hsl(240,15%,8%)] transition-all text-left group active:scale-[0.97]">
                  <span className="text-2xl mb-2 block">{topic.icon}</span>
                  <p className="font-semibold text-[hsl(240,15%,90%)] text-sm">{topic.label}</p>
                  <span className="text-[0.68rem] font-mono text-[hsl(240,15%,45%)] mt-1 block">{topic.tag}</span>
                </button>
              ))}
            </div>

            {finalTopics.length === 0 && (
              <p className="text-center text-[hsl(240,15%,50%)] py-12">
                {t("No topics found.", "Koi topic nahi mila.")}
              </p>
            )}
          </div>
        ) : (
          // ── NOTE DETAIL ──
          <div className="animate-fade-in">
            <button onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-[hsl(240,15%,60%)] hover:text-white mb-6 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t("Back to Topics", "Topics pe Wapas")}
            </button>

            <div className="text-center mb-8">
              <div className="text-5xl mb-3">{selectedTopic?.icon}</div>
              <h1 className="font-display text-3xl font-extrabold text-[hsl(240,15%,92%)] mb-1">{noteData?.title}</h1>
              <p className="text-[hsl(240,15%,55%)] text-sm">{noteData?.subtitle}</p>
            </div>

            {/* TOC */}
            <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-xl p-4 mb-6">
              <div className="font-mono text-[0.7rem] font-bold tracking-[2px] uppercase text-[hsl(240,20%,45%)] mb-3">
                📚 {t("Table of Contents", "Vishay Suchi")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {noteData?.sections.map((s: any, i: number) => (
                  <a key={i} href={`#section-${i}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[hsl(240,15%,14%)] text-[0.88rem] text-[hsl(240,15%,65%)] hover:text-[hsl(240,15%,90%)] transition-colors">
                    <span className="font-mono text-[0.75rem] text-[hsl(250,100%,70%)]">{String(i+1).padStart(2,"0")}</span>
                    {s.heading}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            {noteData?.sections.map((section: any, si: number) => (
              <div key={si} id={`section-${si}`} className="mb-4">
                <button onClick={() => toggleSection(si)}
                  className="w-full flex items-center gap-3 mb-3 pb-3 border-b border-[hsl(240,15%,20%)] group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] rounded-[10px] flex items-center justify-center font-mono text-[0.85rem] font-bold text-white shrink-0">
                    {String(si+1).padStart(2,"0")}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-lg font-extrabold text-[hsl(240,15%,92%)]">
                      {section.icon && <span className="mr-2">{section.icon}</span>}{section.heading}
                    </div>
                  </div>
                  {collapsed.has(si) ? <ChevronDown className="h-5 w-5 text-[hsl(240,15%,50%)]" /> : <ChevronUp className="h-5 w-5 text-[hsl(240,15%,50%)]" />}
                </button>
                {!collapsed.has(si) && (
                  <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-xl p-5 mb-2">
                    {section.blocks.map((block: any, bi: number) => <BlockRenderer key={bi} block={block} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
