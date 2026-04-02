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
      {/* Broker-Dealer Routing Detail Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Broker-Dealer Routing Detail</CardTitle>
              <CardDescription className="text-[10px]">Q4 2024 — Order routing breakdown by market maker and execution venue</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1 text-[10px] h-7">
              <Search className="h-3 w-3" /> Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Broker-Dealer</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Orders</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Citadel %</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Virtu %</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Susquehanna %</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">G1X %</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg PFOF/Share</th>
                  <th className="text-right py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fill Rate</th>
                  <th className="text-left py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {[
                  { broker: 'Robinhood', orders: '142.3M', citadel: '45%', virtu: '28%', sus: '15%', g1x: '12%', pfof: '$0.0024', fill: '99.91%', status: 'Filed', statusClass: 'bg-green-100 text-green-700' },
                  { broker: 'Apex Clearing', orders: '98.7M', citadel: '38%', virtu: '32%', sus: '20%', g1x: '10%', pfof: '$0.0021', fill: '99.87%', status: 'Filed', statusClass: 'bg-green-100 text-green-700' },
                  { broker: 'Webull', orders: '67.4M', citadel: '42%', virtu: '30%', sus: '18%', g1x: '10%', pfof: '$0.0022', fill: '99.84%', status: 'Filed', statusClass: 'bg-green-100 text-green-700' },
                  { broker: 'E*Trade', orders: '54.1M', citadel: '35%', virtu: '25%', sus: '25%', g1x: '15%', pfof: '$0.0019', fill: '99.79%', status: 'Filed', statusClass: 'bg-green-100 text-green-700' },
                  { broker: 'TradeStation', orders: '31.2M', citadel: '40%', virtu: '33%', sus: '17%', g1x: '10%', pfof: '$0.0020', fill: '99.82%', status: 'Pending', statusClass: 'bg-amber-100 text-amber-700' },
                  { broker: 'tastytrade', orders: '22.8M', citadel: '36%', virtu: '29%', sus: '22%', g1x: '13%', pfof: '$0.0018', fill: '99.76%', status: 'Pending', statusClass: 'bg-amber-100 text-amber-700' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="py-2 pr-4 font-medium">{row.broker}</td>
                    <td className="py-2 text-right font-mono">{row.orders}</td>
                    <td className="py-2 text-right font-mono text-blue-600">{row.citadel}</td>
                    <td className="py-2 text-right font-mono text-purple-600">{row.virtu}</td>
                    <td className="py-2 text-right font-mono text-pink-600">{row.sus}</td>
                    <td className="py-2 text-right font-mono text-orange-600">{row.g1x}</td>
                    <td className="py-2 text-right font-mono">{row.pfof}</td>
                    <td className="py-2 text-right font-mono">{row.fill}</td>
                    <td className="py-2">
                      <Badge className={`${row.statusClass} hover:${row.statusClass} border-none h-5 text-[10px]`}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Execution Quality Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Market Maker Performance Summary</CardTitle>
            <CardDescription className="text-[10px]">Aggregate execution quality metrics by venue — Q4 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Citadel Securities', share: '38.5%', pfof: '$0.0024', priceImprove: '72.3%', fillRate: '99.91%', color: 'bg-blue-500' },
                { name: 'Virtu Financial', share: '29.5%', pfof: '$0.0020', priceImprove: '68.1%', fillRate: '99.85%', color: 'bg-purple-500' },
                { name: 'Susquehanna (SIG)', share: '19.0%', pfof: '$0.0018', priceImprove: '65.4%', fillRate: '99.80%', color: 'bg-pink-500' },
                { name: 'G1X Execution', share: '13.0%', pfof: '$0.0016', priceImprove: '61.2%', fillRate: '99.72%', color: 'bg-orange-500' },
              ].map((mm, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/10">
                  <div className={`w-2 h-8 rounded-full ${mm.color} shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{mm.name}</p>
                    <p className="text-[10px] text-muted-foreground">Market share: {mm.share}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right shrink-0">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">PFOF/Share</p>
                      <p className="text-xs font-mono font-medium">{mm.pfof}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Price Improve</p>
                      <p className="text-xs font-mono font-medium text-green-600">{mm.priceImprove}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Fill Rate</p>
                      <p className="text-xs font-mono font-medium">{mm.fillRate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">606 Filing Compliance Status</CardTitle>
            <CardDescription className="text-[10px]">Quarterly filing deadlines and submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { period: 'Q4 2024 (Oct–Dec)', due: 'Feb 1, 2025', filed: 'Jan 28, 2025', status: 'Filed On Time', statusClass: 'bg-green-100 text-green-700' },
                { period: 'Q3 2024 (Jul–Sep)', due: 'Nov 1, 2024', filed: 'Oct 30, 2024', status: 'Filed On Time', statusClass: 'bg-green-100 text-green-700' },
                { period: 'Q2 2024 (Apr–Jun)', due: 'Aug 1, 2024', filed: 'Jul 31, 2024', status: 'Filed On Time', statusClass: 'bg-green-100 text-green-700' },
                { period: 'Q1 2024 (Jan–Mar)', due: 'May 1, 2024', filed: 'Apr 29, 2024', status: 'Filed On Time', statusClass: 'bg-green-100 text-green-700' },
                { period: 'Q1 2025 (Jan–Mar)', due: 'May 1, 2025', filed: '—', status: 'Upcoming', statusClass: 'bg-slate-100 text-slate-600' },
              ].map((filing, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-xs font-medium">{filing.period}</p>
                    <p className="text-[10px] text-muted-foreground">Due: {filing.due} · Filed: {filing.filed}</p>
                  </div>
                  <Badge className={`${filing.statusClass} hover:${filing.statusClass} border-none h-5 text-[10px] shrink-0`}>{filing.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
