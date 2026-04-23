import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle, BrainCircuit, RefreshCw, Download } from 'lucide-react';

const breaks = [
  {
    id: 'BRK-0041', cusip: '023135106', security: 'Apple Inc.',
    broadridgeQty: 10500, custodianQty: 10000, diff: '+500', custodian: 'CIBC',
    aiTitle: 'T+1 Settlement Lag', aiBody: 'European trade executed pre-US open. Expect CIBC update by 4 PM.',
    confidence: 94, confColor: 'bg-green-100 text-green-800', diffColor: 'text-red-600',
  },
  {
    id: 'BRK-0042', cusip: '594918104', security: 'Microsoft Corp.',
    broadridgeQty: 5200, custodianQty: 5200, diff: '$0 / FX', custodian: 'BMO',
    aiTitle: 'FX Rate Mismatch', aiBody: 'Qty matches. CAD/USD rate applied differently. Verify BMO FX rate for Apr 22.',
    confidence: 78, confColor: 'bg-amber-100 text-amber-800', diffColor: 'text-amber-600',
  },
  {
    id: 'BRK-0043', cusip: '037833100', security: 'Amazon.com Inc.',
    broadridgeQty: 2000, custodianQty: 1800, diff: '+200', custodian: 'CIBC',
    aiTitle: 'Unknown — Manual Review', aiBody: 'No historical pattern match. Possible partial settlement. Escalate to ops team.',
    confidence: 41, confColor: 'bg-red-100 text-red-800', diffColor: 'text-red-600',
    lowConf: true,
  },
];

const isinMap = [
  { isin: 'US0231351067', cusip: '023135106', name: 'Apple Inc.', source: 'CIBC', time: '08:01 AM' },
  { isin: 'US5949181045', cusip: '594918104', name: 'Microsoft Corp.', source: 'BMO', time: '08:01 AM' },
  { isin: 'US0378331005', cusip: '037833100', name: 'Amazon.com Inc.', source: 'CIBC', time: '08:01 AM' },
];

export const SiebertRecon: React.FC = () => {
  const [resolved, setResolved] = useState<string[]>([]);
  const [escalated, setEscalated] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial · Workflow A</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Foreign Custodian Reconciliation</h1>
          <p className="text-muted-foreground mt-1">AI-assisted comparison of Broadridge positions vs. CIBC and BMO custodian feeds.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Run Reconciliation
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Positions Compared', value: '1,842', sub: 'CIBC + BMO vs. Broadridge', color: 'text-foreground' },
          { label: 'Matched', value: '1,839', sub: '99.8% match rate', color: 'text-green-600' },
          { label: 'Open Breaks', value: '3', sub: 'Require operator review', color: 'text-red-600' },
          { label: 'ISIN→CUSIP Mapped', value: '214', sub: 'Auto-mapped this run', color: 'text-amber-600' },
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

      {/* Breaks table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Open Breaks — Requires Review</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Break ID', 'CUSIP', 'Security', 'Broadridge Qty', 'Custodian Qty', 'Diff', 'Custodian', 'AI Suggestion', 'Confidence', 'Action'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {breaks.map((b) => {
                  const isResolved = resolved.includes(b.id);
                  const isEscalated = escalated.includes(b.id);
                  return (
                    <tr key={b.id} className={`border-b border-border/50 last:border-0 transition-colors ${isResolved ? 'bg-green-50/50' : isEscalated ? 'bg-red-50/50' : 'hover:bg-muted/30'}`}>
                      <td className="px-4 py-4 text-xs font-semibold">{b.id}</td>
                      <td className="px-4 py-4 text-xs font-mono">{b.cusip}</td>
                      <td className="px-4 py-4 text-xs">{b.security}</td>
                      <td className="px-4 py-4 text-xs">{b.broadridgeQty.toLocaleString()}</td>
                      <td className="px-4 py-4 text-xs">{b.custodianQty.toLocaleString()}</td>
                      <td className={`px-4 py-4 text-xs font-bold ${b.diffColor}`}>{b.diff}</td>
                      <td className="px-4 py-4 text-xs">{b.custodian}</td>
                      <td className="px-4 py-4 min-w-[220px]">
                        <div className={`rounded-lg border p-3 text-xs ${b.lowConf ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <BrainCircuit className={`h-3 w-3 ${b.lowConf ? 'text-amber-600' : 'text-blue-600'}`} />
                            <span className="font-semibold">{b.aiTitle}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{b.aiBody}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.confColor}`}>
                          {b.confidence}%
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold"><CheckCircle2 className="h-3 w-3" /> Approved</span>
                        ) : isEscalated ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold"><AlertCircle className="h-3 w-3" /> Escalated</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => setResolved(r => [...r, b.id])}>
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setEscalated(e => [...e, b.id])}>
                              Escalate
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ISIN Mapping Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">ISIN → CUSIP Mapping Log</CardTitle>
          <CardDescription className="text-xs">Mapping Engine — Auto-resolved identifier translations this run</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['ISIN', 'CUSIP', 'Security Name', 'Source', 'Mapped At'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isinMap.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono">{row.isin}</td>
                  <td className="px-4 py-3 text-xs font-mono">{row.cusip}</td>
                  <td className="px-4 py-3 text-xs">{row.name}</td>
                  <td className="px-4 py-3 text-xs">{row.source}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.time}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-xs text-muted-foreground">+ 211 more auto-mapped records</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiebertRecon;
