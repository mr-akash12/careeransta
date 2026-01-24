import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Users, 
  BookOpen, 
  ArrowRight,
  LogOut,
  Settings,
  Bell,
  Sparkles,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

const Dashboard = () => {
  const userName = "John"; // TODO: Get from auth context
  
  const features = [
    {
      id: "ai-interview",
      icon: Brain,
      title: "AI Mock Interview",
      description: "Practice with our AI interviewer. Get personalized questions based on your resume and target role.",
      gradient: "primary",
      stats: { label: "Interviews", value: "12", trend: "+3 this week" },
      href: "/ai-interview",
    },
    {
      id: "live-session",
      icon: Users,
      title: "Book Live Interview",
      description: "Connect with industry professionals for 1-on-1 mock interviews and career guidance sessions.",
      gradient: "accent",
      stats: { label: "Sessions", value: "5", trend: "2 upcoming" },
      href: "/live-sessions",
    },
    {
      id: "exam-practice",
      icon: BookOpen,
      title: "Exam Practice",
      description: "AI-generated questions based on your board, class, and syllabus. Get instant evaluation.",
      gradient: "primary",
      stats: { label: "Questions", value: "156", trend: "85% accuracy" },
      href: "/exam-practice",
    },
  ];

  const stats = [
    { icon: Target, label: "Overall Score", value: "78%", gradient: "primary" },
    { icon: Clock, label: "Practice Time", value: "24h", gradient: "accent" },
    { icon: TrendingUp, label: "Improvement", value: "+15%", gradient: "primary" },
    { icon: Brain, label: "AI Sessions", value: "12", gradient: "accent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-primary transition-all duration-300 group-hover:shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Career<span className="text-gradient-primary">Ascend</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-primary text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="text-gradient-primary">{userName}</span>! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to level up your career? Choose how you want to practice today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isOrange = stat.gradient === "primary";
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isOrange ? 'bg-gradient-primary' : 'bg-gradient-accent'
                  } shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isOrange = feature.gradient === "primary";

            return (
              <div
                key={feature.id}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 card-hover overflow-hidden"
              >
                {/* Subtle glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                  isOrange ? 'bg-glow-orange' : 'bg-glow-purple'
                }`} style={{ opacity: 0.05 }} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-5 shadow-lg ${
                    isOrange ? 'bg-gradient-primary shadow-primary/20' : 'bg-gradient-accent shadow-accent/20'
                  }`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-5 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border mb-5">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{feature.stats.value}</p>
                      <p className="text-xs text-muted-foreground">{feature.stats.label}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isOrange 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {feature.stats.trend}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Link to={feature.href}>
                    <Button variant="hero" className="w-full group/btn">
                      Start Now
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Recent Activity
          </h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {[
              { action: "Completed AI Mock Interview", role: "Software Engineer", time: "2 hours ago", score: 82 },
              { action: "Booked Live Session", role: "with Priya S.", time: "Yesterday", score: null },
              { action: "Exam Practice", role: "CBSE Class 12 - Maths", time: "2 days ago", score: 78 },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.score && (
                    <p className="font-semibold text-success">{activity.score}%</p>
                  )}
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
