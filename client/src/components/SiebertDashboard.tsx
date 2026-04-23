import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import {
  AlertCircle, CheckCircle2, Clock, TrendingUp,
  ArrowRightLeft, FileText, Zap, Shield, Activity,
  ChevronRight
} from 'lucide-react';

const kpis = [
  { label: 'Open Breaks', value: '22', sub: '↑ 5 from yesterday', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { label: 'Pending Signatures', value: '7', sub: '30-day borrow letters', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { label: 'Auto-Resolved Today', value: '41', sub: 'AI confidence ≥ 95%', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { label: 'Compliance Score', value: '98.2%', sub: 'vs. 96.1% last week', color: 'text-foreground', bg: 'bg-background border-border' },
];

const workflows = [
  { name: 'Workflow A', desc: 'Custodian Recon (CIBC/BMO)', lastRun: '08:00 AM', badge: '3 Breaks', badgeColor: 'bg-amber-100 text-amber-800', open: 3, href: '/siebert-recon' },
  { name: 'Workflow B', desc: '30-Day Stock Borrow', lastRun: '07:30 AM', badge: '7 Unsigned', badgeColor: 'bg-red-100 text-red-800', open: 7, href: '/siebert-borrow' },
  { name: 'Workflow C', desc: 'Daily Trade Breaks', lastRun: '09:15 AM', badge: '12 Open', badgeColor: 'bg-amber-100 text-amber-800', open: 12, href: '/siebert-breaks' },
];

const pipeline = [
  { name: 'Broadridge Ingestion', status: 'Live', color: 'bg-green-500' },
  { name: 'CIBC Custodian Feed', status: 'Live', color: 'bg-green-500' },
  { name: 'LoanNet SFTP', status: 'Live', color: 'bg-green-500' },
  { name: 'BMO Custodian Feed', status: 'Delayed 2h', color: 'bg-amber-500' },
  { name: 'AI Parser (Modal)', status: 'Running', color: 'bg-blue-500' },
  { name: 'StorJ Archive', status: 'Synced', color: 'bg-green-500' },
];

const activity = [
  { time: '11:32 AM', event: 'ISIN US0231351067 → CUSIP 023135106', workflow: 'Workflow A', action: 'Auto-mapped', status: 'Resolved', statusColor: 'bg-green-100 text-green-800' },
  { time: '11:28 AM', event: 'Break: AAPL qty mismatch +500 vs CIBC', workflow: 'Workflow A', action: 'T+1 timing flag', status: 'Pending Review', statusColor: 'bg-amber-100 text-amber-800' },
  { time: '10:55 AM', event: '30-day letter generated: Goldman Sachs', workflow: 'Workflow B', action: 'PDF + PandaDoc push', status: 'Awaiting Sig.', statusColor: 'bg-blue-100 text-blue-800' },
  { time: '10:41 AM', event: 'Trade break: Missing booking #TRD-8821', workflow: 'Workflow C', action: 'Corrective action suggested', status: 'Pending Review', statusColor: 'bg-amber-100 text-amber-800' },
  { time: '09:18 AM', event: 'Broadridge flat file parsed (10,412 pages)', workflow: 'Pipeline', action: 'LLM extraction complete', status: 'Stored', statusColor: 'bg-green-100 text-green-800' },
];

export const SiebertDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Thu, Apr 23 2026 · As of 11:45 AM EDT</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground mt-1">AI-powered reconciliation, borrow confirmations, and trade break resolution.</p>
        </div>
        <Link href="/siebert-pipeline">
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-4 w-4" />
            Pipeline Status
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className={`border ${k.bg}`}>
            <CardContent className="pt-5 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Status */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Workflow Status — Today</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">Workflow</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">Last Run</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">Status</th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">Open</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((w) => (
                    <tr key={w.name} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-xs">{w.name}</p>
                        <p className="text-[10px] text-muted-foreground">{w.desc}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{w.lastRun}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${w.badgeColor}`}>
                          {w.badge}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">{w.open}</td>
                      <td className="px-4 py-3">
                        <Link href={w.href}>
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            Review <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Data Pipeline Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.color}`} />
                  <span className="text-xs">{p.name}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.status === 'Live' || p.status === 'Synced' ? 'bg-green-100 text-green-800' :
                  p.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>{p.status}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Last full sync: 09:18 AM · Next: 03:00 PM</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Recent AI Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Time', 'Event', 'Workflow', 'AI Action', 'Status'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activity.map((a, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{a.time}</td>
                  <td className="px-4 py-3 text-xs">{a.event}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.workflow}</td>
                  <td className="px-4 py-3 text-xs">{a.action}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.statusColor}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiebertDashboard;
