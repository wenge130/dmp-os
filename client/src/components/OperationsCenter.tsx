import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Layers, 
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
  FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const opData = [
  { name: 'Cleared', value: 450, color: '#22c55e' },
  { name: 'Pending', value: 120, color: '#3b82f6' },
  { name: 'Rejected', value: 45, color: '#ef4444' },
  { name: 'On Hold', value: 30, color: '#f59e0b' },
];

const taskData = [
  { id: 1, task: 'Daily Trade Reconciliation', status: 'Completed', by: 'Artie', time: '08:30 AM' },
  { id: 2, task: 'CAT Reporting Submission', status: 'In Progress', by: 'Roger', time: '09:45 AM' },
  { id: 3, task: 'FOCUS Report Preparation', status: 'Pending', by: 'Don', time: '-' },
  { id: 4, task: 'Margin Call Review', status: 'Completed', by: 'Artie', time: '10:15 AM' },
];

export const OperationsCenter: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Center</h1>
          <p className="text-muted-foreground mt-1">Centralized management of brokerage operations and middle-office workflows.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Configure Dashboard
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Operational Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +15% vs yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Cleared Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Above industry avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              <Activity className="h-3 w-3 mr-1" /> Active Monitoring
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Trade Breaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-[10px] text-red-500 flex items-center mt-1 font-medium">
              <AlertTriangle className="h-3 w-3 mr-1" /> Action Required
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Settlement Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={opData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {opData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Operational Workflow Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {taskData.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center border ${
                  task.status === 'Completed' ? 'bg-green-100 border-green-200 text-green-600' : 
                  task.status === 'In Progress' ? 'bg-blue-100 border-blue-200 text-blue-600' : 
                  'bg-white border-border text-muted-foreground'
                }`}>
                  {task.status === 'Completed' && <CheckCircle2 className="h-3 w-3" />}
                  {task.status === 'In Progress' && <Activity className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{task.task}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">By {task.by} • {task.time}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] h-5 ${
                  task.status === 'Completed' ? 'text-green-600 border-green-200' : 
                  task.status === 'In Progress' ? 'text-blue-600 border-blue-200' : 
                  'text-muted-foreground border-border'
                }`}>{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Fingerprint className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Operational Ledger</p>
              <p className="text-xs font-medium text-slate-700">All operational actions are cryptographically hashed and push-verified.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] gap-2 bg-white">
              <FileText className="h-3.5 w-3.5" />
              Export Ops Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
