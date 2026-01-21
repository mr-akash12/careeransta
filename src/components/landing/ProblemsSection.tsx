import { XCircle, ArrowRight } from "lucide-react";

const ProblemsSection = () => {
  const problems = [
    {
      problem: "No interview practice",
      description: "Most students enter interviews unprepared, with no real practice experience.",
    },
    {
      problem: "Lack of expert guidance",
      description: "Expensive career counseling and no access to industry professionals.",
    },
    {
      problem: "Generic exam prep",
      description: "One-size-fits-all study materials that don't adapt to your learning pace.",
    },
    {
      problem: "No personalized feedback",
      description: "Written exam answers go unevaluated, leaving gaps in understanding.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Students Struggle to Land Their Dream Jobs
          </h2>
          <p className="text-lg text-muted-foreground">
            Traditional methods are failing students and professionals alike.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((item, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-destructive/30 transition-all duration-300 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {item.problem}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-primary font-medium">
            <span>See how we solve these</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
