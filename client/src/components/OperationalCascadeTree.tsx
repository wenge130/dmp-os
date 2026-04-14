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
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeStatus = "pending" | "processing" | "completed";

interface TreeNode {
  id: string;
  label: string;
  subLabel: string;
  icon: any;
  status: NodeStatus;
  children?: TreeNode[];
  isExpanded?: boolean;
}

export default function OperationalCascadeTree() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(-1);

  const [tree, setTree] = useState<TreeNode>({
    id: "root",
    label: "Document Commit",
    subLabel: "884-POL-TRD",
    icon: FileText,
    status: "completed",
    isExpanded: true,
    children: [
      {
        id: "archive",
        label: "Archive & Records",
        subLabel: "SEC 17a-4 Vault",
        icon: Archive,
        status: "completed",
        isExpanded: true,
        children: [
          {
            id: "ledger",
            label: "Digital Ledger",
            subLabel: "Fingerprinted",
            icon: Fingerprint,
            status: "completed",
          }
        ]
      },
      {
        id: "compliance",
        label: "Compliance Sync",
        subLabel: "Manual v1.2.4",
        icon: ShieldCheck,
        status: "completed",
        isExpanded: true,
        children: [
          {
            id: "hr",
            label: "HR Standing",
            subLabel: "U4/CE Check",
            icon: Users,
            status: "completed",
          },
          {
            id: "finance",
            label: "FINOP Ledger",
            subLabel: "Capital Update",
            icon: Activity,
            status: "completed",
          }
        ]
      }
    ]
  });

  const triggerSync = () => {
    setIsRunning(true);
    setCurrentLevel(0);
    
    const resetStatus = (node: TreeNode): TreeNode => ({
      ...node,
      status: "pending",
      children: node.children?.map(resetStatus)
    });
    setTree(resetStatus(tree));
  };

  useEffect(() => {
    if (!isRunning) return;

    const updateStatusAtLevel = (node: TreeNode, targetLevel: number, current: number, status: NodeStatus): TreeNode => {
      if (current === targetLevel) {
        return { ...node, status };
      }
      return {
        ...node,
        children: node.children?.map(child => updateStatusAtLevel(child, targetLevel, current + 1, status))
      };
    };

    const processLevel = async (level: number) => {
      // Start processing
      setTree(prev => updateStatusAtLevel(prev, level, 0, "processing"));
      await new Promise(r => setTimeout(r, 1000));
      // Complete level
      setTree(prev => updateStatusAtLevel(prev, level, 0, "completed"));
      
      if (level < 2) {
        setCurrentLevel(level + 1);
      } else {
        setIsRunning(false);
      }
    };

    processLevel(currentLevel);
  }, [isRunning, currentLevel]);

  const renderNode = (node: TreeNode, isLast = false, level = 0) => {
    return (
      <div key={node.id} className="flex flex-col">
        <div className="flex items-center group relative">
          {/* Connector Line from parent */}
          {level > 0 && (
            <div className="w-6 h-px bg-muted-foreground/20 shrink-0 relative">
              {node.status === "completed" && (
                <div className="absolute inset-0 bg-primary animate-in slide-in-from-left duration-500" />
              )}
            </div>
          )}

          {/* Node Card */}
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg border transition-all duration-300 min-w-[160px] shadow-sm",
            node.status === "completed" ? "bg-white border-primary/20 shadow-primary/5" : 
            node.status === "processing" ? "bg-primary/5 border-primary animate-pulse" : 
            "bg-white border-border opacity-40"
          )}>
            <div className={cn(
              "w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
              node.status === "completed" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
            )}>
              {node.status === "completed" ? <Check className="h-4 w-4" /> : <node.icon className="h-4 w-4" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold truncate leading-none">{node.label}</span>
              <span className="text-[8px] text-muted-foreground mt-1 uppercase tracking-tighter font-medium truncate">{node.subLabel}</span>
            </div>
            {node.children && (
              <div className="ml-auto pl-2">
                {node.isExpanded ? <Minus className="h-3 w-3 text-muted-foreground/40" /> : <Plus className="h-3 w-3 text-primary" />}
              </div>
            )}
          </div>
        </div>

        {/* Children Container */}
        {node.children && node.isExpanded && (
          <div className="flex flex-col ml-[23px] border-l border-muted-foreground/10 mt-2 gap-4 pb-2 pl-6">
            {node.children.map((child, idx) => renderNode(child, idx === node.children!.length - 1, level + 1))}
          </div>
        )}
      </div>
    );
  };

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

      {/* Harvey Style Tree Area */}
      <div className="flex-1 overflow-auto p-4 scrollbar-hide">
        <div className="min-w-max py-4">
          {renderNode(tree)}
        </div>
      </div>

      {/* Bottom Audit Footer */}
      <div className="p-4 border-t border-border bg-[#FBFBFB] space-y-3">
        <div className="p-2 rounded bg-white border border-border shadow-sm flex items-center gap-3">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center shrink-0">
            <Fingerprint className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none">DMP OS Ledger</span>
            <span className="text-[8px] text-muted-foreground font-mono mt-1">0x7d8a...f2e9</span>
          </div>
        </div>
      </div>
    </div>
  );
}
