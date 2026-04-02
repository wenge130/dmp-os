import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Search, 
  Settings, 
  Plus, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Fingerprint,
  RefreshCw,
  LayoutGrid,
  FileText,
  Download,
  Filter,
  Lock,
  Database,
  History,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const analyticsData = [
  { name: 'Mon', revenue: 45000, cost: 24000, profit: 21000 },
  { name: 'Tue', revenue: 52000, cost: 26000, profit: 26000 },
  { name: 'Wed', revenue: 48000, cost: 25000, profit: 23000 },
  { name: 'Thu', revenue: 61000, cost: 28000, profit: 33000 },
  { name: 'Fri', revenue: 55000, cost: 27000, profit: 28000 },
];

const efficiencyData = [
  { name: 'Trading', value: 85, color: '#3b82f6' },
  { name: 'Ops', value: 92, color: '#22c55e' },
  { name: 'Risk', value: 78, color: '#ef4444' },
  { name: 'Compliance', value: 95, color: '#f59e0b' },
];

export const OperationalAnalytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operational Analytics</h1>
          <p className="text-muted-foreground mt-1">Advanced business intelligence and operational performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Insights
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$55,000</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Efficiency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.4</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Optimized
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Operational Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$27,000</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -5% vs baseline
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Daily ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">104%</div>
            <p className="text-[10px] text-purple-500 flex items-center mt-1 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" /> Outperforming
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Operational Performance Trend</CardTitle>
            <CardDescription className="text-[10px]">Revenue vs Operational Cost (Daily $)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="cost" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Departmental Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <TrendingUp className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">AI-Driven Insights</p>
              <p className="text-xs font-medium text-slate-700">Operational costs have decreased by 5% due to automated CAT reporting repairs.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            DMP AI Insight
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
