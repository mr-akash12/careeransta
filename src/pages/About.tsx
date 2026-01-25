import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import founderImage from "@/assets/founder-akash.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                About <span className="text-[#ff9f1c]">CareerANSTA</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                CareerANSTA is an AI-powered interview and career preparation platform built to help students and job seekers gain real confidence through practice, feedback, and smart evaluation.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-card/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#ff9f1c] to-[#ffca3a] flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">Our Mission</h2>
              </div>
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                <p>
                  At CareerANSTA, we believe that preparing for interviews shouldn't be about memorizing textbook answers or watching endless tutorial videos. It should be about <span className="text-foreground font-medium">real practice</span>, <span className="text-foreground font-medium">honest feedback</span>, and <span className="text-foreground font-medium">continuous improvement</span>.
                </p>
                <p>
                  That's why we built an AI-powered platform that simulates real interview experiences. Our system uses advanced voice interaction, natural conversation flow, and intelligent evaluation to help you understand not just what to say—but how to say it with confidence.
                </p>
                <p>
                  We're here for freshers stepping into the job market for the first time, early-career professionals looking to level up, and anyone who wants to walk into their next interview feeling prepared. Our goal is simple: make interview preparation <span className="text-[#ff9f1c] font-semibold">accessible</span>, <span className="text-[#ff9f1c] font-semibold">practical</span>, and <span className="text-[#ff9f1c] font-semibold">effective</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#ff9f1c] to-[#ffca3a] flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">Our Vision</h2>
              </div>
              <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                <p>
                  We envision a future where hiring decisions are based on <span className="text-foreground font-medium">skills and potential</span>, not just resumes and credentials. CareerANSTA is designed to bridge the gap between education and employment by focusing on what truly matters—how well you can communicate, think on your feet, and present yourself professionally.
                </p>
                <p>
                  Our platform isn't just for individuals. We're building CareerANSTA to serve <span className="text-[#ff9f1c] font-semibold">students</span>, <span className="text-[#ff9f1c] font-semibold">job seekers</span>, <span className="text-[#ff9f1c] font-semibold">colleges</span>, and <span className="text-[#ff9f1c] font-semibold">recruiters</span>—creating a unified ecosystem where talent meets opportunity through fair, skill-based evaluation.
                </p>
                <p>
                  As we grow, our vision is to become the most trusted AI interview platform in India and beyond—empowering millions to prepare smarter and succeed faster.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-24 bg-card/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-[#ff9f1c]" />
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  Meet the Team Behind <span className="text-[#ff9f1c]">CareerANSTA</span>
                </h2>
              </div>
              <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                CareerANSTA is currently built and led by a passionate founder with a clear mission to simplify and improve interview preparation using AI.
              </p>

              {/* Founder Card */}
              <div className="max-w-sm mx-auto">
                <div className="group relative bg-card border border-border rounded-2xl p-8 transition-all duration-300 hover:border-[#ff9f1c]/50 hover:shadow-[0_0_40px_-10px_rgba(255,159,28,0.3)]">
                  {/* Profile Image */}
                  <div className="relative mx-auto mb-6 w-32 h-32">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff9f1c] to-[#ffca3a] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#ff9f1c] to-[#ffca3a] p-[3px]">
                      <img 
                        src={founderImage} 
                        alt="Akash Kumar Nayak" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    Akash Kumar Nayak
                  </h3>
                  <p className="text-[#ff9f1c] font-semibold text-sm mb-4">
                    Founder & CEO
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Founder of CareerANSTA with a background in data analytics and AI-driven systems. Passionate about building practical tools that help students and job seekers prepare confidently for real interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of students and professionals who are preparing smarter with CareerANSTA.
              </p>
              <Link to="/signup">
                <Button variant="sunset" size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
