import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Fingerprint,
  RefreshCw,
  Calculator,
  Search
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const capitalTrend = [
  { day: 'Mar 25', capital: 41.2, excess: 36.2 },
  { day: 'Mar 26', capital: 41.8, excess: 36.8 },
  { day: 'Mar 27', capital: 42.1, excess: 37.1 },
  { day: 'Mar 28', capital: 41.9, excess: 36.9 },
  { day: 'Mar 29', capital: 42.3, excess: 37.3 },
  { day: 'Mar 30', capital: 42.5, excess: 37.5 },
  { day: 'Mar 31', capital: 42.5, excess: 37.5 },
];

const checklistData = [
  { id: 1, task: 'Review Financial Position', status: 'Completed', by: 'Artie', time: '08:30 AM' },
  { id: 2, task: 'Calculate Allowable Assets', status: 'Completed', by: 'Artie', time: '08:45 AM' },
  { id: 3, task: 'Apply Securities Haircuts', status: 'Completed', by: 'Artie', time: '09:00 AM' },
  { id: 4, task: 'Final Net Capital Verification', status: 'Pending', by: 'Roger', time: '-' },
];

export const NetCapitalModule: React.FC = () => {
  const [calculating, setCalculating] = useState(false);

  const handleRecalculate = () => {
    setCalculating(true);
    setTimeout(() => setCalculating(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Net Capital (FINOP)</h1>
          <p className="text-muted-foreground mt-1">Daily liquidity monitoring and capital compliance under SEC Rule 15c3-1.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRecalculate} disabled={calculating} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${calculating ? 'animate-spin' : ''}`} />
            Recalculate
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Prepare FOCUS Report
          </Button>
        </div>
      </div>

      {/* Capital Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Net Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,500,000</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +$200k since yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Excess Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$37,500,000</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Compliant
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Min. Requirement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,000,000</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              Agency-Only BD
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Agg. Indebtedness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.25 : 1</div>
            <p className="text-[10px] text-purple-500 flex items-center mt-1 font-medium">
              Limit 15 : 1
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Capital Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-bold">7-Day Capital Trend</CardTitle>
              <CardDescription className="text-[10px]">Net Capital vs Excess Capital (Millions $)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] text-muted-foreground">Net</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-muted-foreground">Excess</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capitalTrend}>
                <defs>
                  <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="capital" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCap)" strokeWidth={2} />
                <Area type="monotone" dataKey="excess" stroke="#22c55e" fillOpacity={1} fill="url(#colorExc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Checklist */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Daily FINOP Checklist
            </CardTitle>
            <CardDescription className="text-[10px]">Verification steps for daily net capital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {checklistData.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center border ${task.status === 'Completed' ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-border text-muted-foreground'}`}>
                  {task.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{task.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-muted-foreground">By {task.by}</p>
                    <span className="text-[10px] text-muted-foreground/30">•</span>
                    <p className="text-[10px] text-muted-foreground">{task.time}</p>
                  </div>
                </div>
                {task.status === 'Pending' && (
                  <Button size="sm" className="h-6 text-[10px] px-2 bg-primary text-primary-foreground">Review</Button>
                )}
              </div>
            ))}
            <div className="pt-2">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-800">Alert: Potential Non-Allowable Asset</p>
                  <p className="text-[10px] text-amber-700">Receivable from Broker "X" is aged 28 days. Recalculate if not collected by EOD.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit & Logs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold">Calculation Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-mono">Daily Net Capital Log: 2026-04-01</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-5 text-[10px]">Verified</Badge>
                <p className="text-[10px] text-muted-foreground">09:15 AM</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-mono">Haircut Adjustment: U.S. Gov Securities</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none h-5 text-[10px]">Adjustment</Badge>
                <p className="text-[10px] text-muted-foreground">08:50 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
