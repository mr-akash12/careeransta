import { Upload, Brain, MessageCircle, TrendingUp } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: Upload,
      title: "Upload Your Resume",
      description: "Start by uploading your resume. Our AI analyzes it to understand your skills, experience, and target role.",
    },
    {
      step: 2,
      icon: Brain,
      title: "AI Generates Questions",
      description: "Based on your profile, we create personalized interview questions covering HR, technical, and behavioral aspects.",
    },
    {
      step: 3,
      icon: MessageCircle,
      title: "Practice & Get Feedback",
      description: "Answer questions in text or voice. Our AI evaluates each response and provides actionable improvement tips.",
    },
    {
      step: 4,
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Review your performance scores, strengths, and areas to improve. Book expert sessions for advanced guidance.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Path to Interview Success
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple 4-step process to transform your interview preparation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-primary shadow-primary flex items-center justify-center">
                      <Icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
