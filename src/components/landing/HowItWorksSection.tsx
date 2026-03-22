const steps = [
  {
    num: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Build your profile",
    desc: "Enter your skills, experience, and career goals. Our AI builds a complete picture of your professional identity in minutes.",
  },
  {
    num: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Practice & prepare",
    desc: "Use all four modules in a personalized daily practice routine. AI adapts to your pace and weak spots automatically.",
  },
  {
    num: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2.5 6.5H21l-5.5 4 2 6.5L12 16l-5.5 4 2-6.5L3 9.5h6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Land the offer",
    desc: "Apply with confidence. Track applications, get interview alerts, and negotiate offers with AI-backed salary insights.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-28 px-6 lg:px-14 max-w-[1200px] mx-auto relative z-[1]">
      <div className="mb-14">
        <span className="text-[9px] tracking-[3.5px] uppercase text-primary block mb-3.5">The process</span>
        <h2 className="font-display text-[clamp(28px,4vw,54px)] font-black tracking-tight leading-[1.1] text-foreground mb-4">
          Three steps to<br /><span className="text-primary">your dream job</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="group bg-card border border-border rounded-[20px] p-10 relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Background number */}
            <div className="font-display text-[80px] font-black text-primary/[0.04] leading-none absolute top-4 right-5">
              {step.num}
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-[13px] bg-primary/[0.06] border border-primary/[0.12] flex items-center justify-center text-primary mb-6">
                {step.icon}
              </div>
              <h3 className="font-display text-[19px] font-bold text-foreground mb-2.5">{step.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
