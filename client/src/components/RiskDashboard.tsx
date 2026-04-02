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
  Activity
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const riskProfile = [
  { subject: 'Market', A: 120, fullMark: 150 },
  { subject: 'Credit', A: 98, fullMark: 150 },
  { subject: 'Operational', A: 86, fullMark: 150 },
  { subject: 'Liquidity', A: 99, fullMark: 150 },
  { subject: 'Compliance', A: 110, fullMark: 150 },
  { subject: 'Reputational', A: 130, fullMark: 150 },
];

const alertData = [
  { id: 1, type: 'Critical', msg: 'Counterparty exposure limit exceeded: Apex Clearing', time: '2m ago' },
  { id: 2, type: 'Warning', msg: 'Volatility spike detected in Portfolio B (Equity)', time: '15m ago' },
  { id: 3, type: 'Info', msg: 'Intra-day margin call successfully met', time: '1h ago' },
];

export const RiskDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
          <p className="text-muted-foreground mt-1">Real-time enterprise risk monitoring and mitigation controls.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Run Stress Test
          </Button>
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Instant Mitigation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Profile Radar */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Enterprise Risk Profile</CardTitle>
            <CardDescription className="text-[10px]">Multi-dimensional risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskProfile}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} fontSize={8} />
                <Radar
                  name="Risk Level"
                  dataKey="A"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exposure Status */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-red-50/50 border-red-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Active Exposure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12.4M</div>
                <p className="text-[10px] text-red-500 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +8.2% vs baseline
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50 border-amber-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">VaR (95%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$485,000</div>
                <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
                  <Activity className="h-3 w-3 mr-1" /> Normal Volatility
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Risk Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alertData.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center border ${
                    alert.type === 'Critical' ? 'bg-red-100 border-red-200 text-red-600' : 
                    alert.type === 'Warning' ? 'bg-amber-100 border-amber-200 text-amber-600' : 
                    'bg-blue-100 border-blue-200 text-blue-600'
                  }`}>
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{alert.msg}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">Dismiss</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Fingerprint className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">System Integrity</p>
              <p className="text-xs font-medium text-slate-700">All risk parameters are cryptographically verified and auditable.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            Last Hash: 0x92c...f1a
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
