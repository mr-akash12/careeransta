import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 lg:px-14 pt-16 pb-10 relative z-[1]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 mb-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-3">
            <img src={logo} alt="CareerANSTA" className="h-8 object-contain" />
            <span className="font-display text-[15px] font-black">
              <span className="text-foreground">Career</span>
              <span className="text-primary">ANSTA</span>
            </span>
          </Link>
          <p className="text-[13px] text-muted-foreground max-w-[220px] leading-relaxed">
            AI-powered career acceleration for the next generation of professionals.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-display text-[10px] font-bold tracking-wider text-foreground mb-4">Product</h4>
          <ul className="space-y-2.5">
            {["AI Resume", "Mock Interviews", "Mock Tests", "Smart Notes"].map((l) => (
              <li key={l}>
                <a href="#" className="text-[13px] text-muted-foreground hover:text-primary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-display text-[10px] font-bold tracking-wider text-foreground mb-4">Company</h4>
          <ul className="space-y-2.5">
            {[
              { label: "About", href: "/about" },
              { label: "Blog", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.label}>
                {l.href.startsWith("/") ? (
                  <Link to={l.href} className="text-[13px] text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                ) : (
                  <a href={l.href} className="text-[13px] text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display text-[10px] font-bold tracking-wider text-foreground mb-4">Legal</h4>
          <ul className="space-y-2.5">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map((l) => (
              <li key={l}>
                <a href="#" className="text-[13px] text-muted-foreground hover:text-primary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-border pt-7 gap-4">
        <div className="text-[11px] text-muted-foreground">© 2026 CareerANSTA. All rights reserved.</div>
        <div className="flex gap-2.5">
          {["X", "in", "ig"].map((s) => (
            <a
              key={s}
              href="#"
              className="w-[34px] h-[34px] rounded-lg border border-border flex items-center justify-center text-xs text-muted-foreground hover:border-primary hover:text-primary transition-all"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
