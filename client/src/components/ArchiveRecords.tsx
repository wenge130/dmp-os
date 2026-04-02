import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Archive, 
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
  History
} from 'lucide-react';

const recordData = [
  { id: 1, name: 'Daily Trade Log 2026-04-01', type: 'CSV', user: '@artie', time: '09:30 AM', hash: '0x82f...d4e' },
  { id: 2, name: 'Net Capital Report Mar 2026', type: 'PDF', user: '@roger', time: '08:45 AM', hash: '0x3a2...b1c' },
  { id: 3, name: 'CAT Reporting Submission Batch 01', type: 'JSON', user: 'System', time: '08:15 AM', hash: '0x1e5...f9d' },
  { id: 4, name: 'Brokerage Ops Review 2026-04-01', type: 'DOCX', user: '@don', time: '07:30 AM', hash: '0x92c...f1a' },
];

export const ArchiveRecords: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archive & Records</h1>
          <p className="text-muted-foreground mt-1">Immutable recordkeeping and digital archiving in compliance with SEC Rule 17a-4.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Lock className="h-4 w-4" />
            WORM Status
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Bulk Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-[10px] text-blue-500 flex items-center mt-1 font-medium">
              <Database className="h-3 w-3 mr-1" /> 12.4 TB Storage
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Integrity Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-[10px] text-green-500 flex items-center mt-1 font-medium">
              <CheckCircle2 className="h-3 w-3 mr-1" /> All Hashes Verified
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Retention Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 Years</div>
            <p className="text-[10px] text-amber-500 flex items-center mt-1 font-medium">
              SEC Rule 17a-4 compliant
            </p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Daily Archiving</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2k</div>
            <p className="text-[10px] text-purple-500 flex items-center mt-1 font-medium">
              <Activity className="h-3 w-3 mr-1" /> Automated Sync
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records by name, user, or hash..." className="pl-9 h-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-9 gap-2 border border-border">
              <Filter className="h-4 w-4" />
              Filter Records
            </Button>
            <Button variant="ghost" size="sm" className="h-9 gap-2 border border-border">
              <History className="h-4 w-4" />
              Audit Trail
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recordData.map((record) => (
            <Card key={record.id} className="border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-2 bg-white rounded-lg border border-border">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Record Name</p>
                    <p className="text-sm font-bold">{record.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Type</p>
                    <Badge variant="outline" className="text-[10px] py-0">{record.type}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Created By</p>
                    <p className="text-sm">{record.user}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Time</p>
                    <p className="text-sm">{record.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <p className="text-[10px] font-mono text-muted-foreground/60">{record.hash}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
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
              <Lock className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">WORM Compliance</p>
              <p className="text-xs font-medium text-slate-700">All records are stored in a Write-Once-Read-Many (WORM) format for regulatory compliance.</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
            Compliant with SEC 17a-4
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
