import { Brain, Users, BookOpen, Target, MessageSquare, BarChart3 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Mock Interviews",
      description: "Practice with our AI interviewer that adapts to your resume and target role. Get instant feedback on your responses.",
      color: "primary",
      badge: "Most Popular",
    },
    {
      icon: Users,
      title: "Live Expert Sessions",
      description: "Book 1-on-1 sessions with industry professionals. Get real guidance from people who've been there.",
      color: "accent",
      badge: "Marketplace",
    },
    {
      icon: BookOpen,
      title: "Smart Exam Practice",
      description: "AI-generated questions based on your board, class, and syllabus. Personalized to your preparation level.",
      color: "success",
      badge: "AI-Powered",
    },
    {
      icon: Target,
      title: "Resume Analysis",
      description: "Upload your resume and get detailed insights on skill gaps, missing keywords, and improvement areas.",
      color: "info",
    },
    {
      icon: MessageSquare,
      title: "Written Answer Evaluation",
      description: "Take photos of handwritten answers. Our AI evaluates them like a real examiner with detailed feedback.",
      color: "warning",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual dashboards showing your improvement over time. Know exactly where you stand.",
      color: "primary",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
      accent: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
      success: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
      info: { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
      warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
    };
    return colors[color] || colors.primary;
  };

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete platform combining AI technology with human expertise to accelerate your career growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:shadow-large transition-all duration-300 card-hover"
              >
                {feature.badge && (
                  <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {feature.badge}
                  </span>
                )}
                
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} mb-4`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
