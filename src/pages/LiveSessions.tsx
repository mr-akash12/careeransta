import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  ArrowLeft,
  Star,
  Clock,
  IndianRupee,
  SlidersHorizontal,
  X,
  Search,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BookingDialog from "@/components/live-sessions/BookingDialog";
import logo from "@/assets/logo.png";

interface Professional {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  skills: string[];
  avatar: string;
  available: boolean;
}

const roles = ["All Roles", "Senior Software Engineer", "Data Scientist", "Product Manager"];
const priceRanges = [
  { label: "All Prices", min: 0, max: 10000 },
  { label: "₹300 - ₹500", min: 300, max: 500 },
  { label: "₹500 - ₹700", min: 500, max: 700 },
  { label: "₹700 - ₹1000", min: 700, max: 1000 },
];
const ratingOptions = [
  { label: "All Ratings", value: 0 },
  { label: "4.5+ ⭐", value: 4.5 },
  { label: "4.7+ ⭐", value: 4.7 },
  { label: "4.9+ ⭐", value: 4.9 },
];

const LiveSessions = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Filter states
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch professionals from database
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const { data, error } = await supabase
          .from("professionals")
          .select("*")
          .eq("available", true)
          .order("rating", { ascending: false });

        if (error) throw error;

        setProfessionals(data.map(pro => ({
          id: pro.id,
          name: pro.name,
          role: pro.role,
          company: pro.company,
          experience: pro.experience,
          rating: Number(pro.rating),
          reviews: pro.reviews,
          price: pro.price,
          skills: pro.skills || [],
          avatar: pro.avatar || pro.name.split(' ').map(n => n[0]).join(''),
          available: pro.available,
        })));
      } catch (error) {
        console.error("Error fetching professionals:", error);
        toast({
          title: "Error loading professionals",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, [toast]);

  const handleBookNow = (professional: Professional) => {
    setSelectedProfessional(professional);
    setBookingDialogOpen(true);
  };

  const clearFilters = () => {
    setSelectedRole("All Roles");
    setSelectedPriceRange(priceRanges[0]);
    setSelectedRating(0);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedRole !== "All Roles" || selectedPriceRange.label !== "All Prices" || selectedRating > 0 || searchQuery.trim() !== "";

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((pro) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = pro.name.toLowerCase().includes(query);
        const matchesSkills = pro.skills.some(skill => skill.toLowerCase().includes(query));
        const matchesRole = pro.role.toLowerCase().includes(query);
        const matchesCompany = pro.company.toLowerCase().includes(query);
        if (!matchesName && !matchesSkills && !matchesRole && !matchesCompany) {
          return false;
        }
      }
      // Role filter
      if (selectedRole !== "All Roles" && pro.role !== selectedRole) {
        return false;
      }
      // Price filter
      if (pro.price < selectedPriceRange.min || pro.price > selectedPriceRange.max) {
        return false;
      }
      // Rating filter
      if (pro.rating < selectedRating) {
        return false;
      }
      return true;
    });
  }, [professionals, selectedRole, selectedPriceRange, selectedRating, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
              <span className="font-display text-2xl font-extrabold tracking-wide">
                <span className="text-white">Career</span><span className="text-[#ff9f1c]">ANSTA</span>
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

        {/* Search Bar */}
        <div className="max-w-5xl mx-auto mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, skills, role, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 h-12 bg-card border-border rounded-xl text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="max-w-5xl mx-auto mb-8">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
                {/* Role Filter */}
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Price Range</label>
                  <Select
                    value={selectedPriceRange.label}
                    onValueChange={(val) => {
                      const range = priceRanges.find((r) => r.label === val);
                      if (range) setSelectedPriceRange(range);
                    }}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select price" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {priceRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Minimum Rating</label>
                  <Select
                    value={selectedRating.toString()}
                    onValueChange={(val) => setSelectedRating(parseFloat(val))}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border z-50">
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters - Desktop */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="hidden md:flex text-muted-foreground whitespace-nowrap"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery.trim() && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        "{searchQuery}"
                      </span>
                    )}
                    {selectedRole !== "All Roles" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {selectedRole}
                      </span>
                    )}
                    {selectedPriceRange.label !== "All Prices" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {selectedPriceRange.label}
                      </span>
                    )}
                    {selectedRating > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {selectedRating}+ Rating
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Showing {filteredProfessionals.length} of {professionals.length} professionals
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading professionals...</p>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filteredProfessionals.map((pro) => (
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
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleBookNow(pro)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              No professionals found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground mt-8">
          Payment integration coming soon. Booking will be enabled after Razorpay setup.
        </p>
      </main>

      {/* Booking Dialog */}
      <BookingDialog
        professional={selectedProfessional}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
      />
    </div>
  );
};

export default LiveSessions;
