import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, GraduationCap } from "lucide-react";

const PricingSection = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Free",
      icon: Zap,
      monthlyPrice: 0,
      annualPrice: 0,
      period: "forever",
      description: "Try before you commit — no credit card needed",
      badge: null,
      color: "border-[hsl(240,15%,22%)]",
      btnVariant: "outline" as const,
      btnText: "Start Free",
      features: [
        "3 AI Mock Interviews / month",
        "5 Interview Questions / day",
        "Basic Notes (English only)",
        "1 LinkedIn Analysis / month",
        "Basic Exam Practice",
        "Community support",
      ],
      missing: [
        "Hindi language support",
        "Unlimited analyses",
        "Career Roadmap",
      ],
    },
    {
      name: "Pro",
      icon: Sparkles,
      monthlyPrice: 199,
      annualPrice: 125,
      annualTotal: 1499,
      period: "per month",
      description: "Everything you need to crack your dream job",
      badge: "🔥 Most Popular",
      color: "border-[hsl(250,100%,70%)]",
      btnVariant: "hero" as const,
      btnText: "Get Pro",
      features: [
        "Unlimited AI Mock Interviews",
        "Full Notes — Hindi + English ✅",
        "Unlimited LinkedIn Analyzer",
        "Interview Prep (Theory + Coding)",
        "Unlimited Exam Practice",
        "Career Roadmap Generator",
        "Resume Analyzer",
        "Priority support",
      ],
      missing: [],
    },
    {
      name: "Premium",
      icon: Crown,
      monthlyPrice: 499,
      annualPrice: 333,
      annualTotal: 3999,
      period: "per month",
      description: "1-on-1 expert guidance for fast-track success",
      badge: "👑 Best Results",
      color: "border-[hsl(35,100%,55%)]",
      btnVariant: "accent" as const,
      btnText: "Go Premium",
      features: [
        "Everything in Pro",
        "2 Live Expert Sessions / month",
        "1-on-1 Career Roadmap",
        "Interview Recording & Analysis",
        "Salary Negotiation Guide",
        "Dedicated Success Manager",
        "24/7 Priority Support",
      ],
      missing: [],
    },
  ];

  const collegePlan = {
    name: "College / Batch",
    icon: GraduationCap,
    price: "₹79",
    per: "per student / month",
    min: "Minimum 20 students",
    features: [
      "Everything in Pro",
      "Bulk discount — save 60%",
      "College admin dashboard",
      "Progress reports for faculty",
      "Custom branding available",
      "Dedicated account manager",
    ],
  };

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-glow-orange opacity-15" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, <span className="text-gradient-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-3">
            10x cheaper than competitors. Made for Indian students. 🇮🇳
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-0 bg-card border border-border rounded-xl overflow-hidden mt-4">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === "annual"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                billing === "annual" ? "bg-white/20 text-white" : "bg-green-500/15 text-green-500"
              }`}>
                Save 37%
              </span>
            </button>
          </div>
        </div>

        {/* Main Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {plans.map((plan, index) => {
            const price = billing === "annual" && plan.annualPrice !== undefined
              ? plan.annualPrice
              : plan.monthlyPrice;
            const Icon = plan.icon;
            const isPopular = plan.badge === "🔥 Most Popular";

            return (
              <div
                key={index}
                className={`relative rounded-2xl border-2 ${plan.color} p-7 transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-b from-[hsl(250,60%,12%)] to-[hsl(240,25%,8%)] shadow-2xl shadow-primary/20 scale-[1.03]"
                    : "bg-card hover:border-primary/40"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-lg ${
                      isPopular
                        ? "bg-primary text-white"
                        : "bg-[hsl(35,100%,55%)] text-black"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isPopular ? "bg-primary/20" : "bg-card border border-border"
                  }`}>
                    <Icon className={`h-5 w-5 ${isPopular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-foreground">
                      {price === 0 ? "₹0" : `₹${price}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{price === 0 ? "forever" : "mo"}
                    </span>
                  </div>
                  {billing === "annual" && plan.annualTotal && (
                    <p className="text-xs text-green-500 mt-1 font-medium">
                      ₹{plan.annualTotal}/year · billed annually
                    </p>
                  )}
                  {billing === "monthly" && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Switch to annual — save 37%
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isPopular ? "bg-primary/20" : "bg-green-500/10"
                      }`}>
                        <Check className={`h-2.5 w-2.5 ${isPopular ? "text-primary" : "text-green-500"}`} />
                      </div>
                      <span className="text-sm text-muted-foreground leading-snug">{feature}</span>
                    </li>
                  ))}
                  {plan.missing.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 opacity-35">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-muted">
                        <span className="text-[8px] text-muted-foreground">✕</span>
                      </div>
                      <span className="text-sm text-muted-foreground leading-snug line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="block">
                  <Button
                    variant={plan.btnVariant}
                    size="lg"
                    className="w-full font-bold"
                  >
                    {plan.btnText}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Lifetime Deal Banner */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="relative rounded-2xl border border-[hsl(35,100%,55%)]/40 bg-gradient-to-r from-[hsl(35,60%,8%)] to-[hsl(25,40%,6%)] p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(35,100%,55%)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xs font-bold tracking-widest uppercase text-[hsl(35,100%,55%)]">
                    Limited Time — Lifetime Deal
                  </span>
                </div>
                <h3 className="font-display text-2xl font-black text-foreground mb-1">
                  Pay Once. Use Forever.
                </h3>
                <p className="text-muted-foreground text-sm">
                  All Pro features, forever. No monthly charges. Only for early adopters!
                </p>
              </div>
              <div className="text-center shrink-0">
                <div className="flex items-baseline gap-1 justify-center">
                  <span className="text-5xl font-black text-[hsl(35,100%,55%)]">₹2,999</span>
                  <span className="text-muted-foreground text-sm line-through ml-2">₹9,999</span>
                </div>
                <p className="text-green-500 text-xs font-bold mb-3">Save 70% — Only 50 seats left!</p>
                <Link to="/signup">
                  <Button className="bg-[hsl(35,100%,55%)] hover:bg-[hsl(35,100%,50%)] text-black font-black px-8">
                    Grab Lifetime Deal →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* College Plan */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-display text-xl font-bold text-foreground">College / Batch Plan</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                    B2B
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {collegePlan.min} · Perfect for placement cells & coaching institutes
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {collegePlan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center shrink-0">
                <div className="flex items-baseline gap-1 justify-center mb-1">
                  <span className="text-3xl font-black text-foreground">₹79</span>
                  <span className="text-xs text-muted-foreground">/student/mo</span>
                </div>
                <p className="text-xs text-green-500 font-medium mb-3">Save 60% vs Pro</p>
                <Link to="/contact">
                  <Button variant="outline" size="sm" className="font-semibold">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Compare vs competitors */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            Why pay more? CareerANSTA is 10x cheaper than competitors
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "InterviewBit", price: "₹2,999/mo", lang: "English only" },
              { name: "Naukri Premium", price: "₹1,500/mo", lang: "English only" },
              { name: "Resume Worded", price: "₹1,600/mo", lang: "English only" },
              { name: "CareerANSTA ✅", price: "₹199/mo", lang: "Hindi + English", highlight: true },
            ].map((c, i) => (
              <div key={i} className={`rounded-xl p-3 text-center border ${
                c.highlight
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card"
              }`}>
                <p className={`text-xs font-bold mb-1 ${c.highlight ? "text-primary" : "text-foreground"}`}>
                  {c.name}
                </p>
                <p className={`text-sm font-black ${c.highlight ? "text-primary" : "text-foreground"}`}>
                  {c.price}
                </p>
                <p className={`text-[10px] mt-1 ${c.highlight ? "text-green-500" : "text-muted-foreground"}`}>
                  {c.lang}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;