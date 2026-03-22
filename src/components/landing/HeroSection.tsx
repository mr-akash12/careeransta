import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = cardRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const handleMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    };
    const handleLeave = () => {
      inner.style.transform = "rotateY(0) rotateX(0)";
    };

    wrap.addEventListener("mousemove", handleMove);
    wrap.addEventListener("mouseleave", handleLeave);
    return () => {
      wrap.removeEventListener("mousemove", handleMove);
      wrap.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-[120px] pb-20 px-6 z-[1]">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 text-[10px] tracking-[3px] uppercase text-primary border border-primary/20 rounded-full px-4 py-1.5 mb-9 animate-fade-in">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Now in beta — 10,000+ users joined
      </div>

      {/* Heading */}
      <h1 className="font-display text-[clamp(44px,7.5vw,102px)] font-black leading-[1.0] tracking-tighter text-foreground mb-7 animate-slide-up">
        Accelerate your
        <span className="block text-primary" style={{ textShadow: "0 0 60px rgba(200,241,53,0.25)" }}>
          career
        </span>
        with AI
      </h1>

      {/* Subtitle */}
      <p className="text-[17px] text-muted-foreground max-w-[500px] leading-relaxed mb-11 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        Build perfect resumes, ace mock interviews, crush tests, and organize notes — one intelligent platform for ambitious people.
      </p>

      {/* CTA */}
      <div className="flex gap-3.5 flex-wrap justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Link to="/signup">
          <button className="font-display text-xs font-bold text-primary-foreground bg-primary px-8 py-4 rounded-full hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(200,241,53,0.25)] transition-all relative overflow-hidden group">
            Start for free →
            <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </button>
        </Link>
        <button className="text-sm text-foreground bg-transparent border border-white/10 px-8 py-4 rounded-full hover:border-white/30 hover:-translate-y-0.5 transition-all backdrop-blur-lg">
          Watch demo
        </button>
      </div>

      {/* 3D Dashboard Card */}
      <div ref={cardRef} className="mt-20 w-full max-w-[860px] animate-slide-up" style={{ perspective: "1200px", animationDelay: "0.4s" }}>
        <div ref={innerRef} className="transition-transform duration-150 ease-out" style={{ transformStyle: "preserve-3d" }}>
          <div className="bg-card/80 border border-white/[0.07] rounded-[20px] overflow-hidden shadow-[0_0_0_1px_rgba(200,241,53,0.04),0_60px_140px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            {/* Top bar */}
            <div className="bg-[hsl(240,14%,8%)] border-b border-white/5 px-5 py-3 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-md px-3.5 py-1 text-[11px] text-muted-foreground mx-5 tracking-wider">
                app.careeransta.com/dashboard
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-[190px_1fr] min-h-[300px]">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col bg-background/60 border-r border-white/5 p-4 gap-1">
                {["Dashboard", "AI Resume", "Mock Interview", "Mock Tests", "Smart Notes", "Analytics"].map((item, i) => (
                  <div
                    key={item}
                    className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all ${
                      i === 0 ? "bg-primary/[0.08] text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="p-7 flex flex-col gap-5">
                <div className="font-display text-[15px] font-bold text-foreground">Welcome back, Arjun 👋</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: "94%", l: "Resume score" },
                    { v: "12", l: "Interviews done" },
                    { v: "820", l: "Points earned" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 hover:border-primary/20 transition-colors">
                      <div className="font-display text-2xl font-black text-primary leading-none">{s.v}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Resume", w: "94%" },
                    { label: "Interview", w: "78%" },
                    { label: "Tests", w: "65%" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground w-[76px] flex-shrink-0">{bar.label}</span>
                      <div className="flex-1 h-[5px] bg-white/5 rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm bg-gradient-to-r from-lime-2 to-primary"
                          style={{ width: bar.w }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
