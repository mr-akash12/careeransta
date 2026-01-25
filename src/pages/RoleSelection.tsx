import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const RoleSelection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, role, setUserRole, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // If user already has a role, redirect to dashboard
    if (!authLoading && role) {
      navigate("/dashboard");
    }
    // If no user, redirect to login
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, role, authLoading, navigate]);

  const handleRoleSelect = async (selectedRole: "student" | "professional") => {
    setIsLoading(true);
    
    const { error } = await setUserRole(selectedRole);
    
    if (error) {
      toast({
        title: "Failed to set role",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Welcome!",
        description: `You're all set as a ${selectedRole}!`,
      });
      navigate("/dashboard");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div className="bg-card border border-border rounded-2xl shadow-large p-8 animate-scale-in">
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
            <span className="font-display text-2xl font-extrabold tracking-wide">
              <span className="text-white">Career</span><span className="text-[#ff9f1c]">ANSTA</span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Choose your role
            </h1>
            <p className="text-muted-foreground">
              How will you be using CareerANSTA?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelect("student")}
              disabled={isLoading}
              className="w-full p-6 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-secondary/50 transition-all duration-200 text-left group disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    I'm a Student
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Practice interviews, prepare for exams, and get career guidance
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("professional")}
              disabled={isLoading}
              className="w-full p-6 rounded-xl border-2 border-border hover:border-accent bg-card hover:bg-accent/5 transition-all duration-200 text-left group disabled:opacity-50"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    I'm a Professional
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mentor students, conduct mock interviews, and earn side income
                  </p>
                </div>
              </div>
            </button>
          </div>

          {isLoading && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Setting up your account...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
