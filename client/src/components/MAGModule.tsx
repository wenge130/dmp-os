import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  ShieldCheck, 
  TrendingDown, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Fingerprint,
  Zap,
  Activity,
  Search,
  Settings,
  Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const limitData = [
  { trader: 'T-101', notional: 500000, limit: 1000000, usage: 50 },
  { trader: 'T-102', notional: 850000, limit: 1000000, usage: 85 },
  { trader: 'T-103', notional: 120000, limit: 500000, usage: 24 },
  { trader: 'T-104', notional: 950000, limit: 1000000, usage: 95 },
];

export const MAGModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Access (MAG)</h1>
          <p className="text-muted-foreground mt-1">Real-time pre-trade risk controls and SEC Rule 15c3-5 compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Limit
          </Button>
          <Button size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Gateways
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Gateway Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <Activity className="h-3 w-3 mr-1" /> 12 Gateways Online
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Daily Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2M</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Limit Breaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              <ShieldCheck className="h-3 w-3 mr-1" /> All Clear
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Rejected Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-[10px] text-red-500 flex items-center mt-1 font-medium">
              <AlertTriangle className="h-3 w-3 mr-1" /> Fat-finger Prevents
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Trader Limit Utilization</CardTitle>
          <CardDescription className="text-[10px]">Real-time notional usage vs assigned limits</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={limitData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="trader" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Pre-Trade Risk Checks</CardTitle>
            <CardDescription className="text-[10px]">SEC Rule 15c3-5 automated controls — all active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { label: 'Fat-Finger Check', desc: 'Orders >10x avg size blocked', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '14 today' },
              { label: 'Wash Trade Prevention', desc: 'Cross-account matching', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '0 today' },
              { label: 'Layering Detection', desc: 'Quote stuffing pattern analysis', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '0 today' },
              { label: 'Spoofing Monitoring', desc: 'Cancel-to-fill ratio threshold', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '2 today' },
              { label: 'Momentum Ignition', desc: 'Rapid directional order bursts', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '0 today' },
              { label: 'Notional Limit Check', desc: 'Per-trader daily notional cap', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '0 today' },
              { label: 'Duplicate Order Filter', desc: 'Idempotency key validation', status: 'Active', color: 'bg-green-100 text-green-700', triggered: '3 today' },
            ].map((check) => (
              <div key={check.label} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20">
                <div>
                  <span className="text-xs font-medium">{check.label}</span>
                  <p className="text-[10px] text-muted-foreground">{check.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-muted-foreground">{check.triggered}</span>
                  <Badge className={`${check.color} border-none text-[10px] h-5`}>{check.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">MAG Audit Trail</CardTitle>
            <CardDescription className="text-[10px]">Immutable log of all limit changes and gateway events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            {[
              { action: 'Limit Increase: T-104 (950k → 1.2M)', user: '@roger', time: '10:15 AM', hash: '0x82f...d4e', badge: 'Limit Change', badgeClass: 'bg-blue-100 text-blue-700' },
              { action: 'Gateway Sync: NYC-01', user: 'System', time: '09:30 AM', hash: '0x3a2...b1c', badge: 'System', badgeClass: 'bg-slate-100 text-slate-600' },
              { action: 'Rule Update: Wash Trade Threshold', user: '@artie', time: '08:45 AM', hash: '0x1e5...f9d', badge: 'Rule Update', badgeClass: 'bg-purple-100 text-purple-700' },
              { action: 'Fat-Finger Block: T-102 (14 orders)', user: 'System', time: '08:20 AM', hash: '0x9c4...a2b', badge: 'Auto-Block', badgeClass: 'bg-red-100 text-red-700' },
              { action: 'Spoofing Alert: T-103 Pattern Flagged', user: 'System', time: '07:55 AM', hash: '0x4d7...e3c', badge: 'Alert', badgeClass: 'bg-amber-100 text-amber-700' },
              { action: 'Gateway Added: CHI-02 (CBOE)', user: '@roger', time: '07:30 AM', hash: '0x6f1...b8d', badge: 'Config', badgeClass: 'bg-green-100 text-green-700' },
              { action: 'Daily Limit Reset: All Traders', user: 'System', time: '07:00 AM', hash: '0x2e8...c5a', badge: 'Reset', badgeClass: 'bg-slate-100 text-slate-600' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold">{log.action}</p>
                    <p className="text-[9px] text-muted-foreground">By {log.user} · {log.time} · <span className="font-mono">{log.hash}</span></p>
                  </div>
                </div>
                <Badge className={`${log.badgeClass} border-none text-[10px] h-5 shrink-0 ml-2`}>{log.badge}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Gateway Status Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Gateway Status &amp; Connectivity</CardTitle>
          <CardDescription className="text-[10px]">Real-time status of all trading gateways under SEC Rule 15c3-5</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gateway ID</th>
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Venue</th>
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Protocol</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latency</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Orders Today</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reject Rate</th>
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { id: 'NYC-01', venue: 'NYSE', protocol: 'FIX 4.4', latency: '0.8ms', orders: '1.2M', rejectRate: '0.12%', status: 'Online', statusClass: 'bg-green-100 text-green-700' },
                  { id: 'NYC-02', venue: 'NASDAQ', protocol: 'OUCH 4.2', latency: '0.6ms', orders: '1.5M', rejectRate: '0.09%', status: 'Online', statusClass: 'bg-green-100 text-green-700' },
                  { id: 'CHI-01', venue: 'CBOE', protocol: 'FIX 4.4', latency: '1.1ms', orders: '0.8M', rejectRate: '0.14%', status: 'Online', statusClass: 'bg-green-100 text-green-700' },
                  { id: 'CHI-02', venue: 'CME', protocol: 'FIX 5.0', latency: '1.3ms', orders: '0.4M', rejectRate: '0.08%', status: 'Online', statusClass: 'bg-green-100 text-green-700' },
                  { id: 'BOS-01', venue: 'IEX', protocol: 'FIX 4.4', latency: '2.1ms', orders: '0.3M', rejectRate: '0.11%', status: 'Online', statusClass: 'bg-green-100 text-green-700' },
                  { id: 'NYC-03', venue: 'ARCA', protocol: 'OUCH 4.2', latency: '0.9ms', orders: '0.0M', rejectRate: '—', status: 'Standby', statusClass: 'bg-slate-100 text-slate-600' },
                ].map((gw, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2 font-mono font-medium">{gw.id}</td>
                    <td className="py-2">{gw.venue}</td>
                    <td className="py-2 font-mono text-muted-foreground">{gw.protocol}</td>
                    <td className="py-2 text-right font-mono">{gw.latency}</td>
                    <td className="py-2 text-right font-mono">{gw.orders}</td>
                    <td className="py-2 text-right font-mono">{gw.rejectRate}</td>
                    <td className="py-2">
                      <Badge className={`${gw.statusClass} hover:${gw.statusClass} border-none h-5 text-[10px]`}>{gw.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
