import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, Download, CheckCircle2, Search, Lock } from 'lucide-react';

const wspRules = [
  { rule: 'FINRA 4311 — Stock Borrow/Loan', coverage: 100, color: 'bg-green-500' },
  { rule: 'FINRA 3110 — Supervision', coverage: 98, color: 'bg-green-500' },
  { rule: 'FINRA 4512 — Customer Account Info', coverage: 100, color: 'bg-green-500' },
  { rule: 'FINRA 3310 — AML', coverage: 95, color: 'bg-amber-500' },
  { rule: 'FINRA 4370 — BCP', coverage: 100, color: 'bg-green-500' },
];

const records = [
  { id: 'AUD-14821', type: 'Recon', typeColor: 'bg-blue-100 text-blue-800', desc: 'Custodian Recon — CIBC — BRK-0041 Approved', rule: 'FINRA 3110', ts: 'Apr 23, 11:32 AM', hash: 'a3f9d2…c841', storage: 'StorJ', storageColor: 'bg-purple-100 text-purple-800' },
  { id: 'AUD-14820', type: 'Signed Doc', typeColor: 'bg-green-100 text-green-800', desc: '30-Day Borrow Letter — Citadel — SB-2031 Executed', rule: 'FINRA 4311', ts: 'Apr 22, 03:14 PM', hash: 'b7e1a4…f219', storage: 'Wasabi WORM', storageColor: 'bg-amber-100 text-amber-800' },
  { id: 'AUD-14819', type: 'Trade Break', typeColor: 'bg-red-100 text-red-800', desc: 'Trade Break TBK-8800 — AI Fix Applied — TRD-44188', rule: 'FINRA 3110', ts: 'Apr 22, 11:05 AM', hash: 'c2d8f1…9a03', storage: 'StorJ', storageColor: 'bg-purple-100 text-purple-800' },
  { id: 'AUD-14818', type: 'FINRA Data', typeColor: 'bg-gray-100 text-gray-700', desc: 'FINRA Rulebook Snapshot — 29 WSP Rules', rule: 'All', ts: 'Apr 23, 11:31 AM', hash: 'e9c3b2…1d77', storage: 'StorJ', storageColor: 'bg-purple-100 text-purple-800' },
];

export const SiebertAudit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordType, setRecordType] = useState('All Types');
  const [wspRule, setWspRule] = useState('All Rules');
  const [verified, setVerified] = useState(false);

  const filtered = records.filter(r => {
    const matchSearch = !searchTerm || r.desc.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = recordType === 'All Types' || r.type === recordType;
    const matchRule = wspRule === 'All Rules' || r.rule.includes(wspRule.split(' ')[1]);
    return matchSearch && matchType && matchRule;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial · Compliance</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Audit & Evidence Vault</h1>
          <p className="text-muted-foreground mt-1">Immutable, cryptographically-hashed compliance records — StorJ + Wasabi WORM.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export for Regulator
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setVerified(true)}>
            <Shield className="h-4 w-4" />
            {verified ? 'All Hashes Verified ✓' : 'Verify Hash Integrity'}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records Archived', value: '14,821', sub: 'Immutable · StorJ + Wasabi', color: 'text-green-600' },
          { label: 'Documents Signed', value: '312', sub: 'PandaDoc e-signatures', color: 'text-green-600' },
          { label: 'WSP Rules Covered', value: '29', sub: 'FINRA broker-dealer rules', color: 'text-foreground' },
          { label: 'Regulatory Readiness', value: '100%', sub: 'All records hash-verified', color: 'text-green-600' },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-5 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
              <p className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Search Audit Records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  className="w-full border border-border rounded-md pl-9 pr-3 py-2 text-sm bg-background"
                  placeholder="Trade ID, CUSIP, counterparty, WSP rule…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="border border-border rounded-md px-3 py-2 text-sm bg-background" value={recordType} onChange={e => setRecordType(e.target.value)}>
                <option>All Types</option>
                <option>Recon</option>
                <option>Signed Doc</option>
                <option>Trade Break</option>
                <option>FINRA Data</option>
              </select>
              <Button size="sm">Search</Button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date From</label>
                <input type="date" defaultValue="2026-01-01" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Date To</label>
                <input type="date" defaultValue="2026-04-23" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">WSP Rule</label>
                <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background" value={wspRule} onChange={e => setWspRule(e.target.value)}>
                  <option>All Rules</option>
                  <option>FINRA 4311 — Stock Borrow</option>
                  <option>FINRA 3110 — Supervision</option>
                  <option>FINRA 4370 — BCP</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WSP Coverage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">WSP Compliance Coverage</CardTitle>
            <CardDescription className="text-xs">Evidence on file per FINRA broker-dealer rule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wspRules.map((r) => (
              <div key={r.rule}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span>{r.rule}</span>
                  <span className="font-semibold">{r.coverage}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.coverage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audit Records Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Audit Records — Most Recent</CardTitle>
            {verified && (
              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <CheckCircle2 className="h-3 w-3" /> All hashes verified
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Record ID', 'Type', 'Description', 'WSP Rule', 'Timestamp', 'Hash (SHA-256)', 'Storage', 'Action'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold">{r.id}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.typeColor}`}>{r.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[220px]">{r.desc}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{r.rule}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{r.ts}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <code className="text-[10px] text-muted-foreground font-mono">{r.hash}</code>
                        {verified && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.storageColor}`}>{r.storage}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-xs text-muted-foreground">
                    Showing {filtered.length} of 14,821 records · <button className="text-primary underline">Load more</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiebertAudit;
