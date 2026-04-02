import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Fingerprint, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Hash,
  Database,
  ArrowRight
} from "lucide-react";

const LEDGER_DATA = [
  { id: 1, type: "Trade", action: "Execution Approved", timestamp: "10:45:12 AM", hash: "0x82f...d4e", department: "Trading" },
  { id: 2, type: "Compliance", action: "AML/KYC Verified", timestamp: "10:45:10 AM", hash: "0x91c...b2a", department: "Risk" },
  { id: 3, type: "Finance", action: "General Ledger Update", timestamp: "10:45:08 AM", hash: "0x33e...f1b", department: "Finance" },
  { id: 4, type: "HR", action: "Employee Standing Check", timestamp: "10:45:05 AM", hash: "0x55d...e2c", department: "HR" },
  { id: 5, type: "Regulatory", action: "FINRA API Sync", timestamp: "10:44:50 AM", hash: "0x12b...a3f", department: "Compliance" },
  { id: 6, type: "System", action: "Daily Snapshot", timestamp: "09:00:00 AM", hash: "0x00a...b11", department: "Tech" },
  { id: 7, type: "Equity", action: "Vesting Schedule Update", timestamp: "Yesterday", hash: "0x44c...d2e", department: "Corporate" },
];

export default function DigitalLedger() {
  return (
    <div className="flex flex-col h-full bg-card/30 border-l border-border/50 animate-in slide-in-from-right duration-500">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">Digital Ledger</h2>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold">
          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          LIVE
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {LEDGER_DATA.map((item, i) => (
            <div 
              key={item.id} 
              className="group relative pl-4 border-l-2 border-border/50 hover:border-primary/50 transition-colors py-1"
            >
              <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors" />
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.type}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                
                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  {item.action}
                  <CheckCircle2 className="w-3 h-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded uppercase font-bold tracking-tighter">
                      {item.department}
                    </span>
                    <code className="text-[9px] text-muted-foreground/60 font-mono group-hover:text-muted-foreground transition-colors">
                      {item.hash}
                    </code>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-secondary/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-medium text-muted-foreground">Blockchain Status</span>
          <span className="text-[10px] font-bold text-green-600 uppercase">Synchronized</span>
        </div>
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%] animate-pulse" />
          </div>
          <p className="text-[9px] text-muted-foreground text-center italic">
            "Printing to Ethereum Ledger... [0x91c...b2a]"
          </p>
        </div>
      </div>
    </div>
  );
}
