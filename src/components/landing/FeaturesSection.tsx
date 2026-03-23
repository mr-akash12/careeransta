import { useRef, useCallback } from "react";

const features = [
  {
    num: "01",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 7h5M9 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 8l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI Resume Builder",
    desc: "Generate ATS-optimized resumes tailored to any job in seconds. AI analyzes job descriptions and matches your skills perfectly.",
    pill: "Most popular",
  },
  {
    num: "02",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 20c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="19" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Mock Interviews",
    desc: "Practice with an AI interviewer that asks real questions, evaluates your answers, and gives actionable feedback in real time.",
    pill: "AI powered",
  },
  {
    num: "03",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Mock Tests",
    desc: "Adaptive test series covering aptitude, coding, and domain knowledge. Track scores, identify weak areas, and improve fast.",
    pill: "Adaptive AI",
  },
  {
    num: "04",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Smart Notes",
    desc: "AI-organized study notes that summarize, tag, and connect concepts automatically. Learn faster with intelligent recall prompts.",
    pill: "New feature",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">What we offer</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          Everything you need<br />to <span className="text-primary">get hired</span>
        </h2>
        <p className="text-[15px] text-muted-foreground max-w-[460px] leading-relaxed">
          Four powerful AI modules working together to take you from job seeker to dream offer.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-[3px] rounded-3xl overflow-hidden border border-border">
        {features.map((feat) => (
          <FeatureCard key={feat.num} feat={feat} />
        ))}
      </div>
    </section>
  );
};

const FeatureCard = ({ feat }: { feat: (typeof features)[0] }) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ tX: 0, tY: 0, cX: 0, cY: 0, rafId: null as number | null });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const inner = innerRef.current;
    if (!inner) return;
    s.cX = lerp(s.cX, s.tX, 0.09);
    s.cY = lerp(s.cY, s.tY, 0.09);
    inner.style.transform = `rotateX(${s.cX}deg) rotateY(${s.cY}deg) translateZ(10px)`;
    if (Math.abs(s.cX - s.tX) > 0.01 || Math.abs(s.cY - s.tY) > 0.01) {
      s.rafId = requestAnimationFrame(animate);
    } else {
      s.rafId = null;
    }
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    stateRef.current.tX = (y - 0.5) * 12;
    stateRef.current.tY = (x - 0.5) * -12;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (!stateRef.current.rafId) stateRef.current.rafId = requestAnimationFrame(animate);
  }, [animate]);

  const handleLeave = useCallback(() => {
    stateRef.current.tX = 0;
    stateRef.current.tY = 0;
    const reset = () => {
      const s = stateRef.current;
      const inner = innerRef.current;
      if (!inner) return;
      s.cX = lerp(s.cX, 0, 0.07);
      s.cY = lerp(s.cY, 0, 0.07);
      inner.style.transform = `rotateX(${s.cX}deg) rotateY(${s.cY}deg) translateZ(10px)`;
      if (Math.abs(s.cX) > 0.01 || Math.abs(s.cY) > 0.01) requestAnimationFrame(reset);
      else inner.style.transform = "";
    };
    requestAnimationFrame(reset);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="bg-card p-16 lg:p-[72px] relative overflow-hidden group transition-colors duration-400 hover:bg-muted"
      style={{ transformStyle: "preserve-3d", perspective: "600px" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(200,241,53,0.07) 0%, transparent 60%)",
        }}
      />

      <div ref={innerRef} className="transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d" }}>
        <div className="font-display text-[10px] font-bold text-primary/20 tracking-[3px] mb-8">{feat.num}</div>
        <div
          className="w-[66px] h-[66px] rounded-[18px] bg-primary/[0.06] border border-primary/[0.12] flex items-center justify-center mb-8 text-primary group-hover:bg-primary/[0.11] group-hover:border-primary/[0.28] group-hover:scale-105 transition-all duration-400"
          style={{ transform: "translateZ(20px)" }}
        >
          {feat.icon}
        </div>
        <h3 className="font-display text-[26px] font-bold text-foreground mb-3.5" style={{ transform: "translateZ(10px)" }}>
          {feat.title}
        </h3>
        <p className="text-[15px] text-muted-foreground leading-relaxed" style={{ transform: "translateZ(5px)" }}>
          {feat.desc}
        </p>
        <span className="inline-block mt-6 text-[9px] tracking-[2.5px] uppercase text-primary border border-primary/[0.18] rounded-full px-4 py-1.5">
          {feat.pill}
        </span>
      </div>
    </div>
  );
};

export default FeaturesSection;
