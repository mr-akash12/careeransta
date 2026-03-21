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
  atsScoreTarget: number;
  profileStrength: number;
  keywordMatch: number;
  recruiterAppeal: number;
  stats: { label: string; value: string }[];
  currentHeadline: string;
  currentHeadlineProblems: string;
  headlineOptions: { rank: number; label: string; text: string; chars: number; atsScore: number; best: boolean }[];
  headlineNote: string;
  aboutSection: string;
  aboutNote: string;
  experiences: { role: string; company: string; period: string; type: string; bullets: string[]; tags: string[] }[];
  experienceNote: string;
  atsMatrix: { category: string; before: string; beforeScore: number; after: string; afterScore: number; change: string }[];
  skills: { group: string; items: { name: string; level: number }[] }[];
  gaps: { priority: string; title: string; impact: string; fix: string; level: "blocker" | "high" | "medium" }[];
  keywords: { word: string; found: boolean; freq: string }[];
  checklist: { week: string; icon: string; tasks: string[] }[];
  verdict: string;
  strengths?: string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function analyzeProfile(profileText: string, lang: string): Promise<AnalysisResult> {
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

// ─── CSS VARS ────────────────────────────────────────────────────────────────
const V = {
  bg: "#f5f3ee", ink: "#0f0e0c", ink2: "#2a2825", muted: "#7a776e",
  rule: "#d8d4cc", cream: "#eceae4", cream2: "#e2dfd7",
  red: "#c0392b", green: "#1a6b3c", blue: "#1a3a6b", amber: "#b5620a",
  tagR: "#fdecea", tagG: "#e8f5ee", tagB: "#eaeff8", tagA: "#fdf3e7",
};

const mono = "'JetBrains Mono', 'Fira Code', monospace";
const display = "'Outfit', system-ui, sans-serif";

// ─── REPORT COMPONENT ───────────────────────────────────────────────────────
function AnalysisReport({ result, lang }: { result: AnalysisResult; lang: string }) {
  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);

  return (
    <div style={{ fontFamily: display, fontSize: "15px", lineHeight: 1.65, color: V.ink }} className="mt-6">

      {/* ═══ MASTHEAD ═══ */}
      <div style={{ background: V.ink, color: V.bg, overflow: "hidden", borderRadius: "4px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid #2a2825" }}>
          <div style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: V.muted, padding: "14px 40px", borderRight: "1px solid #2a2825", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: V.bg }}>FAANG</span>-GRADE LINKEDIN PLAYBOOK
          </div>
          <div style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", color: V.muted, padding: "14px 40px", marginLeft: "auto", display: "flex", alignItems: "center" }}>
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: "48px 40px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "end" }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: "11px", letterSpacing: "2px", color: V.red, textTransform: "uppercase", marginBottom: "14px" }}>
              {result.name} · {result.role}
            </div>
            <h1 style={{ fontFamily: display, fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "1px", color: V.bg }}>
              10<span style={{ color: V.red }}>×</span> Profile<br />Upgrade
            </h1>
            <p style={{ marginTop: "20px", fontSize: "14px", color: "#9a978e", maxWidth: "520px", lineHeight: 1.7 }}>
              Every section rewritten to FAANG hiring standards — quantified metrics, 90%+ ATS alignment, and language that makes senior hiring managers stop scrolling.
            </p>
          </div>
          <div style={{ background: V.red, color: "white", padding: "24px 32px", textAlign: "center", minWidth: "150px", alignSelf: "start", marginTop: "48px", borderRadius: "4px" }}>
            <span style={{ fontFamily: display, fontSize: "72px", fontWeight: 900, lineHeight: 1, display: "block" }}>{result.atsScoreTarget || result.atsScore}</span>
            <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", opacity: 0.8, marginTop: "4px" }}>ATS Score<br />Target</div>
          </div>
        </div>
        {/* Stat bar */}
        <div style={{ background: V.ink2, display: "flex", gap: 0, borderBottom: `3px solid ${V.red}` }}>
          {(result.stats || []).map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "18px 24px", borderRight: i < (result.stats?.length || 0) - 1 ? "1px solid #3a3835" : "none", textAlign: "center" }}>
              <span style={{ fontFamily: display, fontSize: "28px", fontWeight: 900, color: V.bg, display: "block", lineHeight: 1 }}>{s.value}</span>
              <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "1.5px", color: V.muted, textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 0 80px" }}>

        {/* ═══ CHAPTER 1: HEADLINE ═══ */}
        <ChapterHeader num="01" title={t("Headline — FAANG-Calibrated", "Headline — FAANG-Calibrated")} sub="Under 220 chars · Max keyword density" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Card border={V.amber} label="❌ Current Headline (Weak)" labelColor={V.amber}>
            <div style={{ fontStyle: "italic", color: V.muted }}>"{result.currentHeadline}"</div>
            <div style={{ marginTop: "10px", fontSize: "12px", color: V.red }}>{result.currentHeadlineProblems}</div>
          </Card>
          <Card border={V.green} label="✅ Why It Matters" labelColor={V.green}>
            <div>LinkedIn's recruiter search ranks profiles by keyword match in Headline (weighted 3×), Experience, and Skills. Remove "Entry-Level" labels — they search for capabilities, not seniority.</div>
          </Card>
        </div>

        {/* Headline options */}
        {(result.headlineOptions || []).map((opt, i) => (
          <div key={i} style={{
            border: `1px solid ${opt.best ? V.green : V.rule}`,
            borderRadius: "4px", padding: "18px 22px 16px", marginBottom: "10px",
            background: opt.best ? "rgba(26,107,60,0.03)" : "white",
            display: "grid", gridTemplateColumns: "36px 1fr auto", gap: "16px", alignItems: "start",
          }}>
            <div style={{ fontFamily: display, fontSize: "36px", fontWeight: 900, color: opt.best ? V.green : V.rule, lineHeight: 1 }}>{opt.rank}</div>
            <div>
              <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: opt.best ? V.green : V.muted, marginBottom: "6px", fontWeight: 700 }}>
                {opt.best ? "⭐ " : ""}{opt.label}
              </div>
              <div style={{ fontSize: "15px", color: V.ink, fontWeight: 500, lineHeight: 1.5 }}>{opt.text}</div>
            </div>
            <div style={{ textAlign: "right", fontFamily: mono, fontSize: "10px", color: V.muted, whiteSpace: "nowrap" }}>
              {opt.chars} chars<br /><span style={{ color: V.green, fontWeight: 500, fontSize: "11px", marginTop: "2px" }}>ATS: {opt.atsScore}%</span>
            </div>
          </div>
        ))}

        {result.headlineNote && <NoteBox>{result.headlineNote}</NoteBox>}

        {/* ═══ CHAPTER 2: ABOUT ═══ */}
        <ChapterHeader num="02" title={t("About Section — Rebuilt", "About Section — Rebuilt")} sub="STAR-framed · 47 keywords · 240 words" />

        <div style={{ background: "white", border: `1px solid ${V.rule}`, borderRadius: "4px", padding: "48px 36px 32px", fontSize: "14.5px", lineHeight: 1.9, color: V.ink2, whiteSpace: "pre-line", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: V.ink, color: V.bg, fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "7px 16px", borderRadius: "4px 4px 0 0" }}>
            LINKEDIN ABOUT SECTION — COPY VERBATIM
          </div>
          {result.aboutSection}
        </div>

        {result.aboutNote && <NoteBox>{result.aboutNote}</NoteBox>}

        {/* ═══ CHAPTER 3: EXPERIENCE ═══ */}
        <ChapterHeader num="03" title={t("Experience & Projects — FAANG-Level Rewrites", "Experience & Projects — FAANG-Level Rewrites")} sub="XYZ Method · Impact-first · Every bullet quantified" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Card border={V.blue} label="FAANG Writing Formula" labelColor={V.blue}>
            <div><strong>Google's XYZ Method:</strong><br />"Accomplished [X] as measured by [Y] by doing [Z]."<br /><br />Every bullet follows this. No "responsible for." Only impact verbs + what changed + by how much.</div>
          </Card>
          <Card border={V.blue} label="Impact Verbs Used (FAANG approved)" labelColor={V.blue}>
            <div style={{ color: V.blue }}>Engineered · Architected · Reduced · Increased · Automated · Deployed · Optimized · Designed · Delivered · Benchmarked · Surfaced · Accelerated · Built · Achieved · Improved</div>
          </Card>
        </div>

        {(result.experiences || []).map((exp, i) => (
          <div key={i} style={{ background: "white", border: `1px solid ${V.rule}`, borderRadius: "4px", marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ background: V.cream, padding: "16px 24px", borderBottom: `1px solid ${V.rule}`, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: V.ink }}>{exp.role}</div>
                <div style={{ fontFamily: mono, fontSize: "11px", color: V.muted, marginTop: "2px", letterSpacing: "0.5px" }}>{exp.company} · {exp.type}</div>
              </div>
              <div style={{ fontFamily: mono, fontSize: "11px", color: V.muted, textAlign: "right" }}>{exp.period}</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {(exp.bullets || []).map((bullet, bi) => (
                  <li key={bi} style={{ padding: "6px 0 6px 20px", position: "relative", fontSize: "14px", color: V.ink2, lineHeight: 1.6, borderBottom: bi < exp.bullets.length - 1 ? `1px solid ${V.cream}` : "none" }}>
                    <span style={{ position: "absolute", left: 0, color: V.rule, fontWeight: 300 }}>—</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              {exp.tags && exp.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${V.rule}` }}>
                  {exp.tags.map((tag, ti) => (
                    <span key={ti} style={{ background: V.tagB, color: V.blue, fontFamily: mono, fontSize: "10px", padding: "3px 10px", borderRadius: "2px", letterSpacing: "0.5px" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {result.experienceNote && <NoteBox>{result.experienceNote}</NoteBox>}

        {/* ═══ CHAPTER 4: ATS MATRIX ═══ */}
        <ChapterHeader num="04" title={t("ATS Score Matrix — Before vs. After", "ATS Score Matrix — Before vs. After")} sub="Scored against 50 live JDs" />

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: "24px" }}>
            <thead>
              <tr>
                <th style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "12px 20px", textAlign: "left", borderBottom: `2px solid ${V.ink}`, color: V.muted, width: "20%" }}>ATS Category</th>
                <th style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "12px 20px", textAlign: "left", borderBottom: `2px solid ${V.ink}`, color: V.red }}>Before Score</th>
                <th style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "12px 20px", textAlign: "left", borderBottom: `2px solid ${V.ink}`, color: V.green, background: V.tagG }}>After Score</th>
                <th style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "12px 20px", textAlign: "left", borderBottom: `2px solid ${V.ink}`, color: V.muted }}>Key Change</th>
              </tr>
            </thead>
            <tbody>
              {(result.atsMatrix || []).map((row, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: mono, fontSize: "11px", fontWeight: 500, color: V.muted, textTransform: "uppercase", letterSpacing: "1px", padding: "16px 20px", verticalAlign: "top", borderBottom: `1px solid ${V.rule}` }}>{row.category}</td>
                  <td style={{ padding: "16px 20px", verticalAlign: "top", borderBottom: `1px solid ${V.rule}`, color: V.muted, fontStyle: "italic" }}>{row.before}</td>
                  <td style={{ padding: "16px 20px", verticalAlign: "top", borderBottom: `1px solid ${V.rule}`, color: V.ink, fontWeight: 500, background: "rgba(26,107,60,0.04)" }}>{row.after}</td>
                  <td style={{ padding: "16px 20px", verticalAlign: "top", borderBottom: `1px solid ${V.rule}`, lineHeight: 1.6 }}>{row.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ═══ CHAPTER 5: SKILLS ═══ */}
        <ChapterHeader num="05" title={t("Skills — Priority-Ranked for 2026 JDs", "Skills — Priority-Ranked for 2026 JDs")} sub="Ordered by recruiter search frequency" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {(result.skills || []).map((group, gi) => (
            <div key={gi} style={{ background: "white", border: `1px solid ${V.rule}`, borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ background: V.ink, color: V.bg, fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "10px 16px" }}>{group.group}</div>
              <div style={{ padding: "14px 16px" }}>
                {(group.items || []).map((skill, si) => (
                  <div key={si} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: si < group.items.length - 1 ? `1px solid ${V.cream}` : "none", fontSize: "13px" }}>
                    <span style={{ color: V.ink2, fontWeight: 500 }}>{skill.name}</span>
                    <div style={{ width: "80px", height: "4px", background: V.cream2, borderRadius: "2px" }}>
                      <div style={{ height: "4px", borderRadius: "2px", width: `${skill.level}%`, background: skill.level >= 80 ? V.green : V.amber }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══ CHAPTER 6: GAP ANALYSIS ═══ */}
        <ChapterHeader num="06" title={t("Gap Analysis — What to Fix", "Gap Analysis — Kya Fix Karein")} sub="Priority-ranked by recruiter impact" />

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: "24px" }}>
          <thead>
            <tr>
              <th style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: V.muted, padding: "10px 16px", borderBottom: `2px solid ${V.ink}`, textAlign: "left" }}>Priority</th>
              <th style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: V.muted, padding: "10px 16px", borderBottom: `2px solid ${V.ink}`, textAlign: "left" }}>Issue</th>
              <th style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: V.muted, padding: "10px 16px", borderBottom: `2px solid ${V.ink}`, textAlign: "left" }}>Fix</th>
            </tr>
          </thead>
          <tbody>
            {(result.gaps || []).map((gap, i) => {
              const colors: Record<string, string> = { blocker: V.red, high: V.amber, medium: V.green };
              const bgs: Record<string, string> = { blocker: V.tagR, high: V.tagA, medium: V.tagG };
              return (
                <tr key={i}>
                  <td style={{ padding: "14px 16px", borderBottom: `1px solid ${V.rule}`, verticalAlign: "top" }}>
                    <span style={{ display: "inline-block", fontFamily: mono, fontSize: "9px", letterSpacing: "1px", padding: "3px 8px", borderRadius: "2px", fontWeight: 500, background: bgs[gap.level] || V.tagR, color: colors[gap.level] || V.red }}>{gap.priority}</span>
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: `1px solid ${V.rule}`, verticalAlign: "top" }}>
                    <div style={{ fontWeight: 600, color: V.ink, fontSize: "13px", marginBottom: "3px" }}>{gap.title}</div>
                    <div style={{ fontSize: "13px", color: V.muted, lineHeight: 1.55 }}>{gap.impact}</div>
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: `1px solid ${V.rule}`, verticalAlign: "top" }}>
                    <div style={{ fontSize: "12px", color: V.blue, fontWeight: 500 }}>→ {gap.fix}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ═══ CHAPTER 7: KEYWORD MAP ═══ */}
        <ChapterHeader num="07" title={t("Keyword Frequency Map — 2026 India JDs", "Keyword Map — 2026 India JDs")} sub="ATS keyword density analysis" />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
          {(result.keywords || []).map((kw, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "6px 12px", borderRadius: "2px", fontSize: "12px", fontFamily: mono,
              background: kw.found ? V.ink : V.cream2,
              color: kw.found ? V.bg : V.ink,
              fontWeight: kw.found ? 500 : 400,
            }}>
              {kw.found ? "✓" : "✗"} {kw.word}
              <span style={{ opacity: 0.6, fontSize: "10px" }}>{kw.freq}</span>
            </span>
          ))}
        </div>

        {/* ═══ CHAPTER 8: 30-DAY CHECKLIST ═══ */}
        <ChapterHeader num="08" title={t("30-Day FAANG Checklist", "30-Din ka FAANG Checklist")} sub="Weekly action items" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          {(result.checklist || []).map((week, i) => (
            <div key={i} style={{ background: "white", border: `1px solid ${V.rule}`, borderRadius: "4px", padding: "20px 22px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: V.ink, marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", background: V.cream, flexShrink: 0 }}>{week.icon}</span>
                {week.week}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {(week.tasks || []).map((task, ti) => (
                  <li key={ti} style={{ fontSize: "13px", color: V.ink2, padding: "5px 0 5px 22px", position: "relative", borderBottom: ti < week.tasks.length - 1 ? `1px solid ${V.cream}` : "none", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: V.rule, fontSize: "14px" }}>□</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ═══ VERDICT ═══ */}
        <div style={{ background: V.ink, borderLeft: `4px solid ${V.red}`, borderRadius: "4px", padding: "24px 32px" }}>
          <div style={{ fontFamily: mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: V.muted, marginBottom: "12px" }}>
            {t("Final Verdict", "Final Verdict")}
          </div>
          <div style={{ fontSize: "15px", color: "#9a978e", lineHeight: 1.8 }}>{result.verdict}</div>
        </div>

      </div>
    </div>
  );
}

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────
function ChapterHeader({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div style={{ marginTop: "64px", borderTop: `3px solid ${V.ink}`, paddingTop: "20px", display: "flex", alignItems: "baseline", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
      <div style={{ fontFamily: display, fontSize: "48px", fontWeight: 900, color: V.rule, lineHeight: 1, minWidth: "60px" }}>{num}</div>
      <div style={{ fontFamily: display, fontSize: "32px", fontWeight: 900, letterSpacing: "0.5px", color: V.ink }}>{title}</div>
      <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: "10px", color: V.muted, letterSpacing: "1.5px", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${V.rule}` }}>{sub}</div>
    </div>
  );
}

function Card({ children, border, label, labelColor }: { children: React.ReactNode; border: string; label: string; labelColor: string }) {
  return (
    <div style={{ background: "white", border: `1px solid ${V.rule}`, borderLeft: `3px solid ${border}`, borderRadius: "4px", padding: "22px 24px" }}>
      <div style={{ fontFamily: mono, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", color: labelColor, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: "13.5px", color: V.ink2, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function NoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: V.tagB, borderLeft: `3px solid ${V.blue}`, padding: "14px 18px", fontSize: "13px", color: V.blue, marginTop: "16px", borderRadius: "0 4px 4px 0", lineHeight: 1.6, marginBottom: "8px" }}>
      💡 {children}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
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
      const res = await analyzeProfile(profileText, lang);
      setResult(res);
    } catch (e) {
      setError(t("Analysis failed. Please try again.", "Analysis fail ho gayi. Dobara try karein."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: result ? V.bg : "hsl(240,25%,4%)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: result ? `${V.bg}ee` : "hsl(240,20%,5%,0.92)", borderColor: result ? V.rule : "hsl(240,15%,20%)" }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span style={{ color: result ? V.ink : "white" }}>Career</span>
                <span style={{ color: "hsl(35,100%,55%)" }}>ANSTA</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <LangToggle />
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" style={{ color: result ? V.muted : "hsl(240,15%,65%)" }}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t("Back to Dashboard", "Dashboard par Wapas")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8" style={{ maxWidth: result ? "1100px" : "48rem" }}>

        {!result && (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(250,100%,70%)] to-[hsl(160,80%,55%)] mb-4 shadow-lg text-3xl">🎯</div>
              <h1 className="font-display text-3xl font-extrabold text-[hsl(240,15%,92%)] mb-2">
                {t("Profile Analyzer", "Profile Analyzer")}
              </h1>
              <p className="text-[hsl(240,15%,60%)]">
                {t("Get your FAANG-grade LinkedIn playbook with ATS score, headline rewrites & 30-day plan", "FAANG-grade LinkedIn playbook paao — ATS score, headline rewrites aur 30-din ka plan")}
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
                  <button onClick={() => setMode("linkedin")}
                    className="p-6 rounded-xl border-2 border-[hsl(240,15%,20%)] hover:border-[#0077b5]/60 bg-[hsl(240,15%,8%)] transition-all group active:scale-[0.97] text-center">
                    <div className="w-14 h-14 rounded-xl bg-[#0077b5] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Linkedin className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-bold text-[hsl(240,15%,90%)] text-base">LinkedIn</p>
                    <p className="text-[hsl(240,15%,50%)] text-xs mt-1">{t("Active ✅", "Active ✅")}</p>
                  </button>
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

            {/* LinkedIn Analyzer Input */}
            {mode === "linkedin" && (
              <div className="animate-fade-in">
                <button onClick={() => { setMode("select"); setResult(null); setProfileText(""); setError(""); }}
                  className="flex items-center gap-2 text-[hsl(240,15%,55%)] hover:text-white mb-6 transition-colors text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  {t("Back", "Wapas")}
                </button>

                <div className="bg-[hsl(240,15%,10%)] border border-[hsl(240,15%,20%)] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#0077b5] flex items-center justify-center">
                      <Linkedin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[hsl(240,15%,90%)]">LinkedIn Profile Analyzer</h2>
                      <p className="text-[hsl(240,15%,50%)] text-xs">{t("FAANG-grade ATS & recruiter analysis", "FAANG-grade ATS aur recruiter analysis")}</p>
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
                      <><Sparkles className="h-5 w-5 mr-2 animate-spin" />{t("Generating FAANG Playbook...", "FAANG Playbook ban rahi hai...")}</>
                    ) : (
                      <><Sparkles className="h-5 w-5 mr-2" />{t("Generate My FAANG Playbook", "Mera FAANG Playbook Banao")}</>
                    )}
                  </Button>

                  {isLoading && (
                    <div className="mt-4 space-y-2">
                      {[
                        t("Reading your profile...", "Profile padh rahe hain..."),
                        t("Analyzing ATS keywords...", "ATS keywords analyze ho rahe hain..."),
                        t("Rewriting headlines (5 options)...", "Headlines rewrite ho rahe hain (5 options)..."),
                        t("Building FAANG experience bullets...", "FAANG experience bullets ban rahe hain..."),
                        t("Creating 30-day action plan...", "30-din ka action plan ban raha hai..."),
                      ].map((msg, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[hsl(240,15%,50%)] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(250,100%,70%)]" />
                          {msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {result && (
          <>
            <AnalysisReport result={result} lang={lang} />
            <div className="flex gap-3 mt-6 mb-12">
              <Button onClick={() => { setResult(null); setProfileText(""); }}
                style={{ flex: 1, background: V.ink, color: V.bg, border: `1px solid ${V.ink2}` }}>
                {t("Analyze Another Profile", "Doosra Profile Analyze Karo")}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analyzer;
