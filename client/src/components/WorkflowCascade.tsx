import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  DollarSign,
  Scale,
  Fingerprint,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: string;
  label: string;
  dept: string;
  icon: any;
  status: 'pending' | 'loading' | 'completed';
}

export const WorkflowCascade: React.FC<{ active?: boolean, onComplete?: () => void }> = ({ active = false, onComplete }) => {
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: 'AML-KYC-OFAC Check', dept: 'Compliance', icon: ShieldCheck, status: 'pending' },
    { id: '2', label: 'U4 Regulatory Standing', dept: 'HR', icon: UserCheck, status: 'pending' },
    { id: '3', label: 'Continuing Education', dept: 'HR', icon: Users, status: 'pending' },
    { id: '4', label: 'General Ledger Update', dept: 'Finance', icon: DollarSign, status: 'pending' },
    { id: '5', label: 'Books & Records Sync', dept: 'Finance', icon: Scale, status: 'pending' },
    { id: '6', label: 'Distributed Ledger Hash', dept: 'System', icon: Fingerprint, status: 'pending' },
  ]);

  useEffect(() => {
    if (!active) return;

    let currentStep = 0;
    const interval = setInterval(() => {
      setSteps(prev => prev.map((s, i) => {
        if (i < currentStep) return { ...s, status: 'completed' };
        if (i === currentStep) return { ...s, status: 'loading' };
        return s;
      }));

      currentStep++;
      if (currentStep > steps.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="space-y-3 py-4">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Cascading Workflow Execution</p>
      <div className="relative space-y-4">
        {steps.map((step, idx) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border transition-all duration-300",
              step.status === 'completed' ? "bg-green-50/50 border-green-100 shadow-sm" : 
              step.status === 'loading' ? "bg-blue-50/50 border-blue-100 animate-pulse" : 
              "bg-muted/20 border-border/50 opacity-50"
            )}
          >
            <div className={cn(
              "p-2 rounded-full",
              step.status === 'completed' ? "bg-green-100 text-green-600" : 
              step.status === 'loading' ? "bg-blue-100 text-blue-600" : 
              "bg-muted text-muted-foreground"
            )}>
              <step.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold">{step.label}</p>
                <span className="text-[9px] font-bold uppercase text-muted-foreground/60">{step.dept}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {step.status === 'completed' ? "Verified & Audited" : 
                 step.status === 'loading' ? "Processing cross-departmental check..." : 
                 "Awaiting trigger"}
              </p>
            </div>

            <div className="flex items-center">
              {step.status === 'completed' ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : step.status === 'loading' ? (
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
