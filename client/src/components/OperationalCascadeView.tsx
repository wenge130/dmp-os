import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Scale, 
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  UserCheck,
  Sparkles,
  Zap,
  Gavel,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status: "pending" | "active" | "completed";
}

const WorkflowNode = ({ title, subtitle, icon, status }: NodeProps) => (
  <motion.div 
    layout
    className={`
      relative z-10 px-6 py-4 rounded-xl border text-center transition-all duration-500
      ${status === "completed" 
        ? "bg-white border-green-200 shadow-md ring-1 ring-green-100/50" 
        : status === "active"
          ? "bg-white border-blue-400 shadow-lg ring-2 ring-blue-100 scale-105"
          : "bg-slate-50/50 border-slate-100 opacity-40"}
      min-w-[220px] max-w-[280px]
    `}
  >
    <div className="flex flex-col items-center gap-2">
      <div className={`mb-1 transition-colors duration-500 ${
        status === "completed" ? "text-green-500" : status === "active" ? "text-blue-600" : "text-slate-400"
      }`}>
        {status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : icon}
      </div>
      <span className={`text-sm font-bold tracking-tight leading-tight transition-colors duration-500 ${
        status === "active" ? "text-slate-900" : "text-slate-600 uppercase"
      }`}>
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] text-slate-400 font-medium leading-tight uppercase tracking-tighter">
          {subtitle}
        </span>
      )}
    </div>
    {status === "active" && (
      <motion.div 
        layoutId="glow"
        className="absolute inset-0 rounded-xl bg-blue-400/5 animate-pulse pointer-events-none"
      />
    )}
  </motion.div>
);

