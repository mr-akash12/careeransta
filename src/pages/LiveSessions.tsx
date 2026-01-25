import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ArrowLeft,
  Sparkles,
  Star,
  Clock,
  IndianRupee
} from "lucide-react";

const professionals = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Software Engineer",
    company: "Google",
    experience: "8 years",
    rating: 4.9,
    reviews: 124,
    price: 500,
    skills: ["System Design", "DSA", "React"],
    avatar: "PS",
    available: true,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Data Scientist",
    company: "Amazon",
    experience: "6 years",
    rating: 4.8,
    reviews: 89,
    price: 600,
    skills: ["ML", "Python", "Statistics"],
    avatar: "RM",
    available: true,
  },
  {
    id: 3,
    name: "Anjali Gupta",
    role: "Product Manager",
    company: "Microsoft",
    experience: "10 years",
    rating: 4.9,
    reviews: 156,
    price: 800,
    skills: ["Product Strategy", "Agile", "Leadership"],
    avatar: "AG",
    available: false,
  },
];

const LiveSessions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                CareerANSTA
              </span>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent mb-4">
            <Users className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Book Live Sessions
          </h1>
          <p className="text-muted-foreground">
            Connect with industry professionals for 1-on-1 mock interviews and career guidance
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button variant="outline" size="sm">All Roles</Button>
          <Button variant="outline" size="sm">Software Engineer</Button>
          <Button variant="outline" size="sm">Data Scientist</Button>
          <Button variant="outline" size="sm">Product Manager</Button>
        </div>

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-large transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                  {pro.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">
                    {pro.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{pro.role}</p>
                  <p className="text-xs text-muted-foreground">{pro.company}</p>
                </div>
                {pro.available && (
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                    Available
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="font-medium">{pro.rating}</span>
                  <span className="text-muted-foreground">({pro.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{pro.experience}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pro.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-foreground" />
                  <span className="font-display text-xl font-bold text-foreground">
                    {pro.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/session</span>
                </div>
                <Button variant="default" size="sm" disabled={!pro.available}>
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Payment integration coming soon. Booking will be enabled after Razorpay setup.
        </p>
      </main>
    </div>
  );
};

export default LiveSessions;
