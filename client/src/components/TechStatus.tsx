import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, 
  Settings, 
  Activity, 
  CheckCircle2, 
  ArrowDownRight,
  RefreshCw,
  Cpu,
  Wifi
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const uptimeData = [
  { time: '00:00', uptime: 99.9 },
  { time: '04:00', uptime: 99.8 },
  { time: '08:00', uptime: 99.9 },
  { time: '12:00', uptime: 100 },
  { time: '16:00', uptime: 99.9 },
  { time: '20:00', uptime: 99.9 },
  { time: '23:59', uptime: 100 },
];

const serviceData = [
  { name: 'API Gateway', status: 'Operational', latency: '45ms' },
  { name: 'Core Engine', status: 'Operational', latency: '12ms' },
  { name: 'Ledger Sync', status: 'Operational', latency: '150ms' },
  { name: 'AI Inference', status: 'Operational', latency: '850ms' },
  { name: 'Database', status: 'Operational', latency: '5ms' },
];

export const TechStatus: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technology Status</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of system infrastructure, APIs, and engine performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Infrastructure Config
          </Button>
          <Button size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Overall Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.99%</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> All Systems Nominal
            </p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Avg. Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42ms</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -5ms from avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-[10px] text-purple-500 flex items-center mt-1 font-medium">
              <Wifi className="h-3 w-3 mr-1" /> 12k req/sec
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-50/50 border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">CPU Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-[10px] text-slate-500 flex items-center mt-1 font-medium">
              <Cpu className="h-3 w-3 mr-1" /> Balanced
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">System Uptime Trend</CardTitle>
            <CardDescription className="text-[10px]">Real-time availability over the last 24 hours (%)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={[99, 100]} fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="uptime" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Core Service Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {serviceData.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-muted-foreground">{service.latency}</span>
                  <Badge className="bg-green-100 text-green-700 border-none text-[8px] h-4">Operational</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Server className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Infrastructure Audit</p>
              <p className="text-xs font-medium text-slate-700">All technology changes are cryptographically signed and auditable in the system history.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            Audit-Ready Infrastructure
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
