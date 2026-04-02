import React from "react";
import { 
  Fingerprint, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface LedgerEntryProps {
  category: string;
  title: string;
  badge: string;
  hash: string;
  timestamp: string;
  isFirst?: boolean;
}

const LedgerEntry = ({ category, title, badge, hash, timestamp, isFirst = false }: LedgerEntryProps) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="relative pl-10 pb-10 group"
  >
    {/* Timeline line */}
    <div className="absolute left-[11px] top-2 bottom-0 w-[1px] bg-slate-100 group-last:bg-transparent" />
    
    {/* Timeline dot */}
    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center z-10 ${isFirst ? "border-blue-500 shadow-sm" : "border-slate-200"}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${isFirst ? "bg-blue-500" : "bg-slate-300"}`} />
    </div>

    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{category}</span>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {timestamp}
        </div>
      </div>
      
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      
      <div className="flex items-center gap-3 mt-1">
        <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black text-slate-500 rounded tracking-widest uppercase">
          {badge}
        </span>
        <span className="text-[11px] font-mono text-slate-400">{hash}</span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-300 hover:text-blue-500 cursor-pointer transition-colors" />
      </div>
    </div>
  </motion.div>
);

export default function DigitalLedgerView() {
  const entries = [
    { category: "TRADE", title: "Execution Approved", badge: "TRADING", hash: "0x82f...d4e", timestamp: "10:45:12 AM", isFirst: true },
    { category: "COMPLIANCE", title: "AML/KYC Verified", badge: "RISK", hash: "0x91c...b2a", timestamp: "10:45:10 AM" },
    { category: "FINANCE", title: "General Ledger Update", badge: "FINANCE", hash: "0x33e...f1b", timestamp: "10:45:08 AM" },
    { category: "HR", title: "Employee Standing Check", badge: "HR", hash: "0x55d...e2c", timestamp: "10:45:05 AM" },
    { category: "REGULATORY", title: "FINRA API Sync", badge: "COMPLIANCE", hash: "0x12b...a3f", timestamp: "10:44:50 AM" },
    { category: "SYSTEM", title: "Daily Snapshot", badge: "TECH", hash: "0x00a...b11", timestamp: "09:00:00 AM" },
    { category: "EQUITY", title: "Vesting Schedule Update", badge: "CORPORATE", hash: "0x44c...d2e", timestamp: "Yesterday" },
  ];

  return (
    <div className="h-full flex flex-col bg-white font-sans overflow-hidden">
      {/* Header */}
      <div className="shrink-0 h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-6 h-6 text-slate-900" />
          <h1 className="text-sm font-black tracking-[0.2em] text-slate-900 uppercase">Digital Ledger</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">Live</span>
        </div>
      </div>

      {/* Ledger Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-10">
        <div className="max-w-3xl mx-auto w-full">
          {entries.map((entry, idx) => (
            <LedgerEntry key={idx} {...entry} />
          ))}
        </div>
      </div>

      {/* Footer Status */}
      <div className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Blockchain Status</span>
            <div className="flex items-center gap-2 text-[10px] font-black text-green-600 tracking-widest uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Synchronized
            </div>
          </div>
          
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-slate-900 rounded-full"
            />
          </div>
          
          <p className="text-center italic text-[10px] text-slate-400 font-medium">
            "Printing to Ethereum Ledger... [0x91c...b2a]"
          </p>
        </div>
      </div>
    </div>
  );
}
