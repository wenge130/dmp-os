import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
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
  History,
  TrendingUp,
  Cpu,
  Wifi,
  Zap,
  Link
} from 'lucide-react';

const feedData = [
  { name: 'FINRA 606 API', status: 'Connected', latency: '45ms', throughput: '1.2M req/hr', hash: '0x82f...d4e' },
  { name: 'SEC EDGAR Real-time', status: 'Connected', latency: '12ms', throughput: '450k req/hr', hash: '0x3a2...b1c' },
  { name: 'Broker Trade Feed (Apex)', status: 'Connected', latency: '150ms', throughput: '12.4M msg/day', hash: '0x1e5...f9d' },
  { name: 'Public Filings Search', status: 'Connected', latency: '850ms', throughput: '1.2M req/hr', hash: '0x92c...f1a' },
  { name: 'AML/KYC Watchlist', status: 'Connected', latency: '5ms', throughput: '1.2M req/hr', hash: '0x5b3...e2f' },
];

export const DataFeeds: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Feeds</h1>
          <p className="text-muted-foreground mt-1">Management and monitoring of real-time regulatory and operational data integrations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Link className="h-4 w-4" />
            Connect New Feed
          </Button>
          <Button size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage API Keys
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Active Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> All Operational
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Daily Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2M</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Feed Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42ms</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              <Zap className="h-3 w-3 mr-1" /> Optimized
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Data Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-[10px] text-purple-500 flex items-center mt-1 font-medium">
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified Hashes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-4">
          {feedData.map((feed) => (
            <Card key={feed.name} className="border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="p-2 bg-white rounded-lg border border-border">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Feed Name</p>
                    <p className="text-sm font-bold">{feed.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Status</p>
                    <Badge variant="outline" className="text-[10px] py-0 bg-green-100 text-green-700 border-none">{feed.status}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Latency</p>
                    <p className="text-sm">{feed.latency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Throughput</p>
                    <p className="text-sm">{feed.throughput}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <p className="text-[10px] font-mono text-muted-foreground/60">{feed.hash}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Database className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Data Ledger Sync</p>
              <p className="text-xs font-medium text-slate-700">All incoming data feeds are automatically hashed and pushed to the digital ledger for full auditability.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            Real-time Audit Trail
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
