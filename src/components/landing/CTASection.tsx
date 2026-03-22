import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="mx-6 lg:mx-14 mb-20 relative z-[1]">
      <div className="bg-card border border-border rounded-[28px] py-20 px-6 lg:px-14 text-center relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(200,241,53,0.06)_0%,transparent_65%)] pointer-events-none" />
        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,241,53,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,241,53,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <h2 className="font-display text-[clamp(28px,4vw,56px)] font-black tracking-tight text-foreground mb-5 relative z-[1]">
          Your career starts<br /><span className="text-primary">right now.</span>
        </h2>
        <p className="text-base text-muted-foreground mb-9 relative z-[1]">
          Join 10,000+ professionals who chose CareerANSTA to accelerate their career journey.
        </p>
        <div className="flex gap-3.5 justify-center relative z-[1]">
          <Link to="/signup">
            <button className="font-display text-xs font-bold text-primary-foreground bg-primary px-8 py-4 rounded-full hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(200,241,53,0.25)] transition-all relative overflow-hidden group">
              Create free account →
              <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </button>
          </Link>
          <Link to="/contact">
            <button className="text-sm text-foreground bg-transparent border border-white/10 px-8 py-4 rounded-full hover:border-white/30 hover:-translate-y-0.5 transition-all backdrop-blur-lg">
              Talk to us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
