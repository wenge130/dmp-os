import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const allBreaks = [
  {
    id: 'TBK-8821', tradeId: 'TRD-44201', security: 'MSFT',
    breakType: 'Missing Booking', breakColor: 'bg-red-100 text-red-800',
    rootCause: 'Trade booked in OMS but not reflected in Broadridge EOD file',
    aiTitle: 'Re-submit to Broadridge',
    aiBody: 'Re-submit TRD-44201 via Broadridge API with settlement date T+2 = Apr 25.',
    confidence: 92, confColor: 'bg-green-100 text-green-800', lowConf: false,
  },
  {
    id: 'TBK-8822', tradeId: 'TRD-44198', security: 'AMZN',
    breakType: 'Wrong Settle Date', breakColor: 'bg-amber-100 text-amber-800',
    rootCause: 'Settlement date recorded as T+3 instead of T+2',
    aiTitle: 'Amend Settlement Date',
    aiBody: 'Amend TRD-44198 settlement date from Apr 26 → Apr 25.',
    confidence: 96, confColor: 'bg-green-100 text-green-800', lowConf: false,
  },
  {
    id: 'TBK-8823', tradeId: 'TRD-44155', security: 'GOOGL',
    breakType: 'Incorrect Account', breakColor: 'bg-red-100 text-red-800',
    rootCause: 'Trade booked to account 7821 — should be 7812',
    aiTitle: 'Verify Account Number',
    aiBody: 'Possible transposition error. Verify with trader before amending.',
    confidence: 67, confColor: 'bg-amber-100 text-amber-800', lowConf: true,
  },
  {
    id: 'TBK-8824', tradeId: 'TRD-44190', security: 'NVDA',
    breakType: 'Missing Booking', breakColor: 'bg-red-100 text-red-800',
    rootCause: 'Block trade split not reflected in clearing system',
    aiTitle: 'Re-allocate Block Trade',
    aiBody: 'Re-submit allocation for TRD-44190 with correct sub-account split.',
    confidence: 88, confColor: 'bg-green-100 text-green-800', lowConf: false,
  },
];

export const SiebertBreaks: React.FC = () => {
  const [fixed, setFixed] = useState<string[]>([]);
  const [escalated, setEscalated] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('All Types');
  const [filterConf, setFilterConf] = useState('All');

  const filtered = allBreaks.filter(b => {
    const typeMatch = filterType === 'All Types' || b.breakType === filterType;
    const confMatch = filterConf === 'All' ||
      (filterConf === 'High (≥90%)' && b.confidence >= 90) ||
      (filterConf === 'Medium (60-89%)' && b.confidence >= 60 && b.confidence < 90) ||
      (filterConf === 'Low (<60%)' && b.confidence < 60);
    return typeMatch && confMatch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial · Workflow C</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Trade Break Resolution</h1>
          <p className="text-muted-foreground mt-1">AI root-cause analysis and corrective action suggestions for Broadridge trade breaks.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export to OMS
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Report Pages Parsed', value: '10,412', sub: 'Broadridge daily report', color: 'text-foreground' },
          { label: 'Open Breaks', value: '12', sub: 'Missing bookings identified', color: 'text-red-600' },
          { label: 'AI-Suggested', value: '10', sub: 'Corrective actions ready', color: 'text-green-600' },
          { label: 'Escalated', value: '2', sub: 'Low AI confidence', color: 'text-amber-600' },
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3 items-end flex-wrap">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Break Type</label>
              <select className="border border-border rounded-md px-3 py-2 text-sm bg-background" value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option>All Types</option>
                <option>Missing Booking</option>
                <option>Wrong Settle Date</option>
                <option>Incorrect Account</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI Confidence</label>
              <select className="border border-border rounded-md px-3 py-2 text-sm bg-background" value={filterConf} onChange={e => setFilterConf(e.target.value)}>
                <option>All</option>
                <option>High (≥90%)</option>
                <option>Medium (60-89%)</option>
                <option>Low (&lt;60%)</option>
              </select>
            </div>
            <Button size="sm" onClick={() => { setFilterType('All Types'); setFilterConf('All'); }} variant="outline">
              Reset Filters
            </Button>
            <div className="ml-auto">
              <Button size="sm" className="gap-2" onClick={() => {
                const highConf = filtered.filter(b => b.confidence >= 90 && !fixed.includes(b.id) && !escalated.includes(b.id)).map(b => b.id);
                setFixed(f => [...f, ...highConf]);
              }}>
                <CheckCircle2 className="h-4 w-4" /> Bulk Approve AI Suggestions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breaks Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Open Trade Breaks ({filtered.length} shown)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Break ID', 'Trade ID', 'Security', 'Break Type', 'AI Root Cause', 'Suggested Fix', 'Confidence', 'Action'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const isFixed = fixed.includes(b.id);
                  const isEscalated = escalated.includes(b.id);
                  return (
                    <tr key={b.id} className={`border-b border-border/50 last:border-0 transition-colors ${isFixed ? 'bg-green-50/50' : isEscalated ? 'bg-red-50/50' : 'hover:bg-muted/30'}`}>
                      <td className="px-4 py-4 text-xs font-semibold">{b.id}</td>
                      <td className="px-4 py-4 text-xs font-mono text-muted-foreground">{b.tradeId}</td>
                      <td className="px-4 py-4 text-xs font-semibold">{b.security}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.breakColor}`}>
                          {b.breakType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground max-w-[180px]">{b.rootCause}</td>
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
                        {isFixed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold"><CheckCircle2 className="h-3 w-3" /> Fixed</span>
                        ) : isEscalated ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold"><AlertCircle className="h-3 w-3" /> Escalated</span>
                        ) : b.lowConf ? (
                          <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50" onClick={() => setEscalated(e => [...e, b.id])}>
                            Escalate
                          </Button>
                        ) : (
                          <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => setFixed(f => [...f, b.id])}>
                            Apply Fix
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length < allBreaks.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-center text-xs text-muted-foreground">
                      Showing {filtered.length} of 12 open breaks · Adjust filters to see more
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiebertBreaks;
