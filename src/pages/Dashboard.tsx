import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Users, 
  BookOpen, 
  FileText,
  Search,
  ArrowRight,
  LogOut,
  TrendingUp,
  Clock,
  Target,
  Calendar,
  IndianRupee,
  Star,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import NotificationsDropdown from "@/components/dashboard/NotificationsDropdown";
import SettingsDropdown from "@/components/dashboard/SettingsDropdown";

const Dashboard = () => {
  const { user, role, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    if (!isLoading && user && !role) {
      navigate("/role-selection");
    }
  }, [user, role, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Professional Dashboard
  if (role === "professional") {
    return <ProfessionalDashboard user={user} onSignOut={handleSignOut} />;
  }

  // Student Dashboard (default)
  return <StudentDashboard user={user} onSignOut={handleSignOut} />;
};

interface DashboardProps {
  user: any;
  onSignOut: () => void;
}

const StudentDashboard = ({ user, onSignOut }: DashboardProps) => {
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Student";
  
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
    {
      id: "notes",
      icon: FileText,
      title: "Study Notes",
      description: "Complete Python & ML notes with theory, code, math and real-life examples. Hindi & English both!",
      gradient: "accent",
      stats: { label: "Topics", value: "14", trend: "Hindi + English" },
      href: "/notes",
    },
    {
      id: "analyzer",
      icon: Search,
      title: "Profile Analyzer",
      description: "Paste your LinkedIn profile — get ATS score, keyword gaps, and a 30-day improvement plan instantly.",
      gradient: "primary",
      stats: { label: "Avg Score", value: "72%", trend: "AI Powered" },
      href: "/analyzer",
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
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span><span className="text-[#ff9f1c]">ANSTA</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <NotificationsDropdown />
              <SettingsDropdown 
                onSignOut={onSignOut} 
                userEmail={user?.email}
                userName={user?.user_metadata?.full_name}
              />
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

const ProfessionalDashboard = ({ user, onSignOut }: DashboardProps) => {
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Professional";

  const stats = [
    { icon: Users, label: "Total Sessions", value: "24", gradient: "primary" },
    { icon: IndianRupee, label: "Earnings", value: "₹12,000", gradient: "accent" },
    { icon: Star, label: "Rating", value: "4.8", gradient: "primary" },
    { icon: Calendar, label: "Upcoming", value: "3", gradient: "accent" },
  ];

  const upcomingSessions = [
    { student: "Amit Kumar", date: "Today, 4:00 PM", role: "Software Engineer", type: "Mock Interview" },
    { student: "Sneha Reddy", date: "Tomorrow, 10:00 AM", role: "Data Scientist", type: "Career Guidance" },
    { student: "Rahul Sharma", date: "Jan 27, 2:00 PM", role: "Product Manager", type: "Resume Review" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span><span className="text-[#ff9f1c]">ANSTA</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                Professional
              </span>
              <NotificationsDropdown />
              <SettingsDropdown 
                onSignOut={onSignOut} 
                userEmail={user?.email}
                userName={user?.user_metadata?.full_name}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome, <span className="text-gradient-accent">{userName}</span>! 💼
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your mentoring sessions and help students succeed.
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
                className="p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 group"
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

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Manage Profile Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg">
                <SettingsIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Manage Your Profile
                </h3>
                <p className="text-muted-foreground">
                  Update your skills, experience, and availability settings.
                </p>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              Edit Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Availability Card */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  Set Availability
                </h3>
                <p className="text-muted-foreground">
                  Configure your available time slots for student bookings.
                </p>
              </div>
            </div>
            <Button variant="hero" className="w-full">
              Manage Schedule
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Upcoming Sessions
          </h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{session.student}</p>
                    <p className="text-sm text-muted-foreground">{session.type} • {session.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{session.date}</p>
                  <Button variant="ghost" size="sm" className="text-accent">
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-sm text-accent">
            <strong>Note:</strong> To become a listed mentor, please complete your profile and wait for admin approval. 
            Once approved, students will be able to book sessions with you.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
