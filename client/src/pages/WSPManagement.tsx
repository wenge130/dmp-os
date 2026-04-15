import { useState, useEffect, useCallback } from "react";
import { wspApi, finraApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Search, Plus, Download, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, ChevronDown, Edit2, Send, Shield,
  BookOpen, Users, BarChart2, ArrowLeft, RefreshCw, Bell,
  CheckSquare, XCircle, Eye, History, Upload, Zap, Tag,
  AlertCircle, FileCheck, UserCheck, Calendar, Hash, Lock,
  ExternalLink, MessageSquare, Save, MoreHorizontal, Radio, ChevronUp
} from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "library" | "editor" | "attestation" | "gap-analysis";

interface SubManual {
  id: string;
  title: string;
  sections: number;
  completion: number;
  lastUpdated: string;
  supervisor: string;
  status: "Current" | "Needs Review" | "Overdue";
  version: string;
}

interface AttestationRow {
  id: string;
  wsp: string;
  assignee: string;
  role: string;
  dueDate: string;
  status: "Completed" | "Pending" | "Overdue";
  version: string;
  completedDate?: string;
}

interface GapFinding {
  id: string;
  category: "Missing" | "Outdated" | "Reg BI" | "Recommended";
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  rule: string;
  wsp: string;
  action: string;
}

// ─── FINRA Real-Time Alert Data ─────────────────────────────────────────────

interface FinraAlert {
  id: string;
  manualId: string;         // which sub-manual is affected
  severity: "High" | "Medium" | "Low";
  rule: string;
  summary: string;
  detail: string;
  source: string;
  receivedAt: string;
  affectedSection: string;
}

const finraAlerts: FinraAlert[] = [
  {
    id: "fa1",
    manualId: "comm",
    severity: "High",
    rule: "FINRA Rule 2210 (Regulatory Notice 26-04)",
    summary: "New digital communications supervision requirements effective June 1, 2026",
    detail: "FINRA Regulatory Notice 26-04 introduces expanded supervision obligations for AI-generated communications and social media. Firms must update WSPs to include specific review cadence and retention procedures for AI-assisted content by June 1, 2026.",
    source: "FINRA Rulebook API",
    receivedAt: "2 min ago",
    affectedSection: "Section 3.1 — Digital Communications Review",
  },
  {
    id: "fa2",
    manualId: "rb",
    severity: "Medium",
    rule: "SEC Reg BI — Staff Bulletin 2026-01",
    summary: "SEC staff guidance on product recommendation documentation updated",
    detail: "SEC Staff Bulletin 2026-01 clarifies documentation requirements for Reg BI product recommendations, specifically requiring firms to retain the rationale for each recommendation in a structured, retrievable format. Current WSP section 5.4 does not meet this standard.",
    source: "FINRA Notification API",
    receivedAt: "18 min ago",
    affectedSection: "Section 5.4 — Product Recommendation Documentation",
  },
  {
    id: "fa3",
    manualId: "da",
    severity: "High",
    rule: "FINRA Rule 3110 — Digital Assets Guidance (Notice 26-07)",
    summary: "FINRA issues new digital asset suitability supervision guidance",
    detail: "FINRA Notice 26-07 provides specific guidance on supervisory procedures for digital asset suitability determinations. Firms offering digital assets must establish written procedures addressing risk disclosure, suitability review, and approval workflows by Q3 2026.",
    source: "FINRA Rulebook API",
    receivedAt: "1 hr ago",
    affectedSection: "Section 6.3 — Digital Asset Suitability Review (Missing)",
  },
];

// ─── Static Data ─────────────────────────────────────────────────────────────

const subManuals: SubManual[] = [
  { id: "gs", title: "General Supervision", sections: 12, completion: 100, lastUpdated: "Apr 1, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v3.2" },
  { id: "rb", title: "Retail Brokerage", sections: 18, completion: 88, lastUpdated: "Mar 28, 2026", supervisor: "James Whitfield", status: "Needs Review", version: "v2.9" },
  { id: "aml", title: "AML / CIP / CDD", sections: 15, completion: 100, lastUpdated: "Apr 2, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v4.1" },
  { id: "comm", title: "Communications Supervision", sections: 9, completion: 67, lastUpdated: "Feb 14, 2026", supervisor: "Dana Park", status: "Overdue", version: "v1.8" },
  { id: "rk", title: "Recordkeeping", sections: 11, completion: 100, lastUpdated: "Mar 15, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v2.5" },
  { id: "hs", title: "Heightened Supervision", sections: 7, completion: 71, lastUpdated: "Jan 30, 2026", supervisor: "James Whitfield", status: "Needs Review", version: "v1.3" },
  { id: "regbi", title: "Regulation Best Interest", sections: 14, completion: 93, lastUpdated: "Apr 3, 2026", supervisor: "Sarah Chen (CCO)", status: "Current", version: "v2.0" },
  { id: "da", title: "Digital Assets", sections: 6, completion: 50, lastUpdated: "Mar 5, 2026", supervisor: "Unassigned", status: "Needs Review", version: "v0.9" },
];

