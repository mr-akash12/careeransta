import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Settings, 
  User, 
  CreditCard, 
  HelpCircle, 
  Shield, 
  LogOut,
  Moon,
  Sun,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SettingsDropdownProps {
  onSignOut: () => void;
  userEmail?: string;
  userName?: string;
}

const SettingsDropdown = ({ onSignOut, userEmail, userName }: SettingsDropdownProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Profile settings will be available soon.",
    });
  };

  const handleBillingClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Billing and subscription management will be available soon.",
    });
  };

  const handleSecurityClick = () => {
    toast({
      title: "Coming Soon!",
      description: "Security settings will be available soon.",
    });
  };

  const handleHelpClick = () => {
    navigate("/contact");
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toast({
      title: darkMode ? "Light Mode" : "Dark Mode",
      description: `Theme switching will be available soon.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card border-border" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail || "user@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-muted"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-muted"
          onClick={handleBillingClick}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-muted"
          onClick={handleSecurityClick}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Security</span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center">
            {darkMode ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span className="text-sm">Dark Mode</span>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={handleDarkModeToggle}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="cursor-pointer focus:bg-muted"
          onClick={handleHelpClick}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border" />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
