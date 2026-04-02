import { Link } from "wouter";
import { LayoutDashboard, FileText, GitBranch, Settings, LogOut, FileCheck, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                <span className="text-lg font-bold text-accent">D</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">DMP Technologies</p>
                <p className="text-xs text-muted-foreground">CNS Platform</p>
              </div>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-1">
            <Link href="/">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors text-foreground text-sm font-medium cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                Core Manuals
              </div>
            </Link>
            <Link href="/wsp">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors text-foreground text-sm font-medium cursor-pointer">
                <FileText className="w-4 h-4" />
                WSP
              </div>
            </Link>
            <Link href="/workflows">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors text-foreground text-sm font-medium cursor-pointer">
                <GitBranch className="w-4 h-4" />
                Trading & Execution
              </div>
            </Link>
            <Link href="/reporting">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors text-foreground text-sm font-medium cursor-pointer">
                <FileCheck className="w-4 h-4" />
                Regulatory Reporting
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button size="sm" variant="ghost" className="text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button size="sm" variant="ghost" className="text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={toggleTheme}
      className="text-foreground hover:bg-secondary/50"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  );
}
