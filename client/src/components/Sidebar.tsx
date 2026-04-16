import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCheck,
  Settings,
  Fingerprint,
  ShieldCheck,
  TrendingUp,
  Server,
  BarChart3,
  ArrowRightLeft,
  FileJson,
  DollarSign,
  ShieldAlert,
  Archive,
  Layers,
  BarChart,
  BrainCircuit,
  Workflow,
  GitBranch
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const NavItem = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => (
    <Link href={href}>
      <a className={cn(
        "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200",
        active 
          ? "bg-foreground text-background shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}>
        <Icon className={cn("h-4 w-4", active ? "text-background" : "text-muted-foreground")} />
        {label}
      </a>
    </Link>
  );

  return (
    <div className="w-64 border-r border-border bg-[#FBFBFB] flex flex-col h-screen shrink-0 overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border/50 bg-white">
        <Link href="/">
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
              <span className="text-background text-[10px] font-bold italic">D</span>
            </div>
            <span className="font-bold tracking-tight text-sm">DMP OS</span>
          </a>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-hide">
        {/* Core Operating System */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Operating System</p>
          <NavItem href="/" icon={LayoutDashboard} label="Command Center" active={isActive("/")} />
          <NavItem href="/operational-cascade" icon={Workflow} label="Operational Cascade" active={isActive("/operational-cascade")} />
          <NavItem href="/ledger" icon={Fingerprint} label="Digital Ledger" active={isActive("/ledger")} />
        </div>

        {/* Business Intelligence & Analytics */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Business Intelligence & Analytics</p>
          <NavItem href="/606-dashboard" icon={BarChart3} label="SEC Rule 606 Dashboard" active={isActive("/606-dashboard")} />
          <NavItem href="/analytics" icon={BarChart} label="Operational Analytics" active={isActive("/analytics")} />
        </div>

        {/* Financial Operations */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Financial Operations</p>
          <NavItem href="/net-capital" icon={DollarSign} label="Net Capital (FINOP)" active={isActive("/net-capital")} />
          <NavItem href="/reconciliation" icon={ArrowRightLeft} label="Reconciliation" active={isActive("/reconciliation")} />
        </div>

        {/* Brokerage Operations */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Brokerage Operations</p>
          <NavItem href="/brokerage-ops" icon={Layers} label="Operations Center" active={isActive("/brokerage-ops")} />
          <NavItem href="/cat-reporting" icon={FileJson} label="CAT Reporting" active={isActive("/cat-reporting")} />
        </div>

        {/* Risk Mgmt */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Risk Management</p>
          <NavItem href="/risk-mgmt" icon={ShieldAlert} label="Risk Dashboard" active={isActive("/risk-mgmt")} />
          <NavItem href="/mag" icon={ShieldAlert} label="Market Access (MAG)" active={isActive("/mag")} />
        </div>

        {/* Trading & Execution */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Trading & Execution</p>
          <NavItem href="/workflows" icon={TrendingUp} label="Surveillance" active={isActive("/workflows")} />
        </div>

        {/* Regulatory & Compliance */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Regulatory & Compliance</p>
          <NavItem href="/compliance-analyzer" icon={BrainCircuit} label="Compliance Analyzer" active={isActive("/compliance-analyzer")} />
          <NavItem href="/wsp" icon={ShieldCheck} label="WSP Management" active={isActive("/wsp")} />
          <NavItem href="/pdt-lifecycle" icon={GitBranch} label="Rule Lifecycle Tracker" active={isActive("/pdt-lifecycle")} />
          <NavItem href="/reporting" icon={FileCheck} label="Regulatory Reporting" active={isActive("/reporting")} />
        </div>

        {/* Books & Records */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Books & Records</p>
          <NavItem href="/books-records" icon={Archive} label="Archive & Records" active={isActive("/books-records")} />
        </div>

        {/* Infrastructure */}
        <div>
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Infrastructure</p>
          <NavItem href="/tech" icon={Server} label="Technology Status" active={isActive("/tech")} />
        </div>
      </div>

      <div className="p-3 border-t border-border/50 bg-white">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center border border-border group-hover:border-foreground/20 transition-colors font-bold text-[10px]">
              WG
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold leading-none">@Wen</span>
              <span className="text-[9px] text-muted-foreground mt-0.5">Principal Operator</span>
            </div>
          </div>
          <Settings className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </div>
  );
}