const attestations: AttestationRow[] = [
  { id: "a1", wsp: "General Supervision", assignee: "James Whitfield", role: "Branch Manager", dueDate: "Apr 10, 2026", status: "Pending", version: "v3.2" },
  { id: "a2", wsp: "Retail Brokerage", assignee: "Dana Park", role: "Dept. Head", dueDate: "Apr 8, 2026", status: "Overdue", version: "v2.9" },
  { id: "a3", wsp: "AML / CIP / CDD", assignee: "James Whitfield", role: "Branch Manager", dueDate: "Apr 5, 2026", status: "Completed", version: "v4.1", completedDate: "Apr 4, 2026" },
  { id: "a4", wsp: "Regulation Best Interest", assignee: "Marcus Lee", role: "Supervisor", dueDate: "Apr 12, 2026", status: "Pending", version: "v2.0" },
  { id: "a5", wsp: "Recordkeeping", assignee: "Dana Park", role: "Dept. Head", dueDate: "Apr 3, 2026", status: "Completed", version: "v2.5", completedDate: "Apr 2, 2026" },
  { id: "a6", wsp: "Communications Supervision", assignee: "Marcus Lee", role: "Supervisor", dueDate: "Mar 31, 2026", status: "Overdue", version: "v1.8" },
  { id: "a7", wsp: "Heightened Supervision", assignee: "Sarah Chen", role: "CCO", dueDate: "Apr 15, 2026", status: "Pending", version: "v1.3" },
];

const gapFindings: GapFinding[] = [
  {
    id: "g1", category: "Missing", severity: "High",
    title: "No procedure for digital asset suitability review",
    description: "FINRA Rule 3110(b) requires specific supervisory procedures for each business activity. Digital asset suitability is not addressed in any current sub-manual.",
    rule: "FINRA Rule 3110(b)", wsp: "Digital Assets", action: "Draft new section 6.3 covering digital asset suitability review and approval workflow."
  },
  {
    id: "g2", category: "Outdated", severity: "High",
    title: "Communications Supervision references superseded FINRA Rule 2210",
    description: "Section 3.1 of Communications Supervision cites FINRA Rule 2210 as amended in 2021. The 2023 amendment (effective Jan 2024) introduced new digital communications requirements not reflected here.",
    rule: "FINRA Rule 2210 (2023 Amendment)", wsp: "Communications Supervision", action: "Update section 3.1 to incorporate 2023 digital communications requirements."
  },
  {
    id: "g3", category: "Reg BI", severity: "High",
    title: "Reg BI conflict of interest disclosure procedure incomplete",
    description: "SEC 2026 Examination Priorities cite inadequate conflict-of-interest disclosure as a primary Reg BI deficiency. Current Reg BI sub-manual section 4.2 lacks a documented escalation path for identified conflicts.",
    rule: "SEC Reg BI, 17 CFR § 240.15l-1(a)(2)(ii)(C)", wsp: "Regulation Best Interest", action: "Add escalation workflow to section 4.2 with named supervisory contacts and timelines."
  },
  {
    id: "g4", category: "Missing", severity: "Medium",
    title: "No annual review procedure for Heightened Supervision plan",
    description: "FINRA Rule 3110(f) requires annual review and update of heightened supervision plans. No such review procedure exists in the current Heightened Supervision sub-manual.",
    rule: "FINRA Rule 3110(f)", wsp: "Heightened Supervision", action: "Add section 7.1 documenting the annual review cadence, responsible party, and sign-off requirements."
  },
  {
    id: "g5", category: "Outdated", severity: "Medium",
    title: "AML CDD threshold references pre-2024 FinCEN guidance",
    description: "Section 8.2 of the AML sub-manual references FinCEN's 2016 CDD Rule. FinCEN's 2024 beneficial ownership reporting rule under the CTA introduces new verification requirements.",
    rule: "FinCEN CTA Beneficial Ownership Rule (2024)", wsp: "AML / CIP / CDD", action: "Update section 8.2 to incorporate CTA beneficial ownership verification requirements effective Jan 1, 2024."
  },
  {
    id: "g6", category: "Reg BI", severity: "Medium",
    title: "Retail Brokerage lacks Reg BI product recommendation documentation requirement",
    description: "SEC 2026 Exam Priorities specifically call out failure to document the basis for product recommendations. Retail Brokerage section 5.4 does not require written documentation of the recommendation rationale.",
    rule: "SEC Reg BI, 17 CFR § 240.15l-1(a)(1)", wsp: "Retail Brokerage", action: "Amend section 5.4 to require written documentation of recommendation basis for each client interaction."
  },
  {
    id: "g7", category: "Recommended", severity: "Low",
    title: "Add explicit SEC Rule 17a-4 WORM storage attestation to Recordkeeping",
    description: "While the Recordkeeping sub-manual addresses retention periods, it does not explicitly attest to WORM-compliant storage. Examiners increasingly request this specific confirmation.",
    rule: "SEC Rule 17a-4(f)", wsp: "Recordkeeping", action: "Add section 11.5 confirming WORM-compliant storage vendor, configuration, and annual verification."
  },
];

