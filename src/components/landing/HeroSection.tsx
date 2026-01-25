import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

const HeroSection = () => {
  const highlights = [
    "AI-Powered Mock Interviews",
    "Live Expert Guidance",
    "Personalized Exam Practice",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-gradient-hero">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orange glow - top right */}
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-glow-orange opacity-60" />
        {/* Purple glow - bottom left */}
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-glow-purple opacity-50" />
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-glow-orange opacity-20" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,122,24,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,122,24,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by <span className="text-primary">10,000+</span> Students & Professionals
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-foreground">AI + Human</span>
            <br />
            <span className="text-gradient-primary">Career Guidance</span>
            <br />
            <span className="text-foreground">& Mock Interviews</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Ace your next interview with <span className="text-primary">AI-powered practice</span>, connect with industry experts for personalized guidance, and master exams with smart evaluation.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors duration-200"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/signup">
              <Button variant="sunset" size="xl" className="group">
                <Sparkles className="h-5 w-5" />
                Start Free Today
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group">
              <Play className="h-5 w-5 text-primary" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-muted-foreground mb-6">
              Helping students land jobs at top companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map((company) => (
                <span 
                  key={company} 
                  className="text-lg font-display font-semibold text-muted-foreground/60 hover:text-primary transition-colors duration-200"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
