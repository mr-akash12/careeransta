import { useRef, useCallback } from "react";

const testimonials = [
  {
    text: "CareerANSTA's AI interview coach helped me crack my Google interview in just 3 weeks. The feedback was incredibly precise — better than any human coach.",
    name: "Arjun Kapoor",
    role: "SDE at Google · Bangalore",
    initials: "AK",
  },
  {
    text: "I tried 6 other resume builders. CareerANSTA's AI actually understood what the job required and rewrote my resume — got me 4x more callbacks.",
    name: "Priya Sharma",
    role: "Product Manager · Mumbai",
    initials: "PS",
  },
  {
    text: "The mock tests are scary accurate to actual placement tests. I went from failing to scoring in the top 5% at my campus placement. Absolute game changer.",
    name: "Rahul Verma",
    role: "Fresher at TCS · Hyderabad",
    initials: "RV",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">Real stories</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          They got hired.<br /><span className="text-primary">You're next.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
      </div>
    </section>
  );
};

const TestimonialCard = ({ t }: { t: (typeof testimonials)[0] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ tX: 0, tY: 0, cX: 0, cY: 0, rafId: null as number | null });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = stateRef.current;
    const el = ref.current;
    if (!el) return;
    s.cX = lerp(s.cX, s.tX, 0.09);
    s.cY = lerp(s.cY, s.tY, 0.09);
    el.style.transform = `translateY(-6px) rotateX(${s.cX}deg) rotateY(${s.cY}deg)`;
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
    stateRef.current.tX = -y * 6;
    stateRef.current.tY = x * 6;
    if (!stateRef.current.rafId) stateRef.current.rafId = requestAnimationFrame(animate);
  }, [animate]);

  const handleLeave = useCallback(() => {
    stateRef.current.tX = 0;
    stateRef.current.tY = 0;
    const reset = () => {
      const s = stateRef.current;
      const el = ref.current;
      if (!el) return;
      s.cX = lerp(s.cX, 0, 0.07);
      s.cY = lerp(s.cY, 0, 0.07);
      el.style.transform = `translateY(0px) rotateX(${s.cX}deg) rotateY(${s.cY}deg)`;
      if (Math.abs(s.cX) > 0.01 || Math.abs(s.cY) > 0.01) requestAnimationFrame(reset);
      else el.style.transform = "";
    };
    requestAnimationFrame(reset);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="bg-card border border-border rounded-[20px] p-8 transition-all duration-300 hover:border-primary/[0.18] hover:shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="font-display text-4xl text-primary/25 leading-none mb-3.5">"</div>
      <p className="text-sm text-foreground/80 leading-relaxed mb-6">{t.text}</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center font-display text-xs font-black text-primary">
          {t.initials}
        </div>
        <div>
          <div className="text-[13px] font-medium text-foreground">{t.name}</div>
          <div className="text-[11px] text-muted-foreground">{t.role}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
