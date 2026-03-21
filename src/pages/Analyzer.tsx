import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Building2, Sparkles, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { LangToggle } from "@/components/LangToggle";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface AnalysisResult {
  name: string;
  role: string;
  atsScore: number;
  profileStrength: number;
  keywordMatch: number;
  recruiterAppeal: number;
  stats: { label: string; value: string }[];
  strengths: string[];
  gaps: { priority: string; title: string; impact: string; fix: string; level: "blocker" | "high" | "medium" }[];
  keywords: { word: string; found: boolean; freq: string }[];
  checklist: { week: string; icon: string; tasks: string[] }[];
  verdict: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function analyzeWithClaude(profileText: string, lang: string): Promise<AnalysisResult> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ profileText, language: lang }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Analysis failed");
  }

  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Analysis failed");
  return data as AnalysisResult;
}

// ─── RESULT DISPLAY ──────────────────────────────────────────────────────────
function AnalysisReport({ result, lang }: { result: AnalysisResult; lang: string }) {
  const scoreColor = result.atsScore >= 75 ? "#1a6b3c" : result.atsScore >= 50 ? "#b5620a" : "#c0392b";

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }} className="mt-6">

      {/* MASTHEAD */}
      <div style={{ background: "#0f0e0c", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "8px 24px", borderBottom: "1px solid #2a2825", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#7a776e" }}>
            CAREERANSTA · <span style={{ color: "#f5f3ee" }}>LINKEDIN ANALYSIS REPORT</span>
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#7a776e" }}>
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
        <div style={{ padding: "32px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", letterSpacing: "2px", color: "#c0392b", textTransform: "uppercase", marginBottom: "8px" }}>
              {lang === "hi" ? "LinkedIn Profile Analysis" : "LinkedIn Profile Analysis"}
            </div>
            <div style={{ fontFamily: "system-ui", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, lineHeight: 1, color: "#f5f3ee", letterSpacing: "-1px" }}>
              {result.name}
            </div>
            <div style={{ marginTop: "8px", fontSize: "14px", color: "#9a978e" }}>{result.role}</div>
          </div>
          <div style={{ background: scoreColor, color: "white", padding: "16px 24px", textAlign: "center", minWidth: "120px", borderRadius: "8px" }}>
            <span style={{ fontFamily: "system-ui", fontSize: "56px", fontWeight: 900, lineHeight: 1, display: "block" }}>{result.atsScore}</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.8 }}>ATS SCORE</span>
          </div>
        </div>

        {/* STAT BAR */}
        <div style={{ background: "#2a2825", display: "flex", borderTop: "3px solid #c0392b" }}>
          {result.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "14px 16px", borderRight: i < result.stats.length - 1 ? "1px solid #3a3835" : "none", textAlign: "center" }}>
              <span style={{ fontFamily: "system-ui", fontSize: "22px", fontWeight: 900, color: "#f5f3ee", display: "block", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "1.5px", color: "#7a776e", textTransform: "uppercase", marginTop: "4px", display: "block" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STRENGTHS */}
      <div style={{ background: "#e8f5ee", border: "1px solid #1a6b3c", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1a6b3c", marginBottom: "12px", fontWeight: 700 }}>
          ✅ {lang === "hi" ? "Kya Acha Hai (Strengths)" : "What's Working"}
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {result.strengths.map((s, i) => (
            <li key={i} style={{ fontSize: "14px", color: "#1a3a1a", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "#1a6b3c", fontWeight: 700, marginTop: "1px" }}>→</span> {s}
            </li>
          ))}
        </ul>
      </div>

      {/* GAP ANALYSIS */}
      <div style={{ background: "#0f0e0c", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #2a2825" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#7a776e" }}>
            {lang === "hi" ? "Kya Sudharna Chahiye — Gap Analysis" : "Gap Analysis — What's Holding You Back"}
          </div>
        </div>
        <div style={{ padding: "0" }}>
          {result.gaps.map((gap, i) => {
            const colors = { blocker: "#c0392b", high: "#b5620a", medium: "#1a6b3c" };
            const bgColors = { blocker: "#1a0605", high: "#1a0e03", medium: "#03120a" };
            const col = colors[gap.level];
            const bg = bgColors[gap.level];
            return (
              <div key={i} style={{ borderBottom: i < result.gaps.length - 1 ? "1px solid #2a2825" : "none", padding: "20px 24px", background: bg }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <span style={{ background: col, color: "white", padding: "3px 10px", borderRadius: "4px", fontFamily: "monospace", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap", marginTop: "2px" }}>{gap.priority}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#f5f3ee", fontSize: "15px", marginBottom: "6px" }}>{gap.title}</div>
                    <div style={{ fontSize: "13px", color: "#9a978e", lineHeight: 1.6, marginBottom: "10px" }}>{gap.impact}</div>
                    <div style={{ fontSize: "13px", color: col, lineHeight: 1.6 }}>→ {gap.fix}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KEYWORD MAP */}
      <div style={{ background: "#f5f3ee", border: "1px solid #d8d4cc", borderRadius: "12px", padding: "20px 24px", marginBottom: "16px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#7a776e", marginBottom: "4px", fontWeight: 700 }}>
          {lang === "hi" ? "Keyword Map — 2026 India JDs" : "Keyword Frequency Map — 2026 India JDs"}
        </div>
        <div style={{ fontSize: "12px", color: "#7a776e", marginBottom: "16px" }}>
          {lang === "hi" ? "Hara = aapke profile mein hai · Lal = missing" : "Green = found in your profile · Red = missing"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {result.keywords.map((kw, i) => (
            <span key={i} style={{
              padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
              background: kw.found ? "#e8f5ee" : "#fdecea",
              color: kw.found ? "#1a6b3c" : "#c0392b",
              border: `1px solid ${kw.found ? "#1a6b3c" : "#c0392b"}`,
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              {kw.found ? "✓" : "✗"} {kw.word}
              <span style={{ opacity: 0.7, fontSize: "10px" }}>{kw.freq}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 30 DAY CHECKLIST */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#7a776e", marginBottom: "12px", fontWeight: 700 }}>
          {lang === "hi" ? "30-Din ka Action Plan" : "30-Day Action Plan"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          {result.checklist.map((week, i) => (
            <div key={i} style={{ background: "#0f0e0c", border: "1px solid #2a2825", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>{week.icon}</span>
                <span style={{ fontWeight: 700, color: "#f5f3ee", fontSize: "13px" }}>{week.week}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {week.tasks.map((task, ti) => (
                  <li key={ti} style={{ fontSize: "12px", color: "#9a978e", display: "flex", gap: "6px", alignItems: "flex-start", lineHeight: 1.5 }}>
                    <span style={{ color: "#c0392b", fontWeight: 700, marginTop: "1px", flexShrink: 0 }}>→</span> {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* VERDICT */}
      <div style={{ background: "#0f0e0c", borderLeft: "4px solid #c0392b", borderRadius: "8px", padding: "20px 24px" }}>
        <div style={{ fontFamily: "system-ui", fontSize: "18px", fontWeight: 900, color: "#f5f3ee", marginBottom: "8px", letterSpacing: "-0.3px" }}>
          {lang === "hi" ? "Final Verdict" : "Final Verdict"}
        </div>
        <div style={{ fontSize: "14px", color: "#9a978e", lineHeight: 1.8 }}>{result.verdict}</div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
const Analyzer = () => {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState<"select" | "linkedin" | "naukri">("select");
  const [profileText, setProfileText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!profileText.trim() || profileText.trim().length < 50) {
      setError(t("Please paste your full LinkedIn profile text (at least 50 characters).", "Kripya apna poora LinkedIn profile text paste karein (kam se kam 50 characters)."));
      return;
    }
    setError("");
    setIsLoading(true);
    setResult(null);
    try {
      const res = await analyzeWithClaude(profileText, lang);
      setResult(res);
    } catch (e) {
      setError(t("Analysis failed. Please try again.", "Analysis fail ho gayi. Dobara try karein."));
    } finally {
      setIsLoading(false);
    }
  };

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

      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-3xl">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] mb-4 shadow-lg text-3xl">🎯</div>
          <h1 className="font-display text-3xl font-extrabold text-[hsl(240,15%,92%)] mb-2">
            {t("Profile Analyzer", "Profile Analyzer")}
          </h1>
          <p className="text-[hsl(240,15%,60%)]">
            {t("Get your ATS score, keyword gaps & 30-day improvement plan", "ATS score, keyword gaps aur 30-din ka improvement plan paao")}
          </p>
        </div>

        {/* Mode Select */}
        {mode === "select" && (
          <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-[hsl(240,15%,90%)] text-center mb-2">
              {t("Choose Platform to Analyze", "Kaunsa Platform Analyze Karein?")}
            </h2>
            <p className="text-center text-[hsl(240,15%,50%)] text-sm mb-8">
              {t("Select the platform whose profile you want to analyze", "Wo platform chuniye jiska profile analyze karna hai")}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* LinkedIn */}
              <button onClick={() => setMode("linkedin")}
                className="p-6 rounded-xl border-2 border-[hsl(240,15%,20%)] hover:border-[#0077b5]/60 bg-[hsl(240,15%,8%)] transition-all group active:scale-[0.97] text-center">
                <div className="w-14 h-14 rounded-xl bg-[#0077b5] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Linkedin className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-[hsl(240,15%,90%)] text-base">LinkedIn</p>
                <p className="text-[hsl(240,15%,50%)] text-xs mt-1">{t("Active ✅", "Active ✅")}</p>
              </button>

              {/* Naukri */}
              <button disabled
                className="p-6 rounded-xl border-2 border-[hsl(240,15%,15%)] bg-[hsl(240,15%,6%)] text-center opacity-50 cursor-not-allowed">
                <div className="w-14 h-14 rounded-xl bg-[hsl(240,15%,15%)] flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-7 w-7 text-[hsl(240,15%,40%)]" />
                </div>
                <p className="font-bold text-[hsl(240,15%,60%)] text-base">Naukri</p>
                <p className="text-[hsl(240,15%,40%)] text-xs mt-1">{t("Coming Soon 🔜", "Jald Aa Raha Hai 🔜")}</p>
              </button>
            </div>
          </div>
        )}

        {/* LinkedIn Analyzer */}
        {mode === "linkedin" && (
          <div className="animate-fade-in">
            <button onClick={() => { setMode("select"); setResult(null); setProfileText(""); setError(""); }}
              className="flex items-center gap-2 text-[hsl(240,15%,55%)] hover:text-white mb-6 transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              {t("Back", "Wapas")}
            </button>

            {!result && (
              <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0077b5] flex items-center justify-center">
                    <Linkedin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[hsl(240,15%,90%)]">LinkedIn Profile Analyzer</h2>
                    <p className="text-[hsl(240,15%,50%)] text-xs">{t("AI-powered ATS & recruiter analysis", "AI se ATS aur recruiter analysis")}</p>
                  </div>
                </div>

                <div className="bg-[hsl(240,15%,8%)] border border-[hsl(240,15%,18%)] rounded-xl p-4 mb-4 text-sm text-[hsl(240,15%,55%)]">
                  <p className="font-semibold text-[hsl(240,15%,75%)] mb-2">
                    📋 {t("How to copy your LinkedIn profile:", "LinkedIn profile kaise copy karein:")}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
                    <li>{t("Open your LinkedIn profile", "Apna LinkedIn profile kholo")}</li>
                    <li>{t("Select all text (Ctrl+A) and copy (Ctrl+C)", "Saara text select karo (Ctrl+A) aur copy karo (Ctrl+C)")}</li>
                    <li>{t("Paste below", "Neeche paste karo")}</li>
                  </ol>
                </div>

                <textarea
                  value={profileText}
                  onChange={e => setProfileText(e.target.value)}
                  placeholder={t(
                    "Paste your complete LinkedIn profile text here — headline, about, experience, skills, education, certifications...",
                    "Apna poora LinkedIn profile text yahan paste karein — headline, about, experience, skills, education, certifications..."
                  )}
                  className="w-full h-52 bg-[hsl(240,20%,6%)] border border-[hsl(240,15%,20%)] rounded-xl p-4 text-[hsl(240,15%,80%)] text-sm resize-none focus:outline-none focus:border-[hsl(250,100%,70%)] placeholder:text-[hsl(240,15%,30%)] leading-relaxed"
                />

                {error && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-[hsl(0,40%,10%)] border border-[hsl(0,60%,30%)] rounded-lg text-[hsl(0,60%,80%)] text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-4 bg-[hsl(250,100%,70%)] hover:bg-[hsl(250,100%,65%)] text-white font-bold h-12 text-base" size="lg">
                  {isLoading ? (
                    <><Sparkles className="h-5 w-5 mr-2 animate-spin" />{t("Analyzing your profile...", "Profile analyze ho rahi hai...")}</>
                  ) : (
                    <><Sparkles className="h-5 w-5 mr-2" />{t("Analyze My LinkedIn Profile", "Mera LinkedIn Profile Analyze Karo")}</>
                  )}
                </Button>

                {isLoading && (
                  <div className="mt-4 space-y-2">
                    {[t("Reading your profile...", "Profile padh rahe hain..."), t("Calculating ATS score...", "ATS score calculate ho raha hai..."), t("Finding keyword gaps...", "Keyword gaps dhundh rahe hain..."), t("Building your 30-day plan...", "30-din ka plan ban raha hai...")].map((msg, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[hsl(240,15%,50%)] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(250,100%,70%)]" />
                        {msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {result && <AnalysisReport result={result} lang={lang} />}

            {result && (
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => { setResult(null); setProfileText(""); }}
                  className="flex-1 border-[hsl(240,15%,20%)] text-[hsl(240,15%,70%)]">
                  {t("Analyze Another Profile", "Doosra Profile Analyze Karo")}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Analyzer;