const versionHistory = [
  { version: "v3.2", date: "Apr 1, 2026", user: "@sarah.chen", summary: "Updated supervisor assignment matrix per Q1 org change", hash: "a3f9c1d" },
  { version: "v3.1", date: "Mar 15, 2026", user: "@dana.park", summary: "Added section 10.3 for remote supervision procedures", hash: "b7e2a4f" },
  { version: "v3.0", date: "Feb 28, 2026", user: "@sarah.chen", summary: "Major revision: incorporated FINRA Regulatory Notice 24-02", hash: "c1d8b3e" },
  { version: "v2.9", date: "Jan 10, 2026", user: "@james.whitfield", summary: "Minor edits to section 4 escalation language", hash: "d4f7c2a" },
];

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  // Color-blind accessible: uses blue for ok/success, amber for warnings,
  // orange for critical/overdue — never relies on red-vs-green alone.
  const styles: Record<string, string> = {
    "Current":    "bg-blue-100 text-blue-700 border-blue-200",
    "Needs Review": "bg-amber-100 text-amber-700 border-amber-200",
    "Overdue":    "bg-orange-100 text-orange-700 border-orange-200",
    "Completed":  "bg-blue-100 text-blue-700 border-blue-200",
    "Pending":    "bg-sky-100 text-sky-700 border-sky-200",
    "High":       "bg-orange-100 text-orange-700 border-orange-200",
    "Medium":     "bg-amber-100 text-amber-700 border-amber-200",
    "Low":        "bg-gray-100 text-gray-600 border-gray-200",
    "Missing":    "bg-orange-100 text-orange-700 border-orange-200",
    "Outdated":   "bg-amber-100 text-amber-700 border-amber-200",
    "Reg BI":     "bg-purple-100 text-purple-700 border-purple-200",
    "Recommended": "bg-blue-100 text-blue-700 border-blue-200",
    "Draft":      "bg-gray-100 text-gray-600 border-gray-200",
    "Approved":   "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${styles[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

// ─── View 1: WSP Library Dashboard ───────────────────────────────────────────

function WSPLibraryView({ onOpenEditor, onOpenAttestation, onOpenGapAnalysis, liveManuals, liveAlerts, backendOnline, finraHealth }: {
  onOpenEditor: (id: string) => void;
  onOpenAttestation: () => void;
  onOpenGapAnalysis: () => void;
  liveManuals?: SubManual[];
  liveAlerts?: FinraAlert[];
  backendOnline?: boolean | null;
  finraHealth?: { backend: boolean; rulebook: boolean; notification: boolean; registration: boolean; lastSync: string; } | null;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Current" | "Needs Review" | "Overdue">("All");

  const displayManuals = liveManuals && liveManuals.length > 0 ? liveManuals : subManuals;
  const displayAlerts = liveAlerts && liveAlerts.length > 0 ? liveAlerts : finraAlerts;

  // Map manualId → alerts for quick lookup
  const alertsByManual = displayAlerts.reduce<Record<string, FinraAlert[]>>((acc, a) => {
    if (!acc[a.manualId]) acc[a.manualId] = [];
    acc[a.manualId].push(a);
    return acc;
  }, {});

  const filtered = displayManuals.filter(m =>
    (filter === "All" || m.status === filter) &&
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalSections = displayManuals.reduce((s, m) => s + m.sections, 0);
  const completedSections = displayManuals.reduce((s, m) => s + Math.round(m.sections * m.completion / 100), 0);
  const overdueCount = displayManuals.filter(m => m.status === "Overdue").length;
  const needsReviewCount = displayManuals.filter(m => m.status === "Needs Review").length;
  const pendingAttestations = attestations.filter(a => a.status !== "Completed").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WSP Management</h1>
          <p className="text-muted-foreground mt-1">Written Supervisory Procedures library — FINRA Rule 3110 compliance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenGapAnalysis}>
            <Zap className="h-4 w-4 text-yellow-500" />
            Run Gap Analysis
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onOpenAttestation}>
            <UserCheck className="h-4 w-4" />
            Attestation Center
          </Button>
          <Button size="sm" variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            New Sub-Manual
          </Button>
        </div>
      </div>

      {/* FINRA Feed Status Bar */}
      {(() => {
        const apiDot = (connected: boolean | undefined | null, loading: boolean) =>
          loading ? 'bg-amber-400' : connected ? 'bg-blue-500' : 'bg-gray-400';
        const isLoading = finraHealth === null && backendOnline === null;
        const lastSyncLabel = finraHealth
          ? (() => {
              const diff = Math.round((Date.now() - new Date(finraHealth.lastSync).getTime()) / 1000);
              if (diff < 60) return `${diff}s ago`;
              if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
              return new Date(finraHealth.lastSync).toLocaleTimeString();
            })()
          : 'Connecting...';
        return (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendOnline ? 'bg-blue-400' : 'bg-gray-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${backendOnline ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
              </span>
              <Radio className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">FINRA Regulatory Feed</span>
              <span className="text-xs text-muted-foreground">· {backendOnline ? 'Live' : backendOnline === false ? 'Offline' : 'Connecting'} · Last sync {lastSyncLabel}</span>
            </div>
            <div className="flex items-center gap-3 ml-auto text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1" title={finraHealth?.rulebook ? 'Connected' : 'Not entitled — request finraRulebook dataset access'}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${apiDot(finraHealth?.rulebook, isLoading)}`} aria-label={finraHealth?.rulebook ? 'Connected' : 'Not connected'}></span>
                Rulebook API
              </span>
              <span className="flex items-center gap-1" title={finraHealth?.notification ? 'Connected' : 'Checking...'}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${apiDot(finraHealth?.notification, isLoading)}`} aria-label={finraHealth?.notification ? 'Connected' : 'Not connected'}></span>
                Notification API
              </span>
              <span className="flex items-center gap-1" title={finraHealth?.backend ? 'Connected — OAuth token active' : 'Not connected'}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${apiDot(finraHealth?.backend, isLoading)}`} aria-label={finraHealth?.backend ? 'Connected' : 'Not connected'}></span>
                Backend API
              </span>
              <span className="flex items-center gap-1" title={finraHealth?.registration ? 'Connected' : 'Not entitled — request registration dataset access'}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${apiDot(finraHealth?.registration, isLoading)}`} aria-label={finraHealth?.registration ? 'Connected' : 'Not connected'}></span>
                Registration API
              </span>
              {displayAlerts.length > 0 && (
                <span className="ml-2 flex items-center gap-1 text-orange-600 font-semibold" role="alert">
                  <AlertTriangle className="h-3 w-3" />
                  {displayAlerts.length} new alert{displayAlerts.length > 1 ? 's' : ''} require WSP updates
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WSP Sections</p>
          <p className="text-2xl font-bold mt-1">{completedSections}<span className="text-sm font-normal text-muted-foreground">/{totalSections}</span></p>
          <p className="text-xs text-blue-600 mt-1 font-medium">Current or approved</p>
        </div>
        <div className="rounded-lg border bg-orange-50/50 border-orange-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Overdue</p>
          <p className="text-2xl font-bold mt-1 text-orange-700">{overdueCount}</p>
          <p className="text-xs text-orange-600 mt-1 font-medium">Sub-manuals past review date</p>
        </div>
        <div className="rounded-lg border bg-yellow-50/50 border-yellow-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">Needs Review</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{needsReviewCount}</p>
          <p className="text-xs text-yellow-600 mt-1 font-medium">Flagged for update</p>
        </div>
        <div className="rounded-lg border bg-blue-50/50 border-blue-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Pending Attestations</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{pendingAttestations}</p>
          <p className="text-xs text-blue-500 mt-1 font-medium">Awaiting supervisor sign-off</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sub-manuals..."
            className="pl-9 h-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {(["All", "Current", "Needs Review", "Overdue"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-2 ml-auto">
          <Upload className="h-4 w-4" />
          Import WSP
        </Button>
      </div>

      {/* Sub-Manual Table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b">
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sub-Manual</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sections</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completion</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Last Updated</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Supervisor</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Version</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(m => {
              const alerts = alertsByManual[m.id] || [];
              const highAlert = alerts.find(a => a.severity === "High");
              const topAlert = highAlert || alerts[0];
              return (
              <tr key={m.id} className="hover:bg-muted/20 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {alerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{m.title}</span>
                      {topAlert && (
                        <p className="text-[10px] text-orange-600 mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="h-2.5 w-2.5 shrink-0" />
                          {topAlert.rule} · {topAlert.receivedAt}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.sections}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={m.completion} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{m.completion}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{m.lastUpdated}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{m.supervisor}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-muted-foreground">{m.version}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => onOpenEditor(m.id)}>
                      <Edit2 className="h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                      <Download className="h-3 w-3" /> Export
                    </Button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Templates Section */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pre-Built Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {["General Supervision", "Retail Brokerage", "AML / CIP / CDD", "Communications", "Recordkeeping", "Heightened Supervision"].map(t => (
            <div key={t} className="rounded-lg border p-3 hover:border-foreground/30 hover:bg-muted/20 cursor-pointer transition-colors group">
              <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-foreground mb-2 transition-colors" />
              <p className="text-xs font-medium text-foreground leading-snug">{t}</p>
              <p className="text-[10px] text-muted-foreground mt-1">FINRA 3110-aligned</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── View 2: WSP Editor ───────────────────────────────────────────────────────

function WSPEditorView({ manualId, onBack, liveAlerts }: { manualId: string; onBack: () => void; liveAlerts?: FinraAlert[] }) {
  const manual = subManuals.find(m => m.id === manualId) || subManuals[0];
  const [activeSection, setActiveSection] = useState("1.1");
  const [showHistory, setShowHistory] = useState(false);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Use live alerts if available, fall back to mock data
  const allAlerts = (liveAlerts && liveAlerts.length > 0) ? liveAlerts : finraAlerts;
  const activeAlerts = allAlerts.filter(
    a => a.manualId === manualId && !dismissedAlerts.includes(a.id)
  );

  const sections = [
    { id: "1", title: "Purpose and Scope", subsections: ["1.1 Purpose", "1.2 Scope of Application", "1.3 Regulatory Basis"] },
    { id: "2", title: "Supervisory Structure", subsections: ["2.1 Designated Supervisors", "2.2 Reporting Lines", "2.3 Escalation Procedures"] },
    { id: "3", title: "Supervisory Procedures", subsections: ["3.1 Daily Supervision", "3.2 Review Cadence", "3.3 Exception Handling"] },
    { id: "4", title: "Training Requirements", subsections: ["4.1 Initial Training", "4.2 Annual Certification"] },
    { id: "5", title: "Recordkeeping", subsections: ["5.1 Document Retention", "5.2 Audit Trail Requirements"] },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Panel: Section Outline */}
      <div className="w-56 border-r border-border flex flex-col shrink-0">
        <div className="h-14 border-b border-border flex items-center px-3 gap-2 shrink-0">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{manual.title}</p>
            <p className="text-[10px] text-muted-foreground">{manual.version} · {manual.sections} sections</p>
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-0.5">
            {sections.map(sec => (
              <div key={sec.id}>
                <div className="px-2 py-1.5 text-xs font-semibold text-foreground">{sec.id}. {sec.title}</div>
                {sec.subsections.map(sub => {
                  const subId = sub.split(" ")[0];
                  return (
                    <button
                      key={subId}
                      onClick={() => setActiveSection(subId)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${activeSection === subId ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-border">
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8">
            <Plus className="h-3 w-3" /> Add Section
          </Button>
        </div>
      </div>

      {/* Center Panel: Rich Text Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* FINRA Change Notification Banner */}
        {activeAlerts.length > 0 && (
          <div className="border-b-2 border-blue-200 bg-blue-50 shrink-0" role="alert" aria-label="FINRA regulatory alerts">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="px-5 py-4">
                {/* Header row */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-blue-900">{alert.rule}</span>
                      <StatusBadge status={alert.severity} />
                      <span className="text-[10px] text-blue-500 ml-auto">via {alert.source} · {alert.receivedAt}</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-700 mt-1">{alert.summary}</p>
                  </div>
                  <button
                    onClick={() => setDismissedAlerts(d => [...d, alert.id])}
                    className="shrink-0 p-1 text-blue-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-100"
                    aria-label="Dismiss alert"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>

                {/* What Changed panel */}
                <div className="mt-3 ml-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Rule Update Detail */}
                  <div className="md:col-span-2 rounded-md border border-blue-200 bg-white/70 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> What Changed
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">{alert.detail}</p>
                  </div>
                  {/* Affected Section + Action */}
                  <div className="rounded-md border border-blue-200 bg-white/70 p-3 flex flex-col gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Affected Section
                      </p>
                      <p className="text-xs font-medium text-gray-800">{alert.affectedSection || "Review all sections"}</p>
                    </div>
                    <div className="border-t border-blue-100 pt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Required Action
                      </p>
                      <p className="text-xs text-gray-700">Update this WSP section to reflect the regulatory change before the effective date.</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 ml-8">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                    <Edit2 className="h-3 w-3" /> Update WSP Now
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded text-xs font-medium hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                    <ExternalLink className="h-3 w-3" /> View Full Rule on FINRA.org
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editor Toolbar */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-2 shrink-0">
          <div className="flex gap-1 border-r border-border pr-3 mr-1">
            <button className="px-2 py-1 text-xs font-bold hover:bg-secondary rounded">B</button>
            <button className="px-2 py-1 text-xs italic hover:bg-secondary rounded">I</button>
            <button className="px-2 py-1 text-xs underline hover:bg-secondary rounded">U</button>
          </div>
          <div className="flex gap-1 border-r border-border pr-3 mr-1">
            <button className="px-2 py-1 text-xs hover:bg-secondary rounded">H1</button>
            <button className="px-2 py-1 text-xs hover:bg-secondary rounded">H2</button>
            <button className="px-2 py-1 text-xs hover:bg-secondary rounded">¶</button>
            <button className="px-2 py-1 text-xs hover:bg-secondary rounded">• List</button>
          </div>
          <div className="flex gap-1">
            <button className="px-2 py-1 text-xs hover:bg-secondary rounded flex items-center gap-1">
              <Tag className="h-3 w-3" /> Cite Rule
            </button>
          </div>
          <div className="ml-auto flex gap-2">
            <StatusBadge status="Draft" />
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={handleSave} disabled={saving}>
              <Save className="h-3 w-3" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Send className="h-3 w-3" /> Submit for Approval
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Download className="h-3 w-3" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <ScrollArea className="flex-1 p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Section Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">FINRA Rule 3110(a)</span>
                <span className="text-xs text-muted-foreground">· Last edited by @sarah.chen · Apr 1, 2026</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">1.1 Purpose</h2>
            </div>

            {/* Editable Content Block */}
            <div className="prose prose-sm max-w-none">
              <div
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-sm text-foreground leading-relaxed space-y-3 focus:ring-1 focus:ring-border rounded p-2 -m-2"
              >
                <p>
                  This Written Supervisory Procedures Manual ("WSP Manual") establishes the supervisory system required by FINRA Rule 3110 for [Firm Name] ("the Firm"). The purpose of this Manual is to set forth the specific written supervisory procedures that the Firm has established to supervise the activities of its registered representatives and associated persons.
                </p>
                <p>
                  The Firm is committed to maintaining a supervisory system that is reasonably designed to achieve compliance with applicable securities laws and regulations, including the rules of FINRA, the SEC, and other applicable self-regulatory organizations. This Manual is a living document and shall be reviewed and updated at least annually, or more frequently as required by changes in applicable rules and regulations.
                </p>
                <p>
                  All supervisory personnel are required to read, understand, and comply with the procedures set forth in this Manual. Questions regarding the interpretation or application of any procedure should be directed to the Chief Compliance Officer.
                </p>
              </div>
            </div>

            {/* Regulatory Citation Block */}
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">Regulatory Basis</p>
                  <p className="text-xs text-blue-600">
                    <strong>FINRA Rule 3110(a)</strong> — Each member shall establish and maintain a system to supervise the activities of each associated person that is reasonably designed to achieve compliance with applicable securities laws and regulations, and with applicable FINRA rules.
                  </p>
                  <a href="#" className="text-xs text-blue-500 underline mt-1 inline-flex items-center gap-1">
                    View full rule text <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* AI-Generated Draft Indicator */}
            <div className="rounded-lg border border-dashed border-border p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-semibold text-foreground">AI Draft — Section 1.2 Scope of Application</span>
                <StatusBadge status="Draft" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This Manual applies to all registered representatives, principals, and associated persons of the Firm, including those operating from branch offices and remote locations. The supervisory requirements set forth herein apply to all business activities conducted on behalf of the Firm, including but not limited to: retail brokerage, institutional sales, investment banking, research, and trading activities.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600" /> Accept
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <Edit2 className="h-3 w-3" /> Refine
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground">
                  <XCircle className="h-3 w-3" /> Discard
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: AI Assistant + References + Version History */}
      <div className="w-72 border-l border-border flex flex-col shrink-0">
        {/* Tabs */}
        <div className="h-14 border-b border-border flex items-center px-1 gap-0.5 shrink-0">
          {[
            { id: false, label: "AI Assistant", icon: MessageSquare },
            { id: true, label: "History", icon: History },
          ].map(tab => (
            <button
              key={String(tab.id)}
              onClick={() => setShowHistory(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded text-xs font-medium transition-colors ${showHistory === tab.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {!showHistory ? (
          /* AI Assistant Panel */
          <div className="flex flex-col flex-1 min-h-0">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-background">D</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground leading-relaxed">
                    I'm reviewing Section 1.1. This section aligns with FINRA Rule 3110(a). I recommend adding a specific reference to the Firm's designated supervisory structure in paragraph 2.
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-secondary rounded-lg p-3 text-xs text-foreground max-w-[85%]">
                    Can you draft the scope section for a firm that does retail and institutional business?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-background">D</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-foreground leading-relaxed">
                      Draft generated for Section 1.2. It covers retail brokerage, institutional sales, and includes remote supervision language per FINRA Regulatory Notice 21-44.
                    </div>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground hover:text-foreground">Insert into editor</button>
                      <button className="px-2 py-1 bg-secondary rounded text-[10px] text-muted-foreground hover:text-foreground">Refine</button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-border">
              <ChatInput query={query} setQuery={setQuery} placeholder="Ask DMP AI..." />
            </div>
          </div>
        ) : (
          /* Version History Panel */
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Version History</p>
              {versionHistory.map((v, i) => (
                <div key={v.version} className={`rounded-lg border p-3 space-y-1.5 ${i === 0 ? "border-foreground/20 bg-muted/20" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-foreground">{v.version}</span>
                    {i === 0 && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Current</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{v.date} · {v.user}</p>
                  <p className="text-xs text-foreground leading-snug">{v.summary}</p>
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-mono text-muted-foreground">{v.hash}</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> View
                    </button>
                    {i > 0 && (
                      <button className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 ml-2">
                        <RefreshCw className="h-3 w-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ─── View 3: Attestation Center ───────────────────────────────────────────────

function AttestationCenterView({ onBack, liveAttestations }: { onBack: () => void; liveAttestations?: AttestationRow[] }) {
  const [filter, setFilter] = useState<"All" | "Pending" | "Overdue" | "Completed">("All");

  const data = liveAttestations && liveAttestations.length > 0 ? liveAttestations : attestations;
  const filtered = data.filter(a => filter === "All" || a.status === filter);
  const completed = data.filter(a => a.status === "Completed").length;
  const pending = data.filter(a => a.status === "Pending").length;
  const overdue = data.filter(a => a.status === "Overdue").length;
  const total = data.length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Attestation Center</h1>
          <p className="text-muted-foreground mt-1">Track supervisor acknowledgments and WSP review completions.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-4 w-4" /> Assign Attestation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Assigned</p>
          <p className="text-3xl font-bold mt-1">{total}</p>
          <Progress value={(completed / total) * 100} className="h-1 mt-2" />
        </div>
        <div className="rounded-lg border bg-green-50/50 border-green-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">Completed</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{completed}</p>
          <p className="text-xs text-green-600 mt-1">{Math.round((completed / total) * 100)}% completion rate</p>
        </div>
        <div className="rounded-lg border bg-blue-50/50 border-blue-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Pending</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{pending}</p>
          <p className="text-xs text-blue-500 mt-1">Awaiting review</p>
        </div>
        <div className="rounded-lg border bg-red-50/50 border-red-100 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">Overdue</p>
          <p className="text-3xl font-bold mt-1 text-red-600">{overdue}</p>
          <p className="text-xs text-red-500 mt-1">Past due date</p>
        </div>
      </div>

      {/* Per-Supervisor Breakdown */}
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold mb-3">Supervisor Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "James Whitfield", role: "Branch Manager", completed: 1, total: 2 },
            { name: "Dana Park", role: "Dept. Head", completed: 1, total: 2 },
            { name: "Marcus Lee", role: "Supervisor", completed: 0, total: 2 },
            { name: "Sarah Chen", role: "CCO", completed: 0, total: 1 },
          ].map(s => (
            <div key={s.name} className="rounded border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.role}</p>
                </div>
              </div>
              <Progress value={(s.completed / s.total) * 100} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">{s.completed}/{s.total} completed</p>
              {s.completed < s.total && (
                <Button variant="outline" size="sm" className="h-6 text-[10px] w-full gap-1">
                  <Bell className="h-3 w-3" /> Send Reminder
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Table */}
      <div className="space-y-3">
        <div className="flex gap-1">
          {(["All", "Pending", "Overdue", "Completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b">
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">WSP Sub-Manual</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assignee</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Version</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Due Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completed</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground text-sm">{a.wsp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {a.assignee.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm text-foreground">{a.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.role}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.version}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.dueDate}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.completedDate || "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {a.status !== "Completed" && (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Bell className="h-3 w-3" /> Remind
                          </Button>
                        </>
                      )}
                      {a.status === "Completed" && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── View 4: Gap Analysis Report ─────────────────────────────────────────────

function GapAnalysisView({ onBack, liveGaps, onRefresh }: { onBack: () => void; liveGaps?: GapFinding[]; onRefresh?: () => void }) {
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(true);
  const [filter, setFilter] = useState<"All" | "Missing" | "Outdated" | "Reg BI" | "Recommended">("All");
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const data = liveGaps && liveGaps.length > 0 ? liveGaps : gapFindings;

  const handleRun = async () => {
    setRunning(true);
    setAnalysisError(null);
    try {
      // Run gap analysis for all WSPs against key rules
      await Promise.all([
        wspApi.runGapAnalysis('wsp-001', '3110'),
        wspApi.runGapAnalysis('wsp-002', '2111'),
        wspApi.runGapAnalysis('wsp-003', '3310'),
      ]);
      if (onRefresh) await onRefresh();
      setRan(true);
    } catch (err: any) {
      setAnalysisError(err.message ?? 'Analysis failed');
    } finally {
      setRunning(false);
    }
  };

  const filtered = data.filter(g => filter === "All" || g.category === filter);
  const high = data.filter(g => g.severity === "High").length;
  const medium = data.filter(g => g.severity === "Medium").length;
  const low = data.filter(g => g.severity === "Low").length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Regulatory Gap Analysis</h1>
          <p className="text-muted-foreground mt-1">AI-powered analysis against FINRA Rule 3110, SEC Reg BI, and 2026 Exam Priorities.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export as PDF
        </Button>
        <Button size="sm" variant="default" className="gap-2" onClick={handleRun} disabled={running}>
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
          {running ? "Analyzing..." : "Re-run Analysis"}
        </Button>
      </div>

      {/* Error Banner */}
      {analysisError && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 flex items-center gap-2 text-orange-700 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Analysis error: {analysisError}</span>
        </div>
      )}

      {/* Analysis Meta */}
      {ran && (
        <div className="rounded-lg border bg-muted/20 p-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs font-semibold text-foreground">Analysis Complete</p>
              <p className="text-[10px] text-muted-foreground">Apr 8, 2026 · 09:14 AM · Full WSP Library</p>
            </div>
          </div>
          <div className="h-8 border-l border-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">{high}</p>
            <p className="text-[10px] text-muted-foreground">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-600">{medium}</p>
            <p className="text-[10px] text-muted-foreground">Medium Priority</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-500">{low}</p>
            <p className="text-[10px] text-muted-foreground">Low Priority</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Checked against</p>
            <p className="text-xs font-medium text-foreground">FINRA Rule 3110 · SEC Reg BI · 2026 Exam Priorities · FinCEN CTA</p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-1">
        {(["All", "Missing", "Outdated", "Reg BI", "Recommended"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
          >
            {f}
            {f !== "All" && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({gapFindings.filter(g => g.category === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filtered.map(g => (
          <div key={g.id} className="rounded-lg border p-4 space-y-3 hover:border-foreground/20 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {g.severity === "High" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {g.severity === "Medium" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {g.severity === "Low" && <CheckCircle2 className="h-4 w-4 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <StatusBadge status={g.category} />
                  <StatusBadge status={g.severity} />
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{g.rule}</span>
                  <span className="text-[10px] text-muted-foreground">→ {g.wsp}</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.description}</p>
              </div>
            </div>
            <div className="rounded bg-muted/40 border border-border p-3 flex items-start gap-2">
              <Zap className="h-3.5 w-3.5 text-yellow-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-foreground mb-0.5">Recommended Action</p>
                <p className="text-xs text-muted-foreground">{g.action}</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 shrink-0">
                <ChevronRight className="h-3 w-3" /> Remediate
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main WSP Management Page ─────────────────────────────────────────────────

export default function WSPManagement() {
  const [view, setView] = useState<View>("library");
  const [editorManualId, setEditorManualId] = useState<string>("gs");

  // ── Live data from backend ──
  const [liveManuals, setLiveManuals] = useState<any[]>([]);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const [liveAttestations, setLiveAttestations] = useState<any[]>([]);
  const [liveGaps, setLiveGaps] = useState<any[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [finraHealth, setFinraHealth] = useState<{
    backend: boolean; rulebook: boolean; notification: boolean; registration: boolean; lastSync: string;
  } | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [manuals, alerts, attestations, gaps] = await Promise.all([
        wspApi.getManuals(),
        wspApi.getAlerts(),
        wspApi.getAttestations(),
        wspApi.getGaps(),
      ]);
      setLiveManuals(manuals);
      setLiveAlerts(alerts);
      setLiveAttestations(attestations);
      setLiveGaps(gaps);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
      // Fall back to static mock data silently
    }
  }, []);

  const fetchFinraHealth = useCallback(async () => {
    try {
      const h = await finraApi.getHealth();
      setFinraHealth({
        backend: h.backend,
        rulebook: h.rulebook,
        notification: h.notification,
        registration: h.registration,
        lastSync: h.lastSync,
      });
    } catch {
      setFinraHealth({ backend: false, rulebook: false, notification: false, registration: false, lastSync: new Date().toISOString() });
    }
  }, []);

  useEffect(() => {
    fetchAll();
    fetchFinraHealth();
    // Refresh FINRA health every 5 minutes
    const interval = setInterval(fetchFinraHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll, fetchFinraHealth]);

  const openEditor = (id: string) => {
    setEditorManualId(id);
    setView("editor");
  };

  // Merge live data with static fallbacks
  const displayManuals = liveManuals.length > 0
    ? liveManuals.map(m => ({
        id: m.id, title: m.title, sections: m.sections, completion: m.completion,
        lastUpdated: m.last_updated, supervisor: m.supervisor,
        status: (m.status === 'Under Review' ? 'Needs Review' : m.status === 'Needs Update' ? 'Overdue' : m.status) as SubManual['status'],
        version: m.version,
      }))
    : subManuals;

  const displayAlerts = liveAlerts.length > 0
    ? liveAlerts.map(a => ({
        id: a.id, manualId: a.manual_id ?? '', severity: a.severity,
        rule: a.rule, summary: a.summary, detail: a.detail, source: a.source,
        receivedAt: new Date(a.received_at).toLocaleString(),
        affectedSection: a.affected_section ?? '',
      }))
    : finraAlerts;

  const displayAttestations = liveAttestations.length > 0
    ? liveAttestations.map(a => ({
        id: a.id, wsp: a.wsp_id, assignee: a.assignee, role: a.role,
        dueDate: a.due_date, status: a.status, version: a.version,
        completedDate: a.completed_date,
      }))
    : attestations;

  const displayGaps = liveGaps.length > 0
    ? liveGaps.map(g => ({
        id: g.id, category: g.category as GapFinding['category'],
        severity: g.severity, title: g.title, description: g.description,
        rule: g.rule_reference, wsp: g.wsp_id, action: g.action_required,
      }))
    : gapFindings;

  if (view === "editor") {
    return <WSPEditorView manualId={editorManualId} onBack={() => setView("library")} liveAlerts={displayAlerts} />;
  }
  if (view === "attestation") {
    return <AttestationCenterView onBack={() => setView("library")} liveAttestations={displayAttestations} />;
  }
  if (view === "gap-analysis") {
    return <GapAnalysisView onBack={() => setView("library")} liveGaps={displayGaps} onRefresh={fetchAll} />;
  }

  return (
    <WSPLibraryView
      onOpenEditor={openEditor}
      onOpenAttestation={() => setView("attestation")}
      onOpenGapAnalysis={() => setView("gap-analysis")}
      liveManuals={displayManuals}
      liveAlerts={displayAlerts}
      backendOnline={backendOnline}
      finraHealth={finraHealth}
    />
  );
}
