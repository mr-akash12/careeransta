import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#hired", label: "Get Hired" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
  ];

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === "/") {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[500] h-[70px] glass">
      <nav className="h-full px-6 lg:px-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="CareerANSTA" className="h-10 object-contain" />
          <span className="font-display text-[19px] font-black tracking-tight">
            <span className="text-foreground">Career</span>
            <span className="text-primary">ANSTA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <button className="text-[13px] text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none">
              Sign in
            </button>
          </Link>
          <Link to="/signup">
            <button className="font-display text-[10px] font-bold tracking-wider text-primary-foreground bg-primary px-5 py-2.5 rounded-full hover:brightness-110 hover:-translate-y-px transition-all">
              Get Started Free
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border p-6 space-y-4 animate-slide-down">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-sm text-muted-foreground hover:text-primary py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="w-full text-sm text-foreground border border-border rounded-full py-3 hover:border-primary/50 transition-colors">
                Sign In
              </button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <button className="w-full font-display text-[10px] font-bold tracking-wider text-primary-foreground bg-primary rounded-full py-3">
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
