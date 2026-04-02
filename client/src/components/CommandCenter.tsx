import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  TrendingUp, 
  Server, 
  Users, 
  Briefcase, 
  Scale,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function CommandCenter() {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground">Master Dashboard for Brokerage Operations</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="Tech Status" 
          icon={Server} 
          status="Operational" 
          value="99.98%" 
          trend="Uptime"
          color="blue"
        />
        <StatusCard 
          title="FINOP" 
          icon={TrendingUp} 
          status="In Good Standing" 
          value="$42.5M" 
          trend="Net Capital"
          color="emerald"
        />
        <StatusCard 
          title="Compliance" 
          icon={ShieldCheck} 
          status="Audit Ready" 
          value="100%" 
          trend="Rule 3110"
          color="indigo"
        />
        <StatusCard 
          title="Broker Jobs" 
          icon={Briefcase} 
          status="Active" 
          value="24" 
          trend="Queued"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Business Intelligence & Analytics</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-end justify-between gap-2 pt-4">
              {[45, 60, 40, 75, 50, 90, 65, 80, 55, 70, 85, 95].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-primary/10 rounded-t-sm hover:bg-primary/30 transition-colors cursor-help relative group"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Vol: {h}k
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-muted-foreground uppercase tracking-wider">
              <span>Apr 2025</span>
              <span>Mar 2026</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Lineage & Audit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuditItem 
              label="Company Formed" 
              date="Nov 2023" 
              hash="0x71c...a4f" 
            />
            <AuditItem 
              label="Equity Issuance (W.G.)" 
              date="Jan 2024" 
              hash="0x92d...b1e" 
            />
            <AuditItem 
              label="LLC Doc Update" 
              date="Mar 2024" 
              hash="0x33f...c8d" 
            />
            <AuditItem 
              label="OBA Policy Draft" 
              date="Jun 2024" 
              hash="0x55a...e2f" 
            />
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-8">
              View Full Ledger
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusCard({ title, icon: Icon, status, value, trend, color }: any) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    indigo: "bg-indigo-500/10 text-indigo-600",
    orange: "bg-orange-500/10 text-orange-600",
  };

  return (
    <Card className="shadow-sm border-border/50 hover:border-primary/20 transition-colors cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{value}</h3>
            <span className="text-[10px] font-medium text-muted-foreground">{trend}</span>
          </div>
          <p className="text-xs font-medium flex items-center gap-1.5 pt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${color === 'orange' ? 'bg-orange-500' : 'bg-green-500'}`} />
            {status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditItem({ label, date, hash }: any) {
  return (
    <div className="flex items-start justify-between group cursor-pointer">
      <div className="space-y-0.5">
        <p className="text-xs font-medium group-hover:text-primary transition-colors">{label}</p>
        <p className="text-[10px] text-muted-foreground">{date}</p>
      </div>
      <div className="text-right">
        <code className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground group-hover:text-foreground transition-colors">
          {hash}
        </code>
      </div>
    </div>
  );
}
