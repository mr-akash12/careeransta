import { Brain, Users, BookOpen, Target, MessageSquare, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Mock Interviews",
      description: "Practice with our AI interviewer that adapts to your resume and target role. Get instant feedback on your responses.",
      gradient: "primary",
      badge: "Most Popular",
    },
    {
      icon: Users,
      title: "Live Expert Sessions",
      description: "Book 1-on-1 sessions with industry professionals. Get real guidance from people who've been there.",
      gradient: "accent",
      badge: "Marketplace",
    },
    {
      icon: BookOpen,
      title: "Smart Exam Practice",
      description: "AI-generated questions based on your board, class, and syllabus. Personalized to your preparation level.",
      gradient: "primary",
      badge: "AI-Powered",
    },
    {
      icon: Target,
      title: "Resume Analysis",
      description: "Upload your resume and get detailed insights on skill gaps, missing keywords, and improvement areas.",
      gradient: "accent",
    },
    {
      icon: MessageSquare,
      title: "Written Answer Evaluation",
      description: "Take photos of handwritten answers. Our AI evaluates them like a real examiner with detailed feedback.",
      gradient: "primary",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual dashboards showing your improvement over time. Know exactly where you stand.",
      gradient: "accent",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-glow-orange opacity-30" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-glow-purple opacity-30" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-gradient-primary">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete platform combining AI technology with human expertise to accelerate your career growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isOrange = feature.gradient === "primary";
            
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-hover"
              >
                {feature.badge && (
                  <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                    isOrange 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-secondary/10 text-secondary border border-secondary/20'
                  }`}>
                    {feature.badge}
                  </span>
                )}
                
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${
                  isOrange ? 'bg-gradient-primary' : 'bg-gradient-accent'
                } shadow-lg ${isOrange ? 'shadow-primary/20' : 'shadow-accent/20'}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  isOrange ? 'glow-orange' : 'glow-purple'
                }`} style={{ opacity: 0.05 }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
