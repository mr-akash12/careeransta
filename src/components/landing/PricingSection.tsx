import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out the platform",
      features: [
        "3 AI Mock Interviews / month",
        "Basic resume analysis",
        "10 Exam questions / day",
        "Community support",
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For serious career preparation",
      features: [
        "Unlimited AI Mock Interviews",
        "Advanced resume analysis & tips",
        "Unlimited Exam practice",
        "Written answer evaluation (OCR)",
        "Progress analytics dashboard",
        "Priority email support",
      ],
      cta: "Get Pro",
      variant: "hero" as const,
      popular: true,
    },
    {
      name: "Premium",
      price: "₹999",
      period: "per month",
      description: "Complete career transformation",
      features: [
        "Everything in Pro",
        "2 Live Expert Sessions / month",
        "1-on-1 Career Roadmap",
        "Interview recordings & analysis",
        "Dedicated success manager",
        "24/7 priority support",
      ],
      cta: "Go Premium",
      variant: "accent" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your career goals. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-primary text-primary-foreground shadow-primary scale-105"
                  : "bg-card border border-border"
              } transition-all duration-300 card-hover`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="text-center mb-6">
                <h3 className={`font-display text-xl font-semibold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.popular ? "text-accent" : "text-success"}`} />
                    <span className={`text-sm ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.popular ? "secondary" : plan.variant}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
