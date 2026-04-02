import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Info, Search, Filter, Download } from 'lucide-react';

const pfofData = [
  { broker: 'Robinhood', citadel: 45, virtu: 28, susquehanna: 15, g1x: 12 },
  { broker: 'Apex', citadel: 38, virtu: 32, susquehanna: 20, g1x: 10 },
  { broker: 'Webull', citadel: 42, virtu: 30, susquehanna: 18, g1x: 10 },
  { broker: 'E*Trade', citadel: 35, virtu: 25, susquehanna: 25, g1x: 15 },
];

const historicalTrends = [
  { month: 'Q1 24', robinhood: 42, apex: 35, webull: 40 },
  { month: 'Q2 24', robinhood: 44, apex: 36, webull: 41 },
  { month: 'Q3 24', robinhood: 43, apex: 38, webull: 42 },
  { month: 'Q4 24', robinhood: 45, apex: 38, webull: 42 },
];

export const Dashboard606: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">606 Comparative Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Payment for Order Flow (PFOF) & Routing Analysis across Broker-Dealers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export XML
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total PFOF Market Vol (Est.)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4B</div>
            <p className="text-xs text-blue-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last quarter
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Avg. Execution Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.85%</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +0.02% industry avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Top Market Maker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Citadel Securities</div>
            <p className="text-xs text-purple-500 flex items-center mt-1">
              38.5% market share
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PFOF Breakdown by Venue */}
        <Card>
          <CardHeader>
            <CardTitle>PFOF Allocation by Venue (%)</CardTitle>
            <CardDescription>Comparison of top broker-dealers and their primary market makers</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pfofData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="broker" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="citadel" name="Citadel" fill="#2563eb" stackId="a" />
                <Bar dataKey="virtu" name="Virtu" fill="#7c3aed" stackId="a" />
                <Bar dataKey="susquehanna" name="Susquehanna" fill="#db2777" stackId="a" />
                <Bar dataKey="g1x" name="G1X" fill="#ea580c" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Quarterly PFOF Trends</CardTitle>
            <CardDescription>Total PFOF received over the last 4 quarters (Millions $)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="robinhood" name="Robinhood" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="apex" name="Apex" stroke="#7c3aed" strokeWidth={2} />
                <Line type="monotone" dataKey="webull" name="Webull" stroke="#db2777" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Context & Insights Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">DMP AI Contextual Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-blue-600">DMP AI:</span> Analysis of Q4 606 reports indicates that Citadel maintains a premium payment structure for Robinhood relative to Apex. Historical data suggests this spread typically compresses during high-volatility periods. For firms advising on routing strategies, the 15% growth in Susquehanna's share at E*Trade represents a significant trend for the upcoming partner review.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Anomaly</Badge>
                <div>
                  <p className="text-sm font-medium">Robinhood G1X Spike</p>
                  <p className="text-xs text-muted-foreground">PFOF from G1X Execution Services up 8% in Dec 2024.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Trend</Badge>
                <div>
                  <p className="text-sm font-medium">Virtu Market Share Shift</p>
                  <p className="text-xs text-muted-foreground">Virtu capturing more volume from Apex mid-tier clients.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
