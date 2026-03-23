import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TickerSection from "@/components/landing/TickerSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ProblemsSection from "@/components/landing/ProblemsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ParticleBackground from "@/components/landing/ParticleBackground";
import ScrollProgress from "@/components/landing/ScrollProgress";
import CustomCursor from "@/components/landing/CustomCursor";
import RippleCanvas from "@/components/landing/RippleCanvas";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden cursor-none">
      {/* Floating orbs */}
      <div className="orb w-[500px] h-[500px] bg-primary/[0.03] -top-[100px] -left-[100px]" style={{ animation: "orb-float1 12s ease-in-out infinite" }} />
      <div className="orb w-[400px] h-[400px] bg-info/[0.02] -bottom-[100px] -right-[50px]" style={{ animation: "orb-float2 15s ease-in-out infinite" }} />

      <CustomCursor />
      <RippleCanvas />
      <ParticleBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <TickerSection />
        <FeaturesSection />
        <ProblemsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
