import React, { useState, useEffect } from "react";
import { 
  Workflow, 
  ShieldCheck, 
  Users, 
  Archive, 
  Fingerprint, 
  Check, 
  Activity,
  FileText,
  Clock,
  RefreshCcw,
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "processing" | "completed";

interface Step {
  id: string;
  label: string;
  desc: string;
  icon: any;
  status: StepStatus;
  department: string;
}

export default function OperationalCascadeSidebar() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const [steps, setSteps] = useState<Step[]>([
    { id: "1", label: "Document Commit", desc: "Compliance", icon: FileText, status: "completed", department: "Compliance" },
    { id: "2", label: "Archive & Records", desc: "SEC 17a-4 Vault", icon: Archive, status: "completed", department: "Books & Records" },
    { id: "3", label: "Compliance Sync", desc: "Manual v1.2.4", icon: ShieldCheck, status: "completed", department: "Compliance" },
    { id: "4", label: "HR Standing", desc: "U4/CE Check", icon: Users, status: "completed", department: "HR" },
    { id: "5", label: "FINOP Ledger", desc: "Capital Update", icon: Activity, status: "completed", department: "Finance" },
    { id: "6", label: "Digital Ledger", desc: "Fingerprinted", icon: Fingerprint, status: "completed", department: "System" }
  ]);

  const triggerSync = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setSteps(s => s.map(step => ({ ...step, status: "pending" })));
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex >= steps.length) {
      if (currentStepIndex >= steps.length) setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[currentStepIndex].status = "processing";
        return newSteps;
      });

      const completeTimer = setTimeout(() => {
        setSteps(prev => {
          const newSteps = [...prev];
          newSteps[currentStepIndex].status = "completed";
          return newSteps;
        });
        setCurrentStepIndex(prev => prev + 1);
      }, 800);

      return () => clearTimeout(completeTimer);
    }, 200);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, steps.length]);

  return (
    <div className="h-full flex flex-col bg-white border-l border-border animate-in slide-in-from-right duration-500 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border bg-[#FBFBFB] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-widest">Operational Cascade</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={triggerSync}
          disabled={isRunning}
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", isRunning && "animate-spin")} />
        </Button>
      </div>

      {/* Sync Status Summary */}
      <div className="p-4 border-b border-border bg-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
          <Badge variant="outline" className={cn(
            "text-[9px] uppercase font-bold px-1.5 h-4 border-none",
            isRunning ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
          )}>
            {isRunning ? "Synchronizing..." : "Good Order"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-muted-foreground">
            {steps.filter(s => s.status === 'completed').length}/{steps.length}
          </span>
        </div>
      </div>

      {/* Checklist Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={cn(
              "flex items-start gap-3 transition-all duration-300",
              step.status === "pending" && "opacity-40 grayscale",
              step.status === "processing" && "scale-[1.02]"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300",
              step.status === "completed" ? "bg-green-500 border-green-500 text-white shadow-sm shadow-green-100" : 
              step.status === "processing" ? "bg-white border-primary text-primary animate-pulse ring-2 ring-primary/20" : 
              "bg-white border-muted-foreground/20 text-muted-foreground"
            )}>
              {step.status === "completed" ? <Check className="h-4 w-4" /> : <step.icon className="h-3.5 w-3.5" />}
            </div>

            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold truncate">{step.label}</span>
                {step.status === "completed" && (
                  <span className="text-[8px] font-mono text-muted-foreground/50">0x7d...e9</span>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-tight font-medium">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Audit Footer */}
      <div className="p-4 border-t border-border bg-[#FBFBFB] space-y-3">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-muted-foreground">Last Ledger Commit</span>
          <span className="font-mono text-muted-foreground/60">17:08:22</span>
        </div>
        <div className="p-2 rounded bg-white border border-border shadow-sm flex items-center gap-3">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center shrink-0">
            <Zap className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary">AI Sync Enabled</span>
            <span className="text-[8px] text-muted-foreground leading-none">Real-time propagation active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
