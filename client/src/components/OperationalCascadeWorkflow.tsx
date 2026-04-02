import React from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CreditCard, 
  Scale, 
  Link as LinkIcon,
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  UserCheck,
  FileText
} from "lucide-react";

interface NodeProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const WorkflowNode = ({ title, subtitle, icon, active = false, disabled = false }: NodeProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      relative z-10 px-3 py-2 rounded-md border text-center transition-all duration-300
      ${active 
        ? "bg-white border-slate-300 shadow-sm ring-1 ring-slate-200/50" 
        : disabled 
          ? "bg-slate-50/50 border-slate-100 opacity-40" 
          : "bg-white border-slate-200 shadow-sm"}
      min-w-[160px] max-w-[200px]
    `}
  >
    <div className="flex flex-col items-center gap-0.5">
      {icon && <div className={`mb-1 ${active ? "text-blue-600" : "text-slate-400"}`}>{icon}</div>}
      <span className={`text-[10px] font-bold tracking-tight leading-tight ${active ? "text-slate-900" : "text-slate-600 uppercase"}`}>
        {title}
      </span>
      {subtitle && (
        <span className="text-[8px] text-slate-400 font-medium leading-tight uppercase tracking-tighter">
          {subtitle}
        </span>
      )}
    </div>
  </motion.div>
);

const Connector = ({ type = "vertical", height = 24 }: { type?: "vertical" | "fork" | "merge", height?: number }) => {
  if (type === "vertical") {
    return (
      <div className="flex justify-center w-full" style={{ height }}>
        <div className="w-[1px] bg-slate-200 h-full relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 border-b border-r border-slate-300 rotate-45" />
        </div>
      </div>
    );
  }

  if (type === "fork") {
    return (
      <div className="relative w-full h-[32px] flex justify-center">
        <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <path 
            d="M 160 0 L 160 10 Q 160 16 140 16 L 60 16 Q 40 16 40 24 L 40 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
          <path 
            d="M 160 0 L 160 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
          <path 
            d="M 160 0 L 160 10 Q 160 16 180 16 L 260 16 Q 280 16 280 24 L 280 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
        </svg>
      </div>
    );
  }

  if (type === "merge") {
    return (
      <div className="relative w-full h-[32px] flex justify-center">
        <svg width="100%" height="100%" className="absolute inset-0" preserveAspectRatio="none">
          <path 
            d="M 40 0 L 40 8 Q 40 16 60 16 L 140 16 Q 160 16 160 22 L 160 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
          <path 
            d="M 160 0 L 160 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
          <path 
            d="M 280 0 L 280 8 Q 280 16 260 16 L 180 16 Q 160 16 160 22 L 160 32" 
            fill="none" stroke="#e2e8f0" strokeWidth="1" 
          />
        </svg>
      </div>
    );
  }

  return null;
};

export default function OperationalCascadeWorkflow() {
  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] border-l border-slate-200 overflow-hidden font-sans">
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Operational Cascade</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide">
        <div className="max-w-[320px] mx-auto flex flex-col items-center pb-8">
          
          {/* Stage 1: Order Execution */}
          <WorkflowNode 
            id="order" 
            title="Trade Execution" 
            subtitle="Order Type #1 (RCB)"
            active 
          />
          
          <Connector height={24} />
          
          {/* Stage 2: Supervisor Approval */}
          <WorkflowNode 
            id="supervisor" 
            title="Supervisory Review" 
            subtitle="Digital Signature Applied"
            icon={<ShieldCheck className="w-2.5 h-2.5" />}
          />
          
          <Connector type="fork" />
          
          {/* Stage 3: Multi-Account Verification */}
          <div className="flex justify-between w-full gap-1 px-1">
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="acct1" 
                title="ACCT DOC #1" 
                subtitle="AML-KYC-OFAC"
                icon={<Database className="w-2.5 h-2.5" />}
                disabled
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="acct2" 
                title="ACCT DOC #2" 
                subtitle="AML-KYC-OFAC"
                icon={<Database className="w-2.5 h-2.5" />}
                active
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="acct3" 
                title="ACCT DOC #3" 
                subtitle="AML-KYC-OFAC"
                icon={<Database className="w-2.5 h-2.5" />}
                disabled
              />
            </div>
          </div>
          
          <Connector type="merge" />
          
          {/* Stage 4: Employee Regulatory Standing */}
          <WorkflowNode 
            id="employee" 
            title="Regulatory Standing" 
            subtitle="U4 / CE / Digital Signatures"
            icon={<UserCheck className="w-2.5 h-2.5" />}
          />
          
          <Connector type="fork" />
          
          {/* Stage 5: Departmental Verification */}
          <div className="flex justify-between w-full gap-1 px-1">
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="hr" 
                title="Human Resources" 
                subtitle="Employee A/B/C"
                icon={<Users className="w-2.5 h-2.5" />}
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="finance" 
                title="Finance" 
                subtitle="General Ledger"
                icon={<CreditCard className="w-2.5 h-2.5" />}
                active
              />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <WorkflowNode 
                id="compliance" 
                title="Compliance" 
                subtitle="FINRA / SEC Sync"
                icon={<ShieldCheck className="w-2.5 h-2.5" />}
              />
            </div>
          </div>
          
          <Connector type="merge" />
          
          {/* Stage 6: Legal & Audit */}
          <WorkflowNode 
            id="legal" 
            title="Legal & Audit" 
            subtitle="Books & Records"
            icon={<Scale className="w-2.5 h-2.5" />}
          />
          
          <Connector height={24} />
          
          {/* Stage 7: Final Commitment */}
          <WorkflowNode 
            id="ledger" 
            title="Distributed Ledger" 
            subtitle="Final System Commitment"
            icon={<Fingerprint className="w-2.5 h-2.5 text-blue-400" />}
            active
          />
          
          <Connector height={24} />
          
          {/* Stage 8: Follow-up */}
          <WorkflowNode 
            id="done" 
            title="Verification Complete" 
            subtitle="Cryptographic Proof Generated"
            icon={<CheckCircle2 className="w-2.5 h-2.5 text-green-500" />}
          />

        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">System Fingerprint</span>
          <span className="text-[9px] font-mono text-slate-400">0x7d8a...f2e9</span>
        </div>
        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="bg-blue-500 h-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
