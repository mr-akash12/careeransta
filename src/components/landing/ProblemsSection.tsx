import { useCallback, useRef, useState } from "react";

const cards = [
  {
    emoji: "📄", num: "01", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-primary to-lime-2",
    accentColor: "primary",
    title: "AI Resume Builder",
    desc: "AI reads the JD, rewrites your resume to match — keyword-perfect and recruiter-approved in seconds.",
    feats: ["ATS score analysis & fix", "JD keyword matching", "One-click multiple formats"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-primary leading-relaxed mt-3.5 font-mono">
        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">ATS Score</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-display text-[22px] font-black text-primary">94%</span>
          <span className="text-[10px] text-muted-foreground text-right">✓ Keywords matched<br/>✓ Format optimized</span>
        </div>
        <div className="h-1 rounded-sm bg-white/[0.06] mt-1.5 overflow-hidden">
          <div className="score-fill h-full rounded-sm bg-gradient-to-r from-lime-2 to-primary" style={{ "--w": "94%" } as React.CSSProperties} />
        </div>
      </div>
    ),
    pill: "Most Popular",
  },
  {
    emoji: "🎤", num: "02", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-info to-[#0099cc]",
    accentColor: "info",
    title: "Mock Interviews",
    desc: "AI mimics real interviewers from Google, Amazon, Flipkart. Instant feedback on confidence and clarity.",
    feats: ["Company-specific questions", "Real-time AI scoring", "Confidence analysis"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-info leading-relaxed mt-3.5 font-mono">
        <span className="text-lime-2">INTERVIEWER:</span> Tell me about yourself<br/>
        <span className="text-foreground">YOU:</span> I am a Software Engineer...<br/>
        <span className="text-muted-foreground">AI SCORE: </span><span className="text-info">★★★★☆ 82/100</span>
        <span className="inline-block w-0.5 h-3 bg-info ml-0.5 animate-pulse align-middle" />
      </div>
    ),
    pill: "AI Powered",
  },
  {
    emoji: "📝", num: "03", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-secondary to-[#6d28d9]",
    accentColor: "secondary",
    title: "Mock Tests",
    desc: "Adaptive series — aptitude, coding, domain. AI adjusts difficulty to your real-time performance.",
    feats: ["Aptitude + coding + domain", "Adaptive difficulty engine", "Weak-area reports"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-secondary leading-relaxed mt-3.5 font-mono">
        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">Performance This Week</div>
        <div className="mt-2 flex flex-col gap-1.5">
          {[{ l: "Aptitude", w: "88%" }, { l: "Coding", w: "72%" }, { l: "Domain", w: "91%" }].map((b) => (
            <div key={b.l} className="flex items-center gap-2 text-[11px]">
              <span className="text-muted-foreground w-14">{b.l}</span>
              <div className="flex-1 h-[3px] bg-white/[0.06] rounded-sm overflow-hidden"><div className="h-full bg-secondary rounded-sm" style={{ width: b.w }} /></div>
              <span className="text-secondary">{b.w}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    pill: "Adaptive AI",
  },
  {
    emoji: "🧠", num: "04", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-destructive to-[#ee5a24]",
    accentColor: "destructive",
    title: "Smart Notes",
    desc: "AI auto-summarizes, tags and connects concepts. Spaced repetition recall prompts for faster retention.",
    feats: ["Auto-summarize any topic", "Smart tags & concept links", "Spaced repetition"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-destructive leading-relaxed mt-3.5 font-mono">
        <span className="text-muted-foreground">TOPIC:</span> <span className="text-foreground">System Design — Load Balancer</span><br/>
        <span className="text-muted-foreground">AI SUMMARY:</span> <span className="text-destructive">3 key concepts saved ✓</span><br/>
        <span className="text-muted-foreground">NEXT RECALL:</span> <span className="text-foreground">Tomorrow 9:00 AM</span>
      </div>
    ),
    pill: "New Feature",
  },
  {
    emoji: "👨‍💻", num: "05", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-[#00ffcc] to-[#00d4aa]",
    accentColor: "[#00ffcc]",
    title: "Coding Practice",
    desc: "AI-evaluated coding problems with theory + code questions, chapter-wise. DSA, system design, SQL — all covered.",
    feats: ["DSA + System Design + SQL", "AI code evaluation", "Chapter-wise progression"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-[#00ffcc] leading-relaxed mt-3.5 font-mono">
        <span className="text-muted-foreground">{"// DSA Problem #142"}</span><br/>
        <span className="text-[#00ffcc]">function</span> <span className="text-foreground">twoSum</span><span className="text-muted-foreground">(nums, target) {"{"}</span><br/>
        &nbsp;&nbsp;<span className="text-muted-foreground">{"// Your solution here"}</span><br/>
        <span className="text-muted-foreground">{"}"}</span><br/>
        <span className="text-muted-foreground">AI:</span> <span className="text-[#00ffcc]">Optimal O(n) solution found ✓</span>
        <span className="inline-block w-0.5 h-3 bg-[#00ffcc] ml-0.5 animate-pulse align-middle" />
      </div>
    ),
    pill: "Coming Soon",
  },
  {
    emoji: "🔗", num: "06", gridClass: "col-span-6 md:col-span-2",
    bandColor: "from-warning to-[#d97706]",
    accentColor: "warning",
    title: "LinkedIn Analyzer",
    desc: "Paste your LinkedIn profile — get ATS score, keyword gaps, and a 30-day improvement roadmap instantly.",
    feats: ["Profile ATS score", "Keyword gap analysis", "30-day improvement plan"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-warning leading-relaxed mt-3.5 font-mono">
        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">LinkedIn Profile Score</div>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-display text-[22px] font-black text-warning">78%</span>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground mb-1">Keywords missing: 12</div>
            <div className="h-1 rounded-sm bg-white/[0.06] overflow-hidden">
              <div className="score-fill h-full rounded-sm bg-gradient-to-r from-[#d97706] to-warning" style={{ "--w": "78%" } as React.CSSProperties} />
            </div>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground">Top fix: Add <span className="text-warning">"Machine Learning"</span> to headline</div>
      </div>
    ),
    pill: "Live Now",
  },
  {
    emoji: "🗺️", num: "07", gridClass: "col-span-6 md:col-span-3",
    bandColor: "from-[#ec4899] to-[#be185d]",
    accentColor: "[#ec4899]",
    title: "Career Roadmap Generator",
    desc: "Tell us your dream job — get a personalized 90-day roadmap with daily tasks, weekly goals and live progress tracking.",
    feats: ["Goal-based 90-day plan", "Daily task breakdown", "Progress tracking & adjustments"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-[#ec4899] leading-relaxed mt-3.5 font-mono">
        <span className="text-[#ec4899]">GOAL:</span> <span className="text-foreground">Data Scientist @ Google</span><br/>
        <span className="text-muted-foreground">WEEK 1-4:</span> <span className="text-[#f9a8d4]">Python + SQL mastery</span><br/>
        <span className="text-muted-foreground">WEEK 5-8:</span> <span className="text-[#f9a8d4]">ML algorithms + projects</span><br/>
        <span className="text-muted-foreground">WEEK 9-12:</span> <span className="text-[#f9a8d4]">Mock interviews + Resume</span><br/>
        <span className="text-[#ec4899]">STATUS:</span> <span className="text-foreground">On track ✓</span>
        <span className="inline-block w-0.5 h-3 bg-[#ec4899] ml-0.5 animate-pulse align-middle" />
      </div>
    ),
    pill: "Coming Soon",
  },
  {
    emoji: "📅", num: "08", gridClass: "col-span-6 md:col-span-3",
    bandColor: "from-primary to-lime-2",
    accentColor: "primary",
    title: "Live Expert Sessions",
    desc: "Book 1-on-1 with industry pros from Google, Amazon, Flipkart. Personalized career guidance & placement advice.",
    feats: ["Top company professionals", "Personalized feedback sessions", "Resume + interview + offer guidance"],
    screen: (
      <div className="bg-black/40 border border-white/5 rounded-[10px] p-3.5 text-xs text-primary leading-relaxed mt-3.5 font-mono">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-[34px] h-[34px] rounded-full bg-primary/[0.15] border border-primary/30 flex items-center justify-center text-sm">👤</div>
          <div><div className="text-xs text-foreground">Rahul K. · SDE @ Google</div><div className="text-[10px] text-muted-foreground">Ex-Amazon, Ex-Microsoft</div></div>
          <div className="ml-auto text-[9px] text-primary border border-primary/20 px-2 py-0.5 rounded-full">● LIVE</div>
        </div>
        <div className="text-[11px] text-muted-foreground">Next slot: <span className="text-primary">Today 7:00 PM IST</span></div>
        <div className="h-1 rounded-sm bg-white/[0.06] mt-2 overflow-hidden">
          <div className="score-fill h-full rounded-sm bg-gradient-to-r from-lime-2 to-primary" style={{ "--w": "70%" } as React.CSSProperties} />
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">7/10 slots booked</div>
      </div>
    ),
    pill: "Live Now",
  },
];

const accentStyles: Record<string, { icon: string; check: string; pill: string }> = {
  primary: {
    icon: "bg-primary/[0.08] border-primary/[0.15]",
    check: "bg-primary/[0.08] border-primary/20 text-primary",
    pill: "text-primary border-primary/20",
  },
  info: {
    icon: "bg-info/[0.08] border-info/[0.15]",
    check: "bg-info/[0.08] border-info/20 text-info",
    pill: "text-info border-info/20",
  },
  secondary: {
    icon: "bg-secondary/[0.08] border-secondary/[0.15]",
    check: "bg-secondary/[0.08] border-secondary/20 text-secondary",
    pill: "text-secondary border-secondary/20",
  },
  destructive: {
    icon: "bg-destructive/[0.08] border-destructive/[0.15]",
    check: "bg-destructive/[0.08] border-destructive/20 text-destructive",
    pill: "text-destructive border-destructive/20",
  },
  warning: {
    icon: "bg-warning/[0.08] border-warning/[0.15]",
    check: "bg-warning/[0.08] border-warning/20 text-warning",
    pill: "text-warning border-warning/20",
  },
  "[#00ffcc]": {
    icon: "bg-[#00ffcc]/[0.08] border-[#00ffcc]/[0.15]",
    check: "bg-[#00ffcc]/[0.08] border-[#00ffcc]/20 text-[#00ffcc]",
    pill: "text-[#00ffcc] border-[#00ffcc]/20",
  },
  "[#ec4899]": {
    icon: "bg-[#ec4899]/[0.08] border-[#ec4899]/[0.15]",
    check: "bg-[#ec4899]/[0.08] border-[#ec4899]/20 text-[#ec4899]",
    pill: "text-[#ec4899] border-[#ec4899]/20",
  },
};

const ProblemsSection = () => {
  return (
    <section id="hired" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">Your path to success</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          Everything you need<br /><span className="text-primary">to get hired</span>
        </h2>
        <p className="text-[15px] text-muted-foreground max-w-[460px] leading-relaxed">
          Click any card. Each module moves the needle on your job search — fast.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <HiredCard key={card.num} card={card} index={i} />
        ))}
      </div>
    </section>
  );
};

const HiredCard = ({ card, index }: { card: (typeof cards)[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ tX: 0, tY: 0, cX: 0, cY: 0, rafId: null as number | null });
  const [clicked, setClicked] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const el = ref.current;
    if (!el) return;
    s.cX = lerp(s.cX, s.tX, 0.1);
    s.cY = lerp(s.cY, s.tY, 0.1);
    el.style.transform = `perspective(900px) rotateX(${s.cX}deg) rotateY(${s.cY}deg) translateY(-6px)`;
    if (Math.abs(s.cX - s.tX) > 0.01 || Math.abs(s.cY - s.tY) > 0.01) {
      s.rafId = requestAnimationFrame(animate);
    } else {
      s.rafId = null;
    }
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stateRef.current.tX = -y * 10;
    stateRef.current.tY = x * 10;
    if (!stateRef.current.rafId) stateRef.current.rafId = requestAnimationFrame(animate);
  }, [animate]);

  const handleLeave = useCallback(() => {
    stateRef.current.tX = 0;
    stateRef.current.tY = 0;
    const reset = () => {
      const s = stateRef.current;
      const el = ref.current;
      if (!el) return;
      s.cX = lerp(s.cX, 0, 0.08);
      s.cY = lerp(s.cY, 0, 0.08);
      el.style.transform = `perspective(900px) rotateX(${s.cX}deg) rotateY(${s.cY}deg) translateY(0px)`;
      if (Math.abs(s.cX) > 0.01 || Math.abs(s.cY) > 0.01) requestAnimationFrame(reset);
      else el.style.transform = "";
    };
    requestAnimationFrame(reset);
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  const styles = accentStyles[card.accentColor] || accentStyles.primary;
  const floatDelay = `${index * 1.1}s`;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      data-cursor-grow
      className={`${card.gridClass} group relative overflow-hidden rounded-[20px] border transition-all duration-500 cursor-pointer
        ${clicked
          ? "border-primary/90 shadow-[0_0_0_3px_rgba(200,241,53,0.35),0_0_60px_rgba(200,241,53,0.2)]"
          : "border-white/5 hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(200,241,53,0.08),0_28px_70px_rgba(0,0,0,0.6)]"
        }`}
      style={{
        transformStyle: "preserve-3d",
        background: "linear-gradient(145deg, rgba(12,12,20,0.97), rgba(6,6,14,0.99))",
        animation: `card-float 8s cubic-bezier(.45,.05,.55,.95) infinite`,
        animationDelay: floatDelay,
      }}
    >
      {/* Color band */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${card.bandColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-band-shine" />
      </div>

      <div className="p-7">
        {/* Icon + number */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0 border transition-all ${styles.icon}`}>
            {card.emoji}
          </div>
          <div className="font-display text-[48px] font-black text-white/[0.04] leading-none group-hover:text-white/[0.07] transition-colors">
            {card.num}
          </div>
        </div>

        <div className="font-display text-lg font-bold text-foreground mb-2 leading-tight">{card.title}</div>
        <div className="text-[12.5px] text-muted-foreground leading-relaxed mb-4">{card.desc}</div>

        <ul className="flex flex-col gap-1.5 mb-5">
          {card.feats.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[11.5px] text-muted-foreground">
              <div className={`w-[15px] h-[15px] rounded-full flex items-center justify-center text-[7px] flex-shrink-0 border ${styles.check}`}>✓</div>
              {f}
            </li>
          ))}
        </ul>

        {card.screen}

        <div className="mt-4">
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[2px] uppercase border rounded-full px-3 py-1 ${styles.pill}`}>
            <div className="w-[5px] h-[5px] rounded-full bg-current" />
            {card.pill}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSection;
