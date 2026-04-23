import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, CheckCircle2, Clock, Send } from 'lucide-react';

const steps = [
  { label: 'LoanNet File Ingested', done: true },
  { label: 'AI Parsed Records', done: true },
  { label: '≥30 Day Records Identified', done: true },
  { label: 'PDF Letters Generated', done: true },
  { label: 'Pushed to PandaDoc', active: true },
  { label: 'Signatures Collected', done: false },
  { label: 'Stored in Audit Vault', done: false },
];

const pending = [
  { id: 'SB-2041', counterparty: 'Goldman Sachs', security: 'TSLA', qty: '5,000', since: 'Mar 21', days: 33, pandaStatus: 'Sent · Unopened', pandaColor: 'bg-amber-100 text-amber-800' },
  { id: 'SB-2042', counterparty: 'Morgan Stanley', security: 'NVDA', qty: '2,500', since: 'Mar 22', days: 32, pandaStatus: 'Opened · Pending', pandaColor: 'bg-blue-100 text-blue-800' },
  { id: 'SB-2043', counterparty: 'Citadel Securities', security: 'AAPL', qty: '8,000', since: 'Mar 23', days: 31, pandaStatus: 'Sent · Unopened', pandaColor: 'bg-amber-100 text-amber-800' },
];

const timeline = [
  { text: 'Letter generated — AI parsed LoanNet record SB-2041', time: '08:02 AM', done: true },
  { text: 'PDF created — FINRA Rule 4311 template applied', time: '08:03 AM', done: true },
  { text: 'Pushed to PandaDoc — Document ID: PD-9921', time: '08:04 AM', done: true },
  { text: 'Email sent to Goldman Sachs — Awaiting open', time: '08:05 AM', done: true },
  { text: 'Signature collected — Pending', time: '—', done: false },
  { text: 'Stored in Audit Vault — Pending', time: '—', done: false },
];

export const SiebertBorrow: React.FC = () => {
  const [sent, setSent] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Siebert Financial · Workflow B</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">30-Day Stock Borrow Confirmations</h1>
          <p className="text-muted-foreground mt-1">FINRA Rule 4311 — AI-generated confirmation letters with PandaDoc e-signature workflow.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh PandaDoc Status
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Borrows ≥ 30 Days', value: '7', sub: 'Require FINRA confirmation', color: 'text-red-600' },
          { label: 'Letters Generated', value: '7', sub: 'Awaiting e-signature', color: 'text-amber-600' },
          { label: 'Signed This Week', value: '12', sub: 'Stored in Audit Vault', color: 'text-green-600' },
          { label: 'Avg. Sign Time', value: '4.2h', sub: 'via PandaDoc', color: 'text-foreground' },
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

      {/* Process Stepper */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Workflow B — Process Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 relative">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {i < steps.length - 1 && (
                  <div className={`absolute top-3.5 left-1/2 w-full h-0.5 z-0 ${s.done ? 'bg-green-500' : 'bg-border'}`} />
                )}
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 relative ${
                  s.done ? 'bg-green-500 border-green-500 text-white' :
                  s.active ? 'bg-primary border-primary text-primary-foreground' :
                  'bg-background border-border text-muted-foreground'
                }`}>
                  {s.done ? '✓' : i + 1}
                </div>
                <p className={`text-[10px] text-center mt-2 max-w-[72px] leading-tight ${s.active ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Confirmations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Pending Confirmations — Awaiting Signature</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Record ID', 'Counterparty', 'Security', 'Qty', 'Open Since', 'Days Open', 'Letter', 'PandaDoc Status', 'Action'].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((row) => (
                  <tr key={row.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold">{row.id}</td>
                    <td className="px-4 py-3 text-xs">{row.counterparty}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{row.security}</td>
                    <td className="px-4 py-3 text-xs">{row.qty}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{row.since}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.days >= 32 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.days} days
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <FileText className="h-3 w-3" /> View PDF
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.pandaColor}`}>
                        {row.pandaStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sent.includes(row.id) ? (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Sent</span>
                      ) : (
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setSent(s => [...s, row.id])}>
                          <Send className="h-3 w-3" /> Resend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={9} className="px-4 py-3 text-center text-xs text-muted-foreground">+ 4 more pending records</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Letter Preview + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Generated Letter Preview</CardTitle>
            <CardDescription className="text-xs">Document Generator output — Goldman Sachs · SB-2041</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-5 bg-muted/10 text-sm space-y-3 font-serif">
              <div className="text-right text-xs text-muted-foreground">April 23, 2026</div>
              <div>
                <p className="font-bold">Goldman Sachs & Co. LLC</p>
                <p className="text-xs text-muted-foreground">200 West Street, New York, NY 10282</p>
              </div>
              <hr className="border-border" />
              <p className="font-semibold text-xs">Re: 30-Day Stock Borrow Confirmation — TSLA (CUSIP: 88160R101)</p>
              <p className="text-xs leading-relaxed">Dear Counterparty,</p>
              <p className="text-xs leading-relaxed">Pursuant to FINRA Rule 4311, this letter confirms the open stock borrow position of <strong>5,000 shares</strong> of Tesla Inc. (CUSIP: 88160R101), open since <strong>March 21, 2026</strong>.</p>
              <p className="text-xs leading-relaxed">Please sign below to confirm the continued arrangement.</p>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Authorized Signature</p>
                <div className="h-8 border-b border-border mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">PandaDoc Integration Status</CardTitle>
            <CardDescription className="text-xs">Document ID: PD-9921 · Goldman Sachs · SB-2041</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border space-y-4 ml-2">
              {timeline.map((item, i) => (
                <li key={i} className="ml-5">
                  <span className={`absolute -left-2 flex items-center justify-center w-4 h-4 rounded-full ${item.done ? 'bg-green-500' : 'bg-border'}`}>
                    {item.done && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <p className="text-xs font-medium">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiebertBorrow;
