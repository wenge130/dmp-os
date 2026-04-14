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
  Zap,
  RefreshCcw,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeStatus = "pending" | "processing" | "completed";

interface Node {
  id: string;
  label: string;
  subLabel: string;
  icon: any;
  status: NodeStatus;
  department: string;
}

export default function OperationalCascadeDiagram() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", label: "Document Commit", subLabel: "884-POL-TRD", icon: FileText, status: "completed", department: "Compliance" },
    { id: "2", label: "SEC 17a-4 Archive", subLabel: "Immutable Vault", icon: Archive, status: "completed", department: "Books & Records" },
    { id: "3", label: "Compliance Sync", subLabel: "Manual v1.2.4", icon: ShieldCheck, status: "completed", department: "Compliance" },
    { id: "4", label: "HR Standing", subLabel: "U4/CE Check", icon: Users, status: "completed", department: "HR" },
    { id: "5", label: "FINOP Ledger", subLabel: "Capital Update", icon: Activity, status: "completed", department: "Finance" },
    { id: "6", label: "Digital Ledger", subLabel: "Fingerprinted", icon: Fingerprint, status: "completed", department: "System" }
  ]);

  const triggerSync = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setNodes(n => n.map(node => ({ ...node, status: "pending" })));
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex >= nodes.length) {
      if (currentStepIndex >= nodes.length) setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setNodes(prev => {
        const newNodes = [...prev];
        newNodes[currentStepIndex].status = "processing";
        return newNodes;
      });

      const completeTimer = setTimeout(() => {
        setNodes(prev => {
          const newNodes = [...prev];
          newNodes[currentStepIndex].status = "completed";
          return newNodes;
        });
        setCurrentStepIndex(prev => prev + 1);
      }, 1000);

      return () => clearTimeout(completeTimer);
    }, 300);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, nodes.length]);

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
      <div className="p-4 border-b border-border bg-white space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
          <Badge variant="outline" className={cn(
            "text-[9px] uppercase font-bold px-1.5 h-4 border-none",
            isRunning ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
          )}>
            {isRunning ? "Propagating..." : "Good Order"}
          </Badge>
        </div>
      </div>

      {/* Workflow Diagram Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-0 scrollbar-hide relative">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            {/* Node Item */}
            <div className="relative flex flex-col items-center group">
              {/* Node Circle */}
              <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 shadow-sm",
                node.status === "completed" ? "bg-green-500 border-green-500 text-white" : 
                node.status === "processing" ? "bg-white border-primary text-primary animate-pulse ring-4 ring-primary/10" : 
                "bg-white border-muted-foreground/20 text-muted-foreground"
              )}>
                {node.status === "completed" ? <Check className="h-6 w-6" /> : <node.icon className="h-5 w-5" />}
              </div>

              {/* Node Label Card */}
              <div className={cn(
                "mt-2 text-center transition-all duration-500",
                node.status === "pending" && "opacity-40"
              )}>
                <p className="text-[11px] font-bold leading-none">{node.label}</p>
                <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-tighter font-medium">{node.subLabel}</p>
              </div>

              {/* Connector Line (except for last node) */}
              {idx < nodes.length - 1 && (
                <div className="h-10 w-0.5 relative my-1">
                  {/* Background Line */}
                  <div className="absolute inset-0 bg-muted-foreground/10" />
                  
                  {/* Animated Progress Line */}
                  <div 
                    className={cn(
                      "absolute top-0 left-0 w-full bg-primary transition-all duration-1000 ease-in-out",
                      node.status === "completed" ? "h-full" : "h-0"
                    )} 
                  />
                  
                  {/* Arrowhead */}
                  {node.status === "completed" && (
                    <div className="absolute -bottom-1 -left-[3px] animate-in fade-in duration-300">
                      <div className="w-2 h-2 border-r-2 border-b-2 border-primary rotate-45" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Audit Footer */}
      <div className="p-4 border-t border-border bg-[#FBFBFB] space-y-3">
        <div className="p-2 rounded bg-white border border-border shadow-sm flex items-center gap-3">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center shrink-0">
            <Fingerprint className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none">Immutable Hash</span>
            <span className="text-[8px] text-muted-foreground font-mono mt-1">0x7d8a...f2e9</span>
          </div>
        </div>
      </div>
    </div>
  );
}
