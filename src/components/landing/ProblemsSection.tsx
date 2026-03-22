import { useCallback, useRef } from "react";

const cards = [
  {
    emoji: "📄",
    num: "01",
    bandColor: "bg-gradient-to-r from-primary to-lime-2",
    iconClass: "",
    checkClass: "",
    pillClass: "",
    pillDotClass: "",
    title: "AI Resume Builder",
    desc: "Your resume, optimized for every job. AI reads the JD, rewrites your resume to match — keyword-perfect and recruiter-approved.",
    feats: ["ATS score analysis & fix", "JD-tailored keyword matching", "One-click multiple formats"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-primary leading-relaxed mt-4 font-mono">
        <div className="text-muted-foreground text-[11px]">ATS SCORE</div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-display text-[22px] font-black text-primary">94%</span>
          <span className="text-foreground text-[11px]">✓ Keywords matched<br />✓ Format optimized</span>
        </div>
        <div className="h-1 rounded-sm bg-white/[0.06] mt-1.5 overflow-hidden">
          <div className="score-fill h-full rounded-sm bg-gradient-to-r from-lime-2 to-primary" style={{ "--w": "94%" } as React.CSSProperties} />
        </div>
      </div>
    ),
    pill: "Most Popular",
  },
  {
    emoji: "🎤",
    num: "02",
    bandColor: "bg-gradient-to-r from-info to-[#0099cc]",
    iconClass: "bg-info/[0.07] border-info/[0.14] group-hover:bg-info/[0.13]",
    checkClass: "bg-info/[0.08] border-info/[0.2] text-info",
    pillClass: "text-info border-info/20",
    pillDotClass: "",
    title: "Mock Interviews",
    desc: "Practice with an AI that mimics real interviewers from Google, Amazon, Flipkart. Instant feedback on your answers and confidence score.",
    feats: ["Company-specific questions", "Real-time AI scoring", "Confidence & clarity analysis"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-info leading-relaxed mt-4 font-mono">
        <span className="text-lime-2">INTERVIEWER:</span> Tell me about yourself<br />
        <span className="text-foreground">YOU:</span> I am a Software Engineer...<br />
        <span className="text-muted-foreground">AI SCORE: </span><span className="text-info">★★★★☆ 82/100</span>
      </div>
    ),
    pill: "AI Powered",
  },
  {
    emoji: "📝",
    num: "03",
    bandColor: "bg-gradient-to-r from-secondary to-[#6d28d9]",
    iconClass: "bg-secondary/[0.07] border-secondary/[0.14] group-hover:bg-secondary/[0.13]",
    checkClass: "bg-secondary/[0.08] border-secondary/[0.2] text-secondary",
    pillClass: "text-secondary border-secondary/20",
    pillDotClass: "",
    title: "Mock Tests",
    desc: "Adaptive test series covering aptitude, coding, and domain topics. The AI adjusts difficulty based on your real-time performance.",
    feats: ["Aptitude + coding + domain", "Adaptive difficulty engine", "Detailed weak-area reports"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-secondary leading-relaxed mt-4 font-mono">
        <div className="text-muted-foreground text-[11px]">PERFORMANCE THIS WEEK</div>
        <div className="mt-2 flex flex-col gap-1.5">
          {[{ l: "Aptitude", w: "88%", c: "bg-secondary" }, { l: "Coding", w: "72%", c: "bg-secondary" }, { l: "Domain", w: "91%", c: "bg-secondary" }].map((b) => (
            <div key={b.l} className="flex items-center gap-2 text-[11px]">
              <span className="text-muted-foreground w-[60px]">{b.l}</span>
              <div className="flex-1 h-1 bg-white/[0.06] rounded-sm overflow-hidden">
                <div className={`h-full ${b.c} rounded-sm`} style={{ width: b.w }} />
              </div>
              <span className="text-secondary">{b.w}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    pill: "Adaptive AI",
  },
  {
    emoji: "🧠",
    num: "04",
    bandColor: "bg-gradient-to-r from-destructive to-[#ee5a24]",
    iconClass: "bg-destructive/[0.07] border-destructive/[0.14] group-hover:bg-destructive/[0.13]",
    checkClass: "bg-destructive/[0.08] border-destructive/[0.2] text-destructive",
    pillClass: "text-destructive border-destructive/20",
    pillDotClass: "",
    title: "Smart Notes",
    desc: "AI-organized study notes that summarize, tag, and connect concepts automatically. Intelligent recall prompts for faster retention.",
    feats: ["Auto-summarize any topic", "Smart tags & concept links", "Spaced repetition recall"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-destructive leading-relaxed mt-4 font-mono">
        <span className="text-muted-foreground">TOPIC:</span> <span className="text-foreground">System Design — Load Balancer</span><br />
        <span className="text-muted-foreground">AI SUMMARY:</span> <span className="text-destructive">3 key concepts saved ✓</span><br />
        <span className="text-muted-foreground">NEXT RECALL:</span> <span className="text-foreground">Tomorrow 9:00 AM</span>
      </div>
    ),
    pill: "New Feature",
  },
];

const ProblemsSection = () => {
  return (
    <section id="hired" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">Your path to success</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          Everything you need<br /><span className="text-primary">to get hired</span>
        </h2>
        <p className="text-[15px] text-muted-foreground max-w-[460px] leading-relaxed">
          Click any card to explore. Each module is built to move the needle on your job search.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {cards.map((card) => (
          <HiredCard key={card.num} card={card} />
        ))}
      </div>
    </section>
  );
};

const HiredCard = ({ card }: { card: (typeof cards)[0] }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-6px)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  const defaultIcon = !card.iconClass;
  const defaultCheck = !card.checkClass;
  const defaultPill = !card.pillClass;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group bg-card border border-border rounded-[20px] overflow-hidden transition-all duration-300 hover:border-primary/25 hover:shadow-[0_0_0_1px_rgba(200,241,53,0.08),0_24px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className={`h-[3px] w-full ${card.bandColor}`} />
      <div className="p-8">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0 border transition-all ${
              defaultIcon ? "bg-primary/[0.07] border-primary/[0.12] group-hover:bg-primary/[0.12] group-hover:border-primary/[0.28]" : card.iconClass
            }`}
          >
            {card.emoji}
          </div>
          <div className="font-display text-[52px] font-black text-white/[0.04] leading-none">{card.num}</div>
        </div>
        <div className="font-display text-xl font-bold text-foreground mb-2.5 leading-tight">{card.title}</div>
        <div className="text-[13px] text-muted-foreground leading-relaxed mb-5">{card.desc}</div>
        <ul className="flex flex-col gap-[7px] mb-6">
          {card.feats.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] flex-shrink-0 border ${
                  defaultCheck ? "bg-primary/[0.08] border-primary/20 text-primary" : card.checkClass
                }`}
              >
                ✓
              </div>
              {f}
            </li>
          ))}
        </ul>
        {card.screen}
        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[2px] uppercase border rounded-full px-3 py-1 ${
              defaultPill ? "text-primary border-primary/[0.18]" : card.pillClass
            }`}
          >
            <div className="w-[5px] h-[5px] rounded-full bg-current" />
            {card.pill}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSection;
