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
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { label: 'Fat-Finger Check', status: 'Active', color: 'bg-green-100 text-green-700' },
              { label: 'Wash Trade Prevention', status: 'Active', color: 'bg-green-100 text-green-700' },
              { label: 'Layering Detection', status: 'Active', color: 'bg-green-100 text-green-700' },
              { label: 'Spoofing Monitoring', status: 'Active', color: 'bg-green-100 text-green-700' },
              { label: 'Momentum Ignition', status: 'Active', color: 'bg-green-100 text-green-700' },
            ].map((check) => (
              <div key={check.label} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20">
                <span className="text-xs font-medium">{check.label}</span>
                <Badge className={`${check.color} border-none text-[10px] h-5`}>{check.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">MAG Audit Trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { id: 1, action: 'Limit Increase: T-104', user: '@roger', time: '10:15 AM', hash: '0x82f...d4e' },
              { id: 2, action: 'Gateway Sync: NYC-01', user: 'System', time: '09:30 AM', hash: '0x3a2...b1c' },
              { id: 3, action: 'Rule Update: Wash Trade', user: '@artie', time: '08:45 AM', hash: '0x1e5...f9d' },
            ].map((log) => (
              <div key={log.id} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-bold">{log.action}</p>
                    <p className="text-[8px] text-muted-foreground">By {log.user} • {log.time}</p>
                  </div>
                </div>
                <p className="text-[8px] font-mono text-muted-foreground/60">{log.hash}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
