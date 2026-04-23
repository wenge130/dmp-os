import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Activity, Database, Cpu, HardDrive, FileText } from 'lucide-react';

const ingestionLog = [
  { file: 'broadridge_daily_20260423.txt', source: 'SFTP', received: '07:12 AM', size: '2.1 GB', status: 'Parsed', statusColor: 'bg-green-100 text-green-800' },
  { file: 'cibc_positions_20260423.csv', source: 'Email', received: '07:45 AM', size: '4.2 MB', status: 'Parsed', statusColor: 'bg-green-100 text-green-800' },
  { file: 'loannet_borrows_20260423.txt', source: 'SFTP', received: '08:02 AM', size: '18.7 MB', status: 'Parsed', statusColor: 'bg-green-100 text-green-800' },
  { file: 'bmo_positions_20260423.csv', source: 'Email', received: '—', size: '—', status: 'Awaiting', statusColor: 'bg-amber-100 text-amber-800' },
];

const parserJobs = [
  { job: 'Broadridge parse', model: 'Llama 4 (Together.ai)', duration: '4m 12s', tokens: '2.1M', status: 'Done', statusColor: 'bg-green-100 text-green-800' },
  { job: 'ISIN→CUSIP map', model: 'Llama 4 (Together.ai)', duration: '0m 38s', tokens: '142K', status: 'Done', statusColor: 'bg-green-100 text-green-800' },
  { job: 'LoanNet parse', model: 'Llama 4 (Together.ai)', duration: '1m 04s', tokens: '380K', status: 'Done', statusColor: 'bg-green-100 text-green-800' },
  { job: 'BMO parse', model: '—', duration: '—', tokens: '—', status: 'Queued', statusColor: 'bg-gray-100 text-gray-600' },
];

const fileTypes = [
  'Broadridge Daily Report',
  'CIBC Custodian File',
  'BMO Custodian File',
  'LoanNet Borrow/Loan File',
];

export const SiebertPipeline: React.FC = () => {
  const [selectedType, setSelectedType] = useState(fileTypes[0]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = () => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 8;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploading(false);
        setProgress(0);
      }
    }, 120);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial · Tier 1</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Data Pipeline Monitor</h1>
        <p className="text-muted-foreground mt-1">Ingestion, AI parsing, and StorJ archival status for all custodian data feeds.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Files Ingested Today', value: '4', sub: 'Broadridge, CIBC, BMO, LoanNet', color: 'text-green-600' },
          { icon: Cpu, label: 'Pages Parsed', value: '10,412', sub: 'via LLM on Modal GPU', color: 'text-foreground' },
          { icon: Database, label: 'Records Structured', value: '84,291', sub: 'written to PostgreSQL', color: 'text-green-600' },
          { icon: HardDrive, label: 'StorJ Archive', value: '130 TB', sub: 'dmt-finra + raw files', color: 'text-foreground' },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <k.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
              </div>
              <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion Log */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Ingestion Log</CardTitle>
              <Button variant="outline" size="sm" className="gap-2 h-7 text-xs">
                <Upload className="h-3 w-3" /> Upload Manual File
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['File', 'Source', 'Received', 'Size', 'Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ingestionLog.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground max-w-[160px] truncate">{row.file}</td>
                    <td className="px-4 py-3 text-xs">{row.source}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.received}</td>
                    <td className="px-4 py-3 text-xs">{row.size}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* AI Parser Jobs */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">AI Parser — Modal GPU Jobs</CardTitle>
            <CardDescription className="text-xs">LLM inference on Modal serverless GPU (A10G)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Job', 'Model', 'Duration', 'Tokens', 'Status'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parserJobs.map((row, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium">{row.job}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.model}</td>
                    <td className="px-4 py-3 text-xs">{row.duration}</td>
                    <td className="px-4 py-3 text-xs">{row.tokens}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Today's LLM cost: <strong>$0.52</strong> · Monthly projection: <strong>$54</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual File Ingestion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Manual File Ingestion</CardTitle>
          <CardDescription className="text-xs">Tier 1 — Ingestion Gateway · Drag & drop or select a file to process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-10 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Drag & drop a flat file here</p>
            <p className="text-xs text-muted-foreground mt-1">Supports: .txt, .csv, .dat, COBOL printouts, LoanNet exports</p>
            <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
          </div>
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">File Type</label>
              <select
                className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                {fileTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Report Date</label>
              <input type="date" defaultValue="2026-04-23" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background" />
            </div>
            <Button onClick={handleProcess} disabled={uploading} className="gap-2">
              {uploading ? 'Processing...' : 'Process File →'}
            </Button>
          </div>
          {uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Parsing with LLM…</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiebertPipeline;
