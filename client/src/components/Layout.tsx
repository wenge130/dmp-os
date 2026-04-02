import { Link, useLocation } from "wouter";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Platform", path: "/platform" },
    { name: "Solutions", path: "/solutions" },
    { 
      name: "Services", 
      path: "/services",
      dropdown: [
        { name: "Professional Services", path: "/services" }
      ]
    },
    { name: "Company", path: "/company" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container flex h-20 items-center justify-between relative">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group z-10 relative">
              <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight uppercase">
                DMP<span className="text-primary">.</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link href={link.path}>
                  <span
                    className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer flex items-center gap-1 py-4 ${
                      location === link.path ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {link.dropdown.map((dropItem) => (
                      <Link key={dropItem.name} href={dropItem.path}>
                        <span className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 cursor-pointer transition-colors">
                          {dropItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button - Right */}
          <div className="hidden md:block z-10 relative">
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 uppercase tracking-wider rounded-none">
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <span
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${
                    location === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/contact">
                <Button 
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight uppercase">
                  DMP<span className="text-primary">.</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                The AI-Native Regulatory, Supervisory, and Governance Platform. Transforming static manuals into a living, breathing governance system.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/platform"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">CNS Engine</span></Link></li>
                <li><Link href="/platform"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Regulatory Data Feed</span></Link></li>
                <li><Link href="/platform"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Master Reconciliation</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">

                <li><Link href="/services"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Services</span></Link></li>
                <li><Link href="/company"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">About Us</span></Link></li>
                <li><Link href="/contact"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Contact</span></Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DMP Technologies. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