const Connector = ({ type = "vertical", height = 40, active = false }: { type?: "vertical" | "fork" | "merge", height?: number, active?: boolean }) => {
  if (type === "vertical") {
    return (
      <div className="flex justify-center w-full" style={{ height }}>
        <div className={`w-[1px] h-full relative transition-colors duration-500 ${active ? "bg-blue-400" : "bg-slate-200"}`}>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-r rotate-45 transition-colors duration-500 ${active ? "border-blue-400" : "border-slate-300"}`} />
        </div>
      </div>
    );
  }

  const strokeColor = active ? "#60a5fa" : "#e2e8f0";
  const strokeWidth = active ? "2" : "1";

  if (type === "fork") {
    return (
      <div className="relative w-full h-[60px] flex justify-center">
        <svg viewBox="0 0 100 60" width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <path d="M 50 0 L 50 20 Q 50 30 35 30 L 15 30 Q 5 30 5 40 L 5 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
          <path d="M 50 0 L 50 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
          <path d="M 50 0 L 50 20 Q 50 30 65 30 L 85 30 Q 95 30 95 40 L 95 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
        </svg>
      </div>
    );
  }

  if (type === "merge") {
    return (
      <div className="relative w-full h-[60px] flex justify-center">
        <svg viewBox="0 0 100 60" width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <path d="M 5 0 L 5 20 Q 5 30 15 30 L 35 30 Q 50 30 50 40 L 50 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
          <path d="M 50 0 L 50 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
          <path d="M 95 0 L 95 20 Q 95 30 85 30 L 65 30 Q 50 30 50 40 L 50 60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} className="transition-all duration-500" />
        </svg>
      </div>
    );
  }

  return null;
};

export default function OperationalCascadeView() {
  const [isPropagating, setIsPropagating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const stages = [
    "execution", // 0
    "review",    // 1
    "accounts",  // 2
    "standing",  // 3
    "departments",// 4
    "legal",     // 5
    "audit",     // 6
    "ledger",    // 7
    "complete"   // 8
  ];

  const triggerCascade = () => {
    if (isPropagating) return;
    setIsPropagating(true);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (!isPropagating) return;
    if (currentStage >= stages.length) {
      setIsPropagating(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPropagating, currentStage]);

  // Auto-scroll logic
  useEffect(() => {
    if (isPropagating && scrollRef.current) {
      const activeNode = scrollRef.current.querySelector(`[data-stage="${currentStage}"]`);
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStage, isPropagating]);

  const getStatus = (index: number) => {
    if (currentStage > index) return "completed";
    if (currentStage === index) return "active";
    return "pending";
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] font-sans overflow-hidden">
      <div className="shrink-0 p-8 max-w-6xl mx-auto w-full flex justify-between items-end border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operational Cascade</h1>
          <p className="text-slate-500 mt-2">Dynamic cross-departmental verification & propagation.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={triggerCascade} 
            disabled={isPropagating}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 gap-2 shadow-lg"
          >
            {isPropagating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isPropagating ? "Propagating..." : "Trigger New Cascade"}
          </Button>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isPropagating ? "bg-blue-500 animate-pulse" : "bg-green-500"}`} />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              {isPropagating ? "Processing" : "System Ready"}
            </span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 pb-48">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* Stage 0: Execution */}
          <div data-stage="0">
            <WorkflowNode 
              id="order" 
              title="Trade Execution" 
              subtitle="Order Type #1 (RCB)" 
              icon={<Zap className="w-5 h-5" />}
              status={getStatus(0)} 
            />
          </div>
          
          <Connector height={40} active={currentStage > 0} />
          
          {/* Stage 1: Review */}
          <div data-stage="1">
            <WorkflowNode 
              id="supervisor" 
              title="Supervisory Review" 
              subtitle="Digital Signature Applied" 
              icon={<ShieldCheck className="w-5 h-5" />}
              status={getStatus(1)}
            />
          </div>
          
          <Connector type="fork" active={currentStage > 1} />
          
          {/* Stage 2: Accounts */}
          <div data-stage="2" className="flex justify-between w-full max-w-5xl gap-4">
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="acct1" title="ACCT DOC #1" subtitle="AML-KYC-OFAC" icon={<Database className="w-5 h-5" />} status={getStatus(2)} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="acct2" title="ACCT DOC #2" subtitle="AML-KYC-OFAC" icon={<Database className="w-5 h-5" />} status={getStatus(2)} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="acct3" title="ACCT DOC #3" subtitle="AML-KYC-OFAC" icon={<Database className="w-5 h-5" />} status={getStatus(2)} />
            </div>
          </div>
          
          <Connector type="merge" active={currentStage > 2} />
          
          {/* Stage 3: Standing */}
          <div data-stage="3">
            <WorkflowNode 
              id="employee" 
              title="Regulatory Standing" 
              subtitle="U4 / CE / Digital Signatures" 
              icon={<UserCheck className="w-5 h-5" />}
              status={getStatus(3)}
            />
          </div>
          
          <Connector type="fork" active={currentStage > 3} />
          
          {/* Stage 4: Departments */}
          <div data-stage="4" className="flex justify-between w-full max-w-5xl gap-4">
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="hr" title="Human Resources" subtitle="Employee A/B/C" icon={<Users className="w-5 h-5" />} status={getStatus(4)} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="finance" title="Finance" subtitle="General Ledger" icon={<CreditCard className="w-5 h-5" />} status={getStatus(4)} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode id="compliance" title="Compliance" subtitle="FINRA / SEC Sync" icon={<ShieldCheck className="w-5 h-5" />} status={getStatus(4)} />
            </div>
          </div>
          
          <Connector type="merge" active={currentStage > 4} />
          
          {/* Stage 5: Legal */}
          <div data-stage="5">
            <WorkflowNode 
              id="legal" 
              title="Legal Verification" 
              subtitle="Rulebook Alignment" 
              icon={<Gavel className="w-5 h-5" />}
              status={getStatus(5)}
            />
          </div>
          
          <Connector height={40} active={currentStage > 5} />

          {/* Stage 6: Audit */}
          <div data-stage="6">
            <WorkflowNode 
              id="audit" 
              title="Books & Records" 
              subtitle="SEC 17a-4 Archival" 
              icon={<History className="w-5 h-5" />}
              status={getStatus(6)}
            />
          </div>
          
          <Connector height={40} active={currentStage > 6} />
          
          {/* Stage 7: Ledger */}
          <div data-stage="7">
            <WorkflowNode 
              id="ledger" 
              title="Distributed Ledger" 
              subtitle="Final System Commitment" 
              icon={<Fingerprint className="w-6 h-6 text-blue-500" />} 
              status={getStatus(7)}
            />
          </div>
          
          <Connector height={40} active={currentStage > 7} />
          
          {/* Stage 8: Complete */}
          <div data-stage="8">
            <WorkflowNode 
              id="done" 
              title="Verification Complete" 
              subtitle="Cryptographic Proof Generated" 
              icon={<CheckCircle2 className="w-6 h-6 text-green-500" />} 
              status={getStatus(8)}
            />
          </div>

          <AnimatePresence>
            {currentStage === 8 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-16 w-full max-w-2xl bg-white p-8 rounded-2xl border-2 border-green-500 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">System Integrity Proof Generated</h3>
                    <p className="text-sm text-slate-500">Hash: 0x7d8a2c5b9e1f4a3c2d8e9f1b2c3d4e5f</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Immutable</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Distributed</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                  Download Audit Trail
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
